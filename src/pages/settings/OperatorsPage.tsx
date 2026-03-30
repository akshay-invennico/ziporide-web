import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

import DataTable, { type Column } from '../../components/ui/DataTable';
import OperatorModal from '../../components/ui/OperatorModal';
import RemoveOperatorModal from '../../components/ui/RemoveOperatorModal';
import {
  useOperators,
  useCreateOperator,
  useUpdateOperator,
  useDeleteOperator,
} from '../../hooks/useOperatorData';
import { usePermissions } from '../../hooks/usePermissions';
import type {
  Operator,
  CreateOperatorPayload,
  UpdateOperatorPayload,
} from '../../types/operator.types';

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-[#DCFCE7] text-[#00A63E]',
  manager: 'bg-[#FFF3D4] text-[#F6921E]',
  operator: 'bg-[#EEFFFD] text-[#1DAFA1]',
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Super Admin',
  manager: 'Manager',
  operator: 'Operator',
};

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
  active: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
  suspended: { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' },
  inactive: { dot: 'bg-[#939999]', text: 'text-[#939999]' },
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-CA');
};

const OperatorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { hasPermission } = usePermissions();

  const { operators, loading, totalPages, refetch } = useOperators(
    currentPage,
    itemsPerPage,
    searchQuery,
  );

  const { createOperator, isCreating } = useCreateOperator();
  const { updateOperator, isUpdating } = useUpdateOperator();
  const { deleteOperator, isDeleting } = useDeleteOperator();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

  const openModal = (mode: 'add' | 'edit' | 'view', operator?: Operator) => {
    setModalMode(mode);
    setSelectedOperator(operator || null);
    setIsModalOpen(true);
  };

  const openRemoveModal = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsRemoveModalOpen(true);
  };

  const handleConfirm = async (values: CreateOperatorPayload | UpdateOperatorPayload) => {
    try {
      if (modalMode === 'add') {
        await createOperator(values as CreateOperatorPayload);
      } else if (modalMode === 'edit' && selectedOperator) {
        await updateOperator(selectedOperator.id, values as UpdateOperatorPayload);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error('error in creating operator', error);
    }
  };

  const handleRemoveConfirm = async () => {
    if (!selectedOperator) return;
    try {
      await deleteOperator(selectedOperator.id);
      setIsRemoveModalOpen(false);
      setSelectedOperator(null);
      refetch();
    } catch (error) {
      console.error('error in remove operator', error);
    }
  };

  const columns = useMemo<Column<Operator>[]>(
    () => [
      {
        key: 'operatorId',
        label: 'ID',
        sortable: true,
        render: (row) => (
          <span className="text-[14px] font-medium text-[#1DAFA1]">{row.operatorId}</span>
        ),
      },
      {
        key: 'name',
        label: 'NAME',
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
              {getInitials(row.name)}
            </div>
            <span className="text-[14px] font-medium text-[#1DAFA1]">{row.name}</span>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'EMAIL',
        sortable: true,
        render: (row) => (
          <span className="text-[14px] font-medium text-[#1DAFA1]">{row.email}</span>
        ),
      },
      {
        key: 'role',
        label: 'ROLE',
        sortable: true,
        render: (row) => (
          <span
            className={`px-3 py-2 rounded-full text-[12px] font-semibold ${ROLE_STYLES[row.role] || 'bg-gray-100 text-gray-600'}`}
          >
            {ROLE_LABELS[row.role] || row.role}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'CREATED ON',
        sortable: true,
        render: (row) => (
          <span className="text-[14px] font-medium text-[#4E616A]">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (row) => {
          const style = STATUS_STYLES[row.status] || STATUS_STYLES.inactive;
          return (
            <div className="flex items-center gap-2">
              <div className={`w-[6px] h-[6px] rounded-full ${style.dot}`} />
              <span className={`text-[12px] font-semibold capitalize ${style.text}`}>
                {row.status}
              </span>
            </div>
          );
        },
      },
      {
        key: 'actions',
        label: 'ACTIONS',
        render: (row) => (
          <div className="flex items-center gap-4">
            {hasPermission('operators.view') && (
              <button onClick={() => openModal('view', row)} className="cursor-pointer">
                <img src="/icons/settings/eye.svg" alt="view" className="w-[20px] h-[20px]" />
              </button>
            )}
            {hasPermission('operators.manage') && (
              <button onClick={() => openModal('edit', row)} className="cursor-pointer">
                <img src="/icons/settings/edit.svg" alt="edit" className="w-[22px] h-[22px]" />
              </button>
            )}
            {hasPermission('operators.remove') && (
              <button onClick={() => openRemoveModal(row)} className="cursor-pointer">
                <img src="/icons/settings/remove.svg" alt="remove" className="w-[22px] h-[22px]" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [hasPermission],
  );

  return (
    <div className="w-full flex flex-col gap-4 p-1">
      <div className="bg-white rounded-lg border border-[#DFE6E5] overflow-hidden">
        {/* Search and Add Operator Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-[20px] w-[20px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-full border border-[#DFE6E5] rounded-sm text-[14px] outline-none focus:border-[#1DAFA1] transition-colors"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {hasPermission('operators.manage') && (
            <button
              onClick={() => openModal('add')}
              className="flex items-center gap-2 bg-[#1DAFA1] text-white px-4 py-2 rounded-sm text-[14px] font-medium cursor-pointer"
            >
              <img src="/icons/settings/add.svg" alt="add" className="w-[22px] h-[22px]" />
              Add Operator
            </button>
          )}
        </div>

        {/* DataTable */}
        <DataTable<Operator>
          columns={columns}
          data={operators}
          rowKey={(row) => row.id}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyText="No operators found"
        />
      </div>

      {/* Modals */}
      <OperatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedOperator}
        onConfirm={handleConfirm}
        isSubmitting={isCreating || isUpdating}
      />

      <RemoveOperatorModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onRemove={handleRemoveConfirm}
        isRemoving={isDeleting}
      />
    </div>
  );
};

export default OperatorsPage;
