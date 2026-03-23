import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ridersData } from "../../data/RiderData";
import SuspendRiderModal from "../../components/ui/SuspendRiderModal";

const RiderPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isExportOpen, setIsExportOpen] = useState(false);

  // NEW STATE: track the rider being suspended
  const [suspendedRiderId, setSuspendedRiderId] = useState<string | null>(null);

  // Filter based on search query
  const filteredData = ridersData.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.phone.includes(searchQuery);
    const matchesStatus = filterStatus === "All" || rider.status === filterStatus;
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

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative">

      <div className="bg-white rounded-lg  border border-[#DFE6E5] overflow-hidden">
        {/* Controls Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
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
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A]  w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/filters.svg" alt="filters" className="w-[22px] h-[22px]" />
                Filters
              </button>

              {/* Filter Dropdown Modal */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 flex flex-col items-start overflow-hidden">
                  <div className="p-5 w-full border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base">Filters</h3>
                  </div>

                  <div className="p-5 w-full flex flex-col gap-6">
                    {/* Status */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm text-slate-500 font-medium">Status</label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterStatus === 'All'}
                            onChange={() => setFilterStatus('All')}
                            className="w-4 h-4 rounded text-[#20B2AA] border-gray-300 focus:ring-[#20B2AA] accent-[#20B2AA]"
                          />
                          <span className="text-sm font-medium text-gray-900">All</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterStatus === 'Active'}
                            onChange={() => setFilterStatus('Active')}
                            className="w-4 h-4 rounded text-[#20B2AA] border-gray-300 focus:ring-[#20B2AA] accent-[#20B2AA]"
                          />
                          <span className="text-sm font-medium text-gray-900">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterStatus === 'Suspended'}
                            onChange={() => setFilterStatus('Suspended')}
                            className="w-4 h-4 rounded text-[#20B2AA] border-gray-300 focus:ring-[#20B2AA] accent-[#20B2AA]"
                          />
                          <span className="text-sm font-medium text-gray-900">Suspended</span>
                        </label>
                      </div>
                    </div>

                    {/* Spent Range */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm text-slate-500 font-medium">Spent Range</label>
                      <div className="relative h-[6px] w-[96%] mx-auto bg-gray-100 rounded-full mt-3">
                        <div className="absolute top-0 bottom-0 left-[10%] right-[20%] bg-[#20B2AA] rounded-full"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] -translate-x-1/2 w-[18px] h-[18px] bg-white border-2 border-[#20B2AA] rounded-full shadow cursor-pointer"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-[20%] translate-x-1/2 w-[18px] h-[18px] bg-white border-2 border-[#20B2AA] rounded-full shadow cursor-pointer"></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 font-medium">From <span className="text-gray-900 font-bold ml-1">£110</span></span>
                        <span className="text-sm text-gray-500 font-medium">To <span className="text-gray-900 font-bold ml-1">£880</span></span>
                      </div>
                    </div>

                    {/* Trips Range */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm text-slate-500 font-medium">Trips Range</label>
                      <div className="relative h-[6px] w-[96%] mx-auto bg-gray-100 rounded-full mt-3">
                        <div className="absolute top-0 bottom-0 left-[5%] right-[20%] bg-[#20B2AA] rounded-full"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-[5%] -translate-x-1/2 w-[18px] h-[18px] bg-white border-2 border-[#20B2AA] rounded-full shadow cursor-pointer"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-[20%] translate-x-1/2 w-[18px] h-[18px] bg-white border-2 border-[#20B2AA] rounded-full shadow cursor-pointer"></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 font-medium">From <span className="text-gray-900 font-bold ml-1">01</span></span>
                        <span className="text-sm text-gray-500 font-medium">To <span className="text-gray-900 font-bold ml-1">400</span></span>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm text-slate-500 font-medium">Ratings</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-colors bg-white">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          All
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-colors bg-white">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          5 Star
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-colors bg-white">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          4 & above
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-colors bg-white">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          3 & above
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 w-full border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setFilterStatus('All')}
                      className="text-sm font-medium text-gray-900 hover:text-gray-600"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-5 py-2.5 bg-[#20B2AA] hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
                Export
              </button>

              {/* Export Dropdown Modal */}
              {isExportOpen && (
                <div className="absolute right-0 top-full mt-2 w-[180px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden py-3">
                  <div className="px-5 pb-3 pt-1">
                    <span className="text-[17px] font-medium text-slate-500">Export as</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      className="w-full flex items-center gap-4 px-5 py-2 hover:bg-gray-50 transition-colors text-left group"
                      onClick={() => setIsExportOpen(false)}
                    >
                      <div className="relative flex items-center justify-center text-black">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <div className="absolute -bottom-1 -left-1 bg-white px-0.5">
                          <span className="text-[10px] font-bold leading-none tracking-tighter">PDF</span>
                        </div>
                      </div>
                      <span className="text-xl font-medium text-gray-900">PDF</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-4 px-5 py-2 hover:bg-gray-50 transition-colors text-left group"
                      onClick={() => setIsExportOpen(false)}
                    >
                      <div className="relative flex items-center justify-center text-black">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <div className="absolute -bottom-1 -left-1 bg-white px-0.5">
                          <span className="text-[10px] font-bold leading-none tracking-tighter">CSV</span>
                        </div>
                      </div>
                      <span className="text-xl font-medium text-gray-900">CSV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-y border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
                <th className="px-4 py-3.5 w-[48px] text-center">
                  <input type="checkbox" className="rounded-[4px]  border-[#4E616A] text-[#20B2AA] focus:ring-[#20B2AA] w-4 h-4 cursor-pointer" />
                </th>
                {[
                  { label: "RIDER", sortable: true },
                  { label: "EMAIL", sortable: true },
                  { label: "TOTAL TRIPS", sortable: true },
                  { label: "TOTAL SPENT", sortable: true },
                  { label: "RATINGS", sortable: true },
                  { label: "STATUS", sortable: true },
                  { label: "ACTION", sortable: false },
                ].map((header) => (
                  <th
                    key={header.label}
                    className={`px-4 py-3.5 ${header.sortable ? "cursor-pointer group" : ""}`}
                  >
                    <div className={`flex items-center ${header.sortable ? "justify-between" : "justify-start"}`}>
                      <span className="text-[#4E616A] font-medium text-[14px]">{header.label}</span>
                      {header.sortable && (
                        <img src="/icons/rider/updown.svg" alt="sort" className="w-3.5 h-3.5 " />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentData.length > 0 ? (
                currentData.map((rider) => (
                  <tr key={rider.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" className="rounded-sm w-[16px] h-[16px] border-[#4E616A] text-teal-600 focus:ring-teal-500" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                          {rider.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1DAFA1] text-[14px] ">{rider.name}</span>
                          <span className="text-[12px] font-medium  text-[#4E616A]">{rider.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#1DAFA1] font-medium text-[14px] ">
                      {rider.email || "-"}
                    </td>
                    <td className="p-4 text-[#4E616A] text-[14px] font-medium">
                      {rider.totalTrips}
                    </td>
                    <td className="p-4 text-[#4E616A] text-[14px] font-medium">
                      £{rider.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-[15px] w-[15px] fill-[#E9A90A] text-[#E9A90A]" />
                        <span className="text-[#4E616A] text-[14px] font-medium">{rider.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${rider.status === "Active" ? "bg-[#00A63E]" : "bg-[#FF0707]"}`}
                        />
                        <span
                          className={`font-medium ${rider.status === "Active" ? "text-[#00A63E] text-[12px] font-semibold" : "text-[#FF0707] text-[12px] font-medium"}`}
                        >
                          {rider.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/rider/details/${rider.id}`}
                          className="cursor-pointer"
                          title="View Rider"
                        >
                          <img src="/icons/rider/eye.svg" alt="eye" className="w-[24px] h-[24px]" />
                        </Link>
                        <button
                          onClick={() => setSuspendedRiderId(rider.id)}
                          className="cursor-pointer"
                          title={rider.status === "Active" ? "Suspend Rider" : "Activate Rider"}
                        >
                          <img src="/icons/rider/person.svg" alt="suspend" className="w-[24px] h-[24px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No riders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info & Controls */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 hidden sm:block">

          </div>

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
                      className={`min-w-[32px] h-8 flex items-center justify-center cursor-pointer rounded-lg text-[14px] font-semibold transition-colors ${currentPage === pageNum
                        ? "bg-teal-50 text-[#1DAFA1] border border-[#1DAFA1]"
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
              className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-[24px] w-[24px] cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Suspend Rider Modal Overlay */}
      <SuspendRiderModal
        isOpen={!!suspendedRiderId}
        onClose={() => setSuspendedRiderId(null)}
        onConfirm={() => setSuspendedRiderId(null)}
      />
    </div>
  );
};

export default RiderPage;