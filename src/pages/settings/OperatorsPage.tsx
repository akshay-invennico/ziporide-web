import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import OperatorModal from '../../components/ui/OperatorModal';
import RemoveOperatorModal from '../../components/ui/RemoveOperatorModal';

const operatorsData = [
  {
    id: 'ZPT-2845148',
    name: 'Mia Chen',
    phone: '+44 231 5623',
    email: 'miachen@email.com',
    role: 'Super Admin',
    createdOn: '2025-03-25',
    status: 'Active',
    avatar: 'MC',
    permissions: ['view_dashboard_analytics', 'view_revenue_insights', 'view_riders', 'view_rider_details', 'suspend_reactive_rider', 'view_drivers', 'view_driver_details', 'approve_reject_drivers', 'suspend_activate_driver', 'view_verification_requests', 'review_documents', 'approve_reject_verification', 'view_all_trips', 'view_trip_details', 'cancel_ride', 'force_end_ride', 'view_categories', 'create_category', 'edit_category', 'delete_category', 'view_tickets', 'respond_to_tickets', 'close_tickets', 'view_pricing', 'edit_pricing_logic', 'send_notifications', 'view_operators', 'add_edit_operator', 'remove_operator'],
  },
  {
    id: 'ZPT-2845149',
    name: 'Amir Suleiman',
    phone: '+44 231 5632',
    email: 'john.doe@email.com',
    role: 'Manager',
    createdOn: '2025-04-10',
    status: 'Active',
    avatar: 'AS',
    permissions: ['view_dashboard_analytics', 'view_revenue_insights', 'view_riders', 'view_rider_details', 'suspend_reactive_rider', 'view_drivers', 'view_driver_details', 'approve_reject_drivers', 'view_all_trips', 'view_trip_details', 'view_categories', 'view_tickets', 'view_pricing', 'view_operators'],
  },
  {
    id: 'ZPT-2845150',
    name: 'Ravi Kumar',
    phone: '+44 231 5641',
    email: 'sarah.connor@email.com',
    role: 'Operator',
    createdOn: '2025-05-15',
    status: 'Active',
    avatar: 'RK',
    permissions: ['view_riders', 'view_driver_details', 'view_all_trips', 'view_tickets'],
  },
  {
    id: 'ZPT-2845151',
    name: 'Lara Brown',
    phone: '+44 231 5650',
    email: 'peter.parker@email.com',
    role: 'Operator',
    createdOn: '2025-06-20',
    status: 'Active',
    avatar: 'LB',
    permissions: ['view_riders', 'view_driver_details', 'view_all_trips', 'view_tickets'],
  },
  {
    id: 'ZPT-2845152',
    name: 'Tommy Nguyen',
    phone: '+44 231 5669',
    email: 'bruce.wayne@email.com',
    role: 'Operator',
    createdOn: '2025-07-30',
    status: 'Active',
    avatar: 'TN',
    permissions: ['view_riders', 'view_driver_details', 'view_all_trips', 'view_tickets'],
  },
  {
    id: 'ZPT-2845153',
    name: 'Sophia Williams',
    phone: '+44 231 5670',
    email: 'sophia.w@email.com',
    role: 'Operator',
    createdOn: '2025-08-10',
    status: 'Active',
    avatar: 'SW',
    permissions: ['view_riders', 'view_driver_details', 'view_all_trips', 'view_tickets'],
  },
  {
    id: 'ZPT-2845154',
    name: 'James Wilson',
    phone: '+44 231 5681',
    email: 'james.wilson@email.com',
    role: 'Manager',
    createdOn: '2025-09-05',
    status: 'Active',
    avatar: 'JW',
    permissions: ['view_dashboard_analytics', 'view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845155',
    name: 'Isabella Taylor',
    phone: '+44 231 5692',
    email: 'isabella.t@email.com',
    role: 'Operator',
    createdOn: '2025-10-15',
    status: 'Active',
    avatar: 'IT',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845156',
    name: 'Daniel Evans',
    phone: '+44 231 5703',
    email: 'daniel.evans@email.com',
    role: 'Operator',
    createdOn: '2025-11-20',
    status: 'Active',
    avatar: 'DE',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845157',
    name: 'Olivia Jones',
    phone: '+44 231 5714',
    email: 'olivia.j@email.com',
    role: 'Operator',
    createdOn: '2025-12-05',
    status: 'Active',
    avatar: 'OJ',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845158',
    name: 'Liam Brown',
    phone: '+44 231 5725',
    email: 'liam.brown@email.com',
    role: 'Operator',
    createdOn: '2026-01-10',
    status: 'Active',
    avatar: 'LB',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845159',
    name: 'Emma Garcia',
    phone: '+44 231 5736',
    email: 'emma.garcia@email.com',
    role: 'Operator',
    createdOn: '2026-02-15',
    status: 'Active',
    avatar: 'EG',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845160',
    name: 'Noah Miller',
    phone: '+44 231 5747',
    email: 'noah.miller@email.com',
    role: 'Operator',
    createdOn: '2026-03-01',
    status: 'Active',
    avatar: 'NM',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845161',
    name: 'Ava Martinez',
    phone: '+44 231 5758',
    email: 'ava.m@email.com',
    role: 'Operator',
    createdOn: '2026-03-10',
    status: 'Active',
    avatar: 'AM',
    permissions: ['view_riders', 'view_all_trips'],
  },
  {
    id: 'ZPT-2845162',
    name: 'William Davis',
    phone: '+44 231 5769',
    email: 'william.davis@email.com',
    role: 'Operator',
    createdOn: '2026-03-20',
    status: 'Active',
    avatar: 'WD',
    permissions: ['view_riders', 'view_all_trips'],
  },
];

const OperatorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedOperator, setSelectedOperator] = useState<any>(null);

  const filteredData = operatorsData.filter((operator) =>
    operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    operator.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    operator.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const openModal = (mode: 'add' | 'edit' | 'view', operator?: any) => {
    setModalMode(mode);
    setSelectedOperator(operator || null);
    setIsModalOpen(true);
  };

  const openRemoveModal = (operator: any) => {
    setSelectedOperator(operator);
    setIsRemoveModalOpen(true);
  };

  const handleRemoveConfirm = () => {
    console.log('Removing operator:', selectedOperator?.id);
    // Add removal logic here
    setIsRemoveModalOpen(false);
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-[#DCFCE7] text-[#00A63E]';
      case 'Manager':
        return 'bg-[#FFF3D4] text-[#F6921E]';
      case 'Operator':
        return 'bg-[#EEFFFD] text-[#1DAFA1]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

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
          <button
            onClick={() => openModal('add')}
            className="flex items-center gap-2 bg-[#1DAFA1] text-white px-4 py-2 rounded-sm text-[14px] font-medium cursor-pointer"
          >
            <img src="/icons/settings/add.svg" alt="add" className='w-[22px] h-[22px]' />
            Add Operator
          </button>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase  text-[#4E616A]">
                {[
                  { label: 'ID', sortable: true },
                  { label: 'NAME', sortable: true },
                  { label: 'EMAIL', sortable: true },
                  { label: 'ROLE', sortable: true },
                  { label: 'CREATED ON', sortable: true },
                  { label: 'STATUS', sortable: true },
                  { label: 'ACTIONS', sortable: false },
                ].map((header) => (
                  <th
                    key={header.label}
                    className={`px-6 py-4 ${header.sortable ? 'cursor-pointer group hover:bg-gray-50' : ''}`}
                  >
                    <div
                      className={`flex items-center ${header.sortable ? 'justify-between' : 'justify-start'}`}
                    >
                      <span>{header.label}</span>
                      {header.sortable && (
                        <img
                          src="/icons/rider/updown.svg"
                          alt="sort"
                          className="w-[18px] h-[18px]"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE6E5]">
              {currentData.map((operator) => (
                <tr key={operator.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[14px] font-medium text-[#1DAFA1]">
                    {operator.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px]">
                        {operator.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-[#1DAFA1]">{operator.name}</span>
                        <span className="text-[12px] font-medium text-[#4E616A]">{operator.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-medium text-[#1DAFA1]">
                    {operator.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-2 rounded-full text-[12px] font-semibold ${getRoleStyle(operator.role)}`}>
                      {operator.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-medium text-[#4E616A]">
                    {operator.createdOn}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-[6px] h-[6px] rounded-full bg-[#00A63E]" />
                      <span className="text-[12px] font-semibold text-[#00A63E]">{operator.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openModal('view', operator)}
                        className="  cursor-pointer "
                      >
                        <img src="/icons/settings/eye.svg" alt="view" className='w-[20px] h-[20px]' />
                      </button>
                      <button
                        onClick={() => openModal('edit', operator)}
                        className="  cursor-pointer "
                      >
                        <img src="/icons/settings/edit.svg" alt="edit" className='w-[22px] h-[22px]' />
                      </button>
                      <button 
                        onClick={() => openRemoveModal(operator)}
                        className=" cursor-pointer"
                      >
                        <img src="/icons/settings/remove.svg" alt="remove" className='w-[22px] h-[22px]' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info & Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-[24px] w-[24px] cursor-pointer" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[32px] h-8 flex items-center cursor-pointer justify-center rounded-lg text-[14px] font-semibold transition-colors ${currentPage === pageNum
                          ? 'bg-teal-50 text-[#1DAFA1] border border-[#1DAFA1]'
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="text-gray-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-[24px] w-[24px] cursor-pointer" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Operator Modal */}
      <OperatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedOperator}
        onConfirm={(values) => {
          console.log('Form values:', values);
          // Handle add/edit logic here
        }}
      />

      <RemoveOperatorModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onRemove={handleRemoveConfirm}
      />
    </div>
  );
};

export default OperatorsPage;
