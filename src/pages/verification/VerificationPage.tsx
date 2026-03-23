import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { verificationRequestsData } from "../../data/VerificationData";

const VerificationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjusted based on the image size approx
  const [filterStatus, setFilterStatus] = useState<"Pending" | "Approved" | "Rejected" | "All">("Pending");

  // Filter based on search query and status
  const filteredData = verificationRequestsData.filter(request => {
    const matchesSearch = request.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phone.includes(searchQuery);
    const matchesStatus = filterStatus === "All" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current page data
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pending": return "#F59E0B"; // Amber
      case "Approved": return "#10B981"; // Emerald
      case "Rejected": return "#EF4444"; // Red
      default: return "#6B7280"; // Gray
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-6 relative flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-gray-900">Verification Requests</h1>
        <p className="text-[14px] text-gray-500 font-medium">Review and take action on driver applications</p>
      </div>

      <div className="bg-white rounded-[12px] border border-[#DFE6E5] overflow-hidden drop-shadow-sm">
        {/* Controls Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-[20px] w-[20px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-full border border-[#DFE6E5] rounded-[8px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex bg-white border border-[#DFE6E5] p-1 rounded-[8px] gap-1 shrink-0">
              {(["Pending", "Approved", "Rejected"] as const).map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-[6px] text-[14px] font-medium transition-all ${
                    filterStatus === status 
                      ? status === "Pending" ? "bg-[#FFF8ED] text-[#F59E0B] border border-[#FDE68A]" 
                        : status === "Approved" ? "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]"
                        : "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                      : "text-gray-600 bg-transparent hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 border border-[#DFE6E5] rounded-[8px] text-[14px] font-medium text-[#4E616A] hover:bg-gray-50 shrink-0"
            >
              <img src="/icons/rider/export.svg" alt="export" className="w-[20px] h-[20px]" />
              Export
            </button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFFFF] border-b border-[#DFE6E5] text-[12px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                {[
                  { label: "DRIVER", sortable: true },
                  { label: "EMAIL", sortable: true },
                  { label: "APPLIED ON", sortable: true },
                  ...(filterStatus === "Approved" ? [{ label: "APPROVED ON", sortable: true }] : []),
                  { label: "STATUS", sortable: true },
                  ...(filterStatus === "Rejected" ? [{ label: "REASON", sortable: true }] : []),
                  { label: "ACTION", sortable: false },
                ].map((header) => (
                  <th
                    key={header.label}
                    className={`px-6 py-4 ${header.sortable ? "cursor-pointer group hover:bg-gray-50" : ""}`}
                  >
                    <div className={`flex items-center ${header.sortable ? "justify-between" : "justify-start"}`}>
                      <span>{header.label}</span>
                      {header.sortable && (
                        <img src="/icons/rider/updown.svg" alt="sort" className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentData.length > 0 ? (
                currentData.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-b-0">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[16px] shrink-0 overflow-hidden">
                           {request.avatar.length <= 2 ? (
                              <span>{request.avatar}</span>
                           ) : (
                               <img src={request.avatar} alt={request.driverName} className="w-full h-full object-cover" />
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1DAFA1] text-[14px] leading-tight">{request.driverName}</span>
                          <span className="text-[13px] text-[#6B7280]">{request.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[#1DAFA1] font-medium text-[14px]">{request.email}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[#4B5563] text-[14px] font-medium">{request.appliedOn}</span>
                    </td>
                    {filterStatus === "Approved" && (
                      <td className="px-6 py-3">
                        <span className="text-[#4B5563] text-[14px] font-medium">{request.actionDate || request.appliedOn}</span>
                      </td>
                    )}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        />
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: getStatusColor(request.status) }}
                        >
                          {request.status}
                        </span>
                      </div>
                    </td>
                    {filterStatus === "Rejected" && (
                      <td className="px-6 py-3">
                        <span className="text-[#6B7280] text-[14px]">{request.reason || "-"}</span>
                      </td>
                    )}
                    <td className="px-6 py-3">
                      {request.status === "Pending" ? (
                        <Link
                          to={`/verification/details/${request.id}`}
                          className="flex items-center gap-2 text-[#1DAFA1] hover:text-[#14B8A6] font-medium text-[14px] transition-colors"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                             <polyline points="14 2 14 8 20 8"></polyline>
                             <circle cx="10" cy="13" r="2"></circle>
                             <line x1="11.4" y1="14.4" x2="14" y2="17"></line>
                          </svg>
                          Investigate
                        </Link>
                      ) : (
                        <Link
                          to={`/verification/details/${request.id}`}
                          className="flex items-center gap-2 text-[#1DAFA1] hover:text-[#14B8A6] font-medium text-[14px] transition-colors"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
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
        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-4 min-h-[68px]">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-1.5 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-[20px] w-[20px]" />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Simplified pagination for dummy data
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  pageNum === 2 ||
                  pageNum === 3 ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-8 flex items-center justify-center rounded-[6px] text-[14px] font-semibold transition-colors ${
                        currentPage === pageNum
                          ? "text-[#1DAFA1] border border-[#1DAFA1] bg-[#F0FDF4]"
                          : "text-gray-600 hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-[20px] w-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
