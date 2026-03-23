import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { verificationRequestsData } from '../../data/VerificationData';

const VerificationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjusted based on the image size approx
  const [filterStatus, setFilterStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>(
    'Pending',
  );

  // Filter based on search query and status
  const filteredData = verificationRequestsData.filter((request) => {
    const matchesSearch =
      request.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current page data
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#F6921E'; // Amber
      case 'Approved':
        return '#00A63E'; // Emerald
      case 'Rejected':
        return '#FF0707'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative flex flex-col gap-2">
      <div className="bg-white rounded-lg border border-[#DFE6E5] overflow-hidden">
        {/* Controls Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex border-[#DFE6E5] rounded-sm items-center pointer-events-none">
              <Search className="h-[22px] w-[22px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-full border border-[#939999] rounded-sm text-[14px] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex bg-white  gap-2 shrink-0">
              {(['Pending', 'Approved', 'Rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-sm text-[14px] cursor-pointer font-medium transition-all ${
                    filterStatus === status
                      ? status === 'Pending'
                        ? 'bg-[#FFF3D4] text-[#F6921E] border border-[#F6921E]'
                        : status === 'Approved'
                          ? 'bg-[#EAFFF2] text-[#00A63E] border border-[#00A63E]'
                          : 'bg-[#FFF6F6] text-[#FF0707] border border-[#FF0707]'
                      : 'text-[#4E616A] bg-transparent  border border-[#DFE6E5]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center">
              <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
              {[
                { label: 'DRIVER', sortable: true },
                { label: 'EMAIL', sortable: true },
                { label: 'APPLIED ON', sortable: true },
                ...(filterStatus === 'Approved' ? [{ label: 'APPROVED ON', sortable: true }] : []),
                { label: 'STATUS', sortable: true },
                ...(filterStatus === 'Rejected' ? [{ label: 'REASON', sortable: true }] : []),
                { label: 'ACTION', sortable: false },
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
                        className="w-[18px] h-[18px] "
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentData.length > 0 ? (
              currentData.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors last:border-b-0"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[16px] shrink-0 overflow-hidden">
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
                  <td className="px-6 py-3">
                    <span className="text-[#1DAFA1] font-medium text-[14px]">{request.email}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-[#4E616A] text-[14px] font-medium">
                      {request.appliedOn}
                    </span>
                  </td>
                  {filterStatus === 'Approved' && (
                    <td className="px-6 py-3">
                      <span className="text-[#4E616A] text-[14px] font-medium">
                        {request.actionDate || request.appliedOn}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(request.status) }}
                      />
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </span>
                    </div>
                  </td>
                  {filterStatus === 'Rejected' && (
                    <td className="px-6 py-3">
                      <span className="text-[#4E616A] font-medium text-[14px]">
                        {request.reason || '-'}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-3">
                    {request.status === 'Pending' ? (
                      <Link
                        to={`/verification/details/${request.id}`}
                        className="flex items-center gap-2 text-[#1DAFA1]  font-medium text-[14px] "
                      >
                        <img
                          src="/icons/verification/investigate.svg"
                          alt="investigate"
                          className="w-[24px] h-[24px]"
                        />
                        Investigate
                      </Link>
                    ) : (
                      <Link
                        to={`/verification/details/${request.id}`}
                        className="flex items-center gap-2 text-[#1DAFA1]  font-medium text-[14px]"
                      >
                        <img
                          src="/icons/verification/eyes.svg"
                          alt="investigate"
                          className="w-[22px] h-[22px]"
                        />
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No verification requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info & Controls */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-[24px] w-[24px] cursor-pointer" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show first, last, current, and adjacent pages
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-8 flex items-center cursor-pointer justify-center rounded-lg text-[14px] font-semibold transition-colors ${
                      currentPage === pageNum
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
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-[24px] w-[24px] cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
