import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

import TripDetailsModal from '../../components/ui/TripDetailsModal';
import {
  tripHistoryData,
  TRIP_ITEMS_PER_PAGE,
  type TripStatus,
  type TripRecord,
} from '../../data/TripHistoryData';

type FilterTab = 'All' | TripStatus;

const FILTER_TABS: FilterTab[] = ['All', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_STYLES: Record<TripStatus, { dot: string; text: string; bg: string }> = {
  Assigned: { dot: 'bg-[#1DAFA1]', text: 'text-[#1DAFA1]', bg: 'bg-transparent' },
  'In Progress': { dot: 'bg-[#F6921E]', text: 'text-[#F6921E]', bg: 'bg-transparent' },
  Completed: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]', bg: 'bg-transparent' },
  Cancelled: { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]', bg: 'bg-transparent' },
};

const AvatarCell = ({ initials, bg = '#1DAFA1' }: { initials: string; bg?: string }) => (
  <div
    className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[18px] font-bold shrink-0"
    style={{ backgroundColor: bg }}
  >
    {initials}
  </div>
);

// const avatarColors: Record<string, string> = {
//   MC: "#1DAFA1",
//   AS: "#6366F1",
//   RK: "#F59E0B",
//   LB: "#EC4899",
//   TN: "#14B8A6",
//   ND: "#1DAFA1",
//   SS: "#8B5CF6",
//   DP: "#1DAFA1",
//   CK: "#3B82F6",
// };

export default function TripHistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const totalPages = 99;

  const filtered = useMemo(() => {
    return tripHistoryData.filter((trip) => {
      const matchesTab = activeTab === 'All' || trip.status === activeTab;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        trip.id.toLowerCase().includes(q) ||
        trip.rider.name.toLowerCase().includes(q) ||
        trip.driver.name.toLowerCase().includes(q) ||
        trip.route.from.toLowerCase().includes(q) ||
        trip.route.to.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  const paginated = filtered.slice(
    (currentPage - 1) * TRIP_ITEMS_PER_PAGE,
    currentPage * TRIP_ITEMS_PER_PAGE,
  );

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // const renderPageNumbers = () => {
  //   const pages: (number | string)[] = [];
  //   if (totalPages <= 5) {
  //     for (let i = 1; i <= totalPages; i++) pages.push(i);
  //   } else {
  //     pages.push(1, 2, 3);
  //     if (currentPage > 4) pages.push("...");
  //     if (currentPage > 3 && currentPage < totalPages - 1) pages.push(currentPage);
  //     if (totalPages > 4) pages.push("...", totalPages);
  //   }
  //   return pages;
  // };

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen p-1 flex flex-col gap-4">
      {/* Page Header */}

      {/* Filters + Controls */}
      <div className="bg-white rounded-lg border border-[#DFE6E5] overflow-hidden">
        {/* Search + Filter Row */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex  border-[#DFE6E5] rounded-sm items-center pointer-events-none">
              <Search className="h-[22px] w-[22px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-[#939999] rounded-sm text-[14px] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
            />
          </div>

          {/* Tabs + Export */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2  rounded-sm text-[14px] cursor-pointer font-medium transition-all ${
                    activeTab === tab
                      ? tab === 'Assigned' || tab === 'All'
                        ? ' bg-[#EEFFFD] text-[#1DAFA1] border border-[#1DAFA1] '
                        : tab === 'In Progress'
                          ? 'bg-[#FFF3D4] text-[#F6921E] border border-[#F6921E]'
                          : tab === 'Completed'
                            ? ' bg-[#EAFFF2] text-[#00A63E] border border-[#00A63E]'
                            : 'bg-[#FFF6F6] text-[#FF0707] border border-[#FF0707]'
                      : 'text-[#4E616A] bg-transparent  border border-[#DFE6E5]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center">
              <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
                {[
                  'TRIP ID',
                  'RIDER',
                  'DRIVER',
                  'ROUTE',
                  'AMOUNT',
                  'TIME & DATE',
                  'STATUS',
                  'ACTION',
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-[14px] font-medium text-[#4E616A] uppercase tracking-wide whitespace-nowrap"
                  >
                    <div className="flex justify-between gap-1">
                      {col}
                      {col !== 'ACTION' && col !== 'ROUTE' && (
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
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#AEB9B6] text-[14px]">
                    No trips found.
                  </td>
                </tr>
              ) : (
                paginated.map((trip, idx) => {
                  const style = STATUS_STYLES[trip.status];
                  //const riderColor = avatarColors[trip.rider.avatar] || "#1DAFA1";
                  const showCancel = trip.status === 'Assigned' || trip.status === 'In Progress';
                  return (
                    <tr
                      key={`${trip.id}-${idx}`}
                      className="border-b border-[#DFE6E5] hover:bg-gray-50 transition-colors"
                    >
                      {/* Trip ID */}
                      <td className="px-4 py-3 text-[14px] font-medium text-[#14B8A6] whitespace-nowrap">
                        {trip.id}
                      </td>

                      {/* Rider */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarCell initials={trip.rider.avatar} />
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#1DAFA1] whitespace-nowrap">
                              {trip.rider.name}
                            </span>
                            <span className="text-[12px] font-medium text-[#4E616A]">
                              {trip.rider.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[40px] h-[40px] rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={trip.driver.avatar}
                              alt={trip.driver.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const t = e.currentTarget as HTMLImageElement;
                                t.style.display = 'none';
                                const parent = t.parentElement;
                                if (parent) {
                                  parent.style.backgroundColor = '#1DAFA1';
                                  parent.innerText = trip.driver.name
                                    .split(' ')
                                    .map((w) => w[0])
                                    .join('')
                                    .slice(0, 2);
                                  parent.style.color = 'white';
                                  parent.style.fontSize = '18px';
                                  parent.style.fontWeight = '700';
                                }
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#1DAFA1] whitespace-nowrap">
                              {trip.driver.name}
                            </span>
                            <span className="text-[12px] font-medium text-[#4E616A]">
                              {trip.driver.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A] whitespace-nowrap">
                        {trip.route.from}{' '}
                        <span className="text-[#4E616A] mx-1 w-[15px] h-[10px]">→</span>
                        {trip.route.to}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A] whitespace-nowrap">
                        £{trip.amount.toFixed(2)}
                      </td>

                      {/* Time & Date */}
                      <td className="px-4 py-3 text-[14px] flex justify-between font-medium text-[#4E616A] whitespace-nowrap">
                        {trip.date}{' '}
                        <div className="border-r border-[#DFE6E5] w-[3px] h-[20px]"></div>
                        <span className="text-[#4E616A]">{trip.time}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${style.dot}`} />
                          <span className={`text-[12px] font-semibold ${style.text}`}>
                            {trip.status}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Eye / View */}
                          <button
                            className="cursor-pointer"
                            title="View"
                            onClick={() => {
                              setSelectedTrip(trip);
                              setIsTripModalOpen(true);
                            }}
                          >
                            <img
                              src="/icons/rider/eye.svg"
                              alt="view"
                              className="w-[20px] h-[20px]"
                            />
                          </button>

                          {/* Cancel */}
                          {showCancel && (
                            <button className=" cursor-pointer" title="Cancel">
                              <img
                                src="/icons/dashboard/cancel.svg"
                                alt="cancel"
                                className="w-[20px] h-[20px]"
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                      className={`min-w-[32px] h-8 flex items-center justify-center cursor-pointer rounded-lg text-[14px] font-semibold transition-colors ${
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
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-[24px] w-[24px] cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      <TripDetailsModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setSelectedTrip(null);
        }}
        trip={selectedTrip}
      />
    </div>
  );
}
