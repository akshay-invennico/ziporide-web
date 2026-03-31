import { pdf } from '@react-pdf/renderer';
import { Search } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

import DataTable, { type Column } from '@/components/ui/DataTable';
import type { Driver } from '@/types/driver.types';

import ExportDropdown from '../../components/ui/export/ExportDropdown';
import VerificationPDFDocument from '../../components/verification/VerificationPDFDocument';
import {
  useDrivers,
  useExportVerificationCSV,
  useExportVerificationPDF,
} from '../../hooks/useVerificationDriver';

const getStatusColor = (status: string) => {
  const s = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
  switch (s) {
    case 'Pending':
      return { dot: '#F6921E', text: '#F6921E' };
    case 'Approved':
      return { dot: '#00A63E', text: '#00A63E' };
    case 'Rejected':
      return { dot: '#FF0707', text: '#FF0707' };
    default:
      return { dot: '#6B7280', text: '#6B7280' };
  }
};

const VerificationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [filterStatus, setFilterStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>(
    'Pending',
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { drivers, loading, totalPages } = useDrivers(
    filterStatus,
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
  );

  const { exportCSV } = useExportVerificationCSV();
  const { fetchAllDrivers, setIsExporting: setIsExportingPDF } = useExportVerificationPDF();

  const handleExportCSV = async () => {
    await exportCSV(filterStatus);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const allDrivers = await fetchAllDrivers(filterStatus);
      if (allDrivers && allDrivers.length > 0) {
        const blob = await pdf(<VerificationPDFDocument drivers={allDrivers} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Verification_Export_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF Export failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const currentData = drivers.filter((request) => {
    if (!searchQuery) return true;

    const name = request.driverName || request.name || '';
    const email = request.email || '';
    const phone = `${request.countryCode || ''} ${request.phone || ''}`.trim();

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  const columns = useMemo<Column<Driver>[]>(() => {
    const cols: Column<Driver>[] = [
      {
        key: 'driver',
        label: 'DRIVER',
        sortable: true,
        render: (request) => (
          <div className="flex items-center gap-3">
            <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[16px] shrink-0 overflow-hidden">
              {!request.avatar || request.avatar.length <= 2 ? (
                <span>{request.avatar || request.name?.substring(0, 2).toUpperCase() || 'DR'}</span>
              ) : (
                <img
                  src={request.avatar}
                  alt={request.driverName || request.name || 'Driver'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-[#1DAFA1] text-[14px] leading-tight">
                {request.driverName || request.name || 'Unknown'}
              </span>
              <span className="text-[12px] font-medium text-[#4E616A]">
                {request.countryCode
                  ? `${request.countryCode} ${request.phone}`
                  : request.phone || '-'}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'EMAIL',
        sortable: true,
        render: (request) => (
          <span className="text-[#1DAFA1] font-medium text-[14px]">{request.email || '-'}</span>
        ),
      },
      {
        key: 'appliedOn',
        label: 'APPLIED ON',
        sortable: true,
        render: (request) => (
          <span className="text-[#4E616A] text-[14px] font-medium">
            {request.appliedOn || request.consents?.acceptedAt || request.createdAt
              ? new Date(
                  request.appliedOn || request.consents?.acceptedAt || request.createdAt!,
                ).toLocaleDateString('en-CA')
              : '-'}
          </span>
        ),
      },
    ];

    if (filterStatus === 'Approved') {
      cols.push({
        key: 'approvedOn',
        label: 'APPROVED ON',
        sortable: true,
        render: (request) => (
          <span className="text-[#4E616A] text-[14px] font-medium">
            {request.actionDate ||
            request.updatedAt ||
            request.appliedOn ||
            request.consents?.acceptedAt ||
            request.createdAt
              ? new Date(
                  request.actionDate ||
                    request.updatedAt ||
                    request.appliedOn ||
                    request.consents?.acceptedAt ||
                    request.createdAt!,
                ).toLocaleDateString('en-CA')
              : '-'}
          </span>
        ),
      });
    }

    cols.push({
      key: 'status',
      label: 'STATUS',
      sortable: true,
      render: (request) => (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: getStatusColor(request.status).dot }}
          />
          <span
            className="text-[12px] font-semibold"
            style={{ color: getStatusColor(request.status).text }}
          >
            {request.status
              ? request.status.charAt(0).toUpperCase() + request.status.slice(1)
              : '-'}
          </span>
        </div>
      ),
    });

    if (filterStatus === 'Rejected') {
      cols.push({
        key: 'reason',
        label: 'REASON',
        sortable: true,
        render: (request) => (
          <span className="text-[#4E616A] font-medium text-[14px]">{request.reason || '-'}</span>
        ),
      });
    }

    cols.push({
      key: 'action',
      label: 'ACTION',
      render: (request) => {
        if (request.status?.toLowerCase() === 'pending') {
          return (
            <Link
              to={`/verification/details/${request.id}`}
              className="flex items-center gap-2 text-[#1DAFA1] font-medium text-[14px]"
            >
              <img
                src="/icons/verification/investigate.svg"
                alt="investigate"
                className="w-[24px] h-[24px]"
              />
              Investigate
            </Link>
          );
        }
        return (
          <Link
            to={`/verification/details/${request.id}`}
            className="flex items-center gap-2 text-[#1DAFA1] font-medium text-[14px]"
          >
            <img src="/icons/verification/eyes.svg" alt="view" className="w-[22px] h-[22px]" />
            View
          </Link>
        );
      },
    });

    return cols;
  }, [filterStatus]);

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative flex flex-col gap-2">
      <div className="bg-white rounded-lg border border-[#DFE6E5] overflow-hidden">
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex border-[#DFE6E5] rounded-sm items-center pointer-events-none">
              <Search className="h-[22px] w-[22px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-full border border-[#939999] rounded-sm text-[14px] text-[#000000] font-regular focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['Pending', 'Approved', 'Rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-sm text-[13px] cursor-pointer font-medium border transition-all ${
                  filterStatus === status
                    ? status === 'Pending'
                      ? 'bg-[#FFF3D4] text-[#F6921E] border-[#F6921E]'
                      : status === 'Approved'
                        ? 'bg-[#EAFFF2] text-[#00A63E] border-[#00A63E]'
                        : 'bg-[#FFF6F6] text-[#FF0707] border-[#FF0707]'
                    : 'text-[#4E616A] bg-transparent border-[#DFE6E5]'
                }`}
              >
                {status}
              </button>
            ))}

            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen((o) => !o)}
                className="flex items-center cursor-pointer gap-2 px-4 py-1.5 border border-[#DFE6E5] rounded-sm text-[13px] font-medium text-[#4E616A]"
              >
                <img src="/icons/rider/export.svg" alt="export" className="w-[20px] h-[20px]" />
                Export
              </button>
              <ExportDropdown
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>
        </div>

        <DataTable<Driver>
          columns={columns}
          data={currentData}
          rowKey={(d) => d.id}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyText={
            searchQuery ? 'No results found for your search.' : 'No verification requests found.'
          }
        />
      </div>
    </div>
  );
};

export default VerificationPage;
