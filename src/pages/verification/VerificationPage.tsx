import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ExportDropdown from '../../components/ui/export/ExportDropdown';
import { verificationRequestsData } from '../../data/VerificationData';

type FilterStatus = 'Pending' | 'Approved' | 'Rejected' | 'All';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return { dot: 'bg-[#F6921E]', text: 'text-[#F6921E]' };
    case 'Approved': return { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' };
    case 'Rejected': return { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' };
    default: return { dot: 'bg-[#6B7280]', text: 'text-[#6B7280]' };
  }
};

const ITEMS_PER_PAGE = 12;

const VerificationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Pending');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredData = verificationRequestsData.filter((r) => {
    const matchesSearch =
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Dynamic columns based on filter
  const columns = [
    { key: 'driver', label: 'DRIVER', sortable: true },
    { key: 'email', label: 'EMAIL', sortable: true },
    { key: 'appliedOn', label: 'APPLIED ON', sortable: true },
    ...(filterStatus === 'Approved' ? [{ key: 'approvedOn', label: 'APPROVED ON', sortable: true }] : []),
    { key: 'status', label: 'STATUS', sortable: true },
    ...(filterStatus === 'Rejected' ? [{ key: 'reason', label: 'REASON', sortable: true }] : []),
    { key: 'action', label: 'ACTION', sortable: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative flex flex-col gap-2">
      <div className="bg-white rounded-lg border border-[#DFE6E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Controls row — title + search + filters */}
              <tr className="border-b border-[#DFE6E5] bg-white">
                <th colSpan={columns.length} className="px-4 py-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
                    {/* Search */}
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

                    {/* Filter buttons + Export */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {(['Pending', 'Approved', 'Rejected'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setCurrentPage(1);
                          }}
                          className={`px-4 py-1.5 rounded-sm text-[13px] cursor-pointer font-medium border transition-all ${filterStatus === status
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

                      <div className="relative">
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
                        />
                      </div>
                    </div>
                  </div>
                </th>
              </tr>

              {/* Column headers via map */}
              <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-3.5 whitespace-nowrap">
                    {col.sortable ? (
                      <div className="flex justify-between items-center gap-1">
                        {col.label}
                        <img
                          src="/icons/rider/updown.svg"
                          alt="sort"
                          className="w-[18px] h-[18px]"
                        />
                      </div>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((request) => {
                  const sc = getStatusColor(request.status);
                  return (
                    <tr
                      key={request.id}
                      className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors last:border-b-0"
                    >
                      {/* Driver */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[15px] shrink-0 overflow-hidden">
                            {request.avatar.length <= 2 ? (
                              <span>{request.avatar}</span>
                            ) : (
                              <img
                                src={request.avatar}
                                alt={request.driverName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-[#1DAFA1] text-[14px] leading-tight">
                              {request.driverName}
                            </span>
                            <span className="text-[12px] font-medium text-[#4E616A]">
                              {request.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-3">
                        <span className="text-[#1DAFA1] font-medium text-[14px]">{request.email}</span>
                      </td>

                      {/* Applied On */}
                      <td className="px-6 py-3">
                        <span className="text-[#4E616A] text-[14px] font-medium">{request.appliedOn}</span>
                      </td>

                      {/* Approved On (conditional) */}
                      {filterStatus === 'Approved' && (
                        <td className="px-6 py-3">
                          <span className="text-[#4E616A] text-[14px] font-medium">
                            {request.actionDate || request.appliedOn}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          <span className={`text-[12px] font-semibold ${sc.text}`}>
                            {request.status}
                          </span>
                        </div>
                      </td>

                      {/* Reason (conditional) */}
                      {filterStatus === 'Rejected' && (
                        <td className="px-6 py-3">
                          <span className="text-[#4E616A] font-medium text-[14px]">
                            {request.reason || '-'}
                          </span>
                        </td>
                      )}

                      {/* Action */}
                      <td className="px-6 py-3">
                        {request.status === 'Pending' ? (
                          <Link
                            to={`/verification/details/${request.id}`}
                            className="flex items-center gap-1.5 text-[#1DAFA1] font-medium text-[14px]"
                          >
                            <img
                              src="/icons/verification/investigate.svg"
                              alt="investigate"
                              className="w-[22px] h-[22px]"
                            />
                            Investigate
                          </Link>
                        ) : (
                          <Link
                            to={`/verification/details/${request.id}`}
                            className="flex items-center gap-1.5 text-[#1DAFA1] font-medium text-[14px]"
                          >
                            <img
                              src="/icons/rider/eye.svg"
                              alt="view"
                              className="w-[22px] h-[22px]"
                            />
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-[14px] text-[#4E616A]">
                    No verification requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#DFE6E5] flex items-center justify-end gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-[20px] h-[20px]" />
          </button>

          {getPages().map((page, idx) =>
            page === '...' ? (
              <span key={`dots-${idx}`} className="px-1 text-[#4E616A] text-[13px]">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page as number)}
                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors border ${currentPage === page
                  ? 'bg-teal-50 text-[#1DAFA1] border-[#1DAFA1]'
                  : 'text-[#4E616A] border-transparent hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
