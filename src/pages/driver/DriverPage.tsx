import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useDrivers, useUpdateDriverStatus } from '@/hooks/useDriver';

import ExportDropdown from '../../components/ui/export/ExportDropdown';
import FilterDropdown, { type FilterType } from '../../components/ui/filter/FilterDropdown';
import SuspendRiderModal from '../../components/ui/SuspendRiderModal';

const DriverPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [filters, setFilters] = useState<FilterType>({
    status: 'Active',
    minEarnings: 0,
    maxEarnings: 1000,
    minTrips: 0,
    maxTrips: 500,
    rating: 'All',
  });

  const { drivers, loading, totalPages, refetch } = useDrivers(
    filters,
    currentPage,
    itemsPerPage,
    searchQuery,
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [suspendedDriverId, setSuspendedDriverId] = useState<string | null>(null);

  const { updateStatus, isUpdating } = useUpdateDriverStatus();

  const handleToggleSelect = (id: string) => {
    setSelectedDriverIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedDriverIds.length === drivers.length) {
      setSelectedDriverIds([]);
    } else {
      setSelectedDriverIds(drivers.map((d) => (d.id || d._id || '') as string));
    }
  };

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative">
      <div className="bg-white rounded-lg  border border-[#DFE6E5]">
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
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/filters.svg" alt="filters" className="w-[22px] h-[22px]" />
                Filters
              </button>

              <FilterDropdown
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
                userType="driver"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
                Export
              </button>
              <ExportDropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] border-y border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
                <th className="px-4 py-3.5 w-[48px] text-center">
                  <input
                    type="checkbox"
                    checked={drivers.length > 0 && selectedDriverIds.length === drivers.length}
                    onChange={handleSelectAll}
                    className="rounded-[4px] border-gray-300 text-[#14B8A6] focus:ring-[#14B8A6] w-4 h-4 cursor-pointer"
                  />
                </th>
                {[
                  { label: 'DRIVER', sortable: true },
                  { label: 'EMAIL', sortable: true },
                  { label: 'TOTAL TRIPS', sortable: true },
                  { label: 'TOTAL EARN', sortable: true },
                  { label: 'RATINGS', sortable: true },
                  { label: 'STATUS', sortable: true },
                  { label: 'ACTION', sortable: false },
                ].map((header) => (
                  <th
                    key={header.label}
                    className={`px-4 py-3.5 ${header.sortable ? 'cursor-pointer group' : ''}`}
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
            <tbody className="text-sm">
              {drivers.length > 0 ? (
                drivers.map((driver) => {
                  const id = (driver.id || driver._id || '') as string;
                  return (
                    <tr
                      key={id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 relative">
                        <input
                          type="checkbox"
                          checked={selectedDriverIds.includes(id)}
                          onChange={() => handleToggleSelect(id)}
                          className="rounded-[4px] absolute top-1/2 -translate-y-1/2 left-[50%] -translate-x-[50%] w-[16px] h-[16px] border-[#4E616A] text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {driver.profilePhotoUrl || driver.avatar ? (
                            <div className="h-[40px] w-[40px] rounded-full overflow-hidden shrink-0 border border-gray-200">
                              <img
                                src={driver.profilePhotoUrl || driver.avatar}
                                alt={driver.name || driver.driverName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                              {(driver.name || driver.driverName || 'D')[0].toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-[#1DAFA1] text-[14px] ">
                              {driver.name || driver.driverName}
                            </span>
                            <span className="text-[12px] font-medium  text-[#4E616A]">
                              {driver.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#1DAFA1] font-medium text-[14px] ">
                        {driver.email || '-'}
                      </td>
                      <td className="p-4 text-[#4E616A] text-[14px] font-medium">
                        {driver.totalTrips || 0}
                      </td>
                      <td className="p-4 text-[#4E616A] text-[14px] font-medium">
                        £{Number(driver.totalEarnings || driver.totalEarned || 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-[15px] w-[15px] fill-[#E9A90A] text-[#E9A90A]" />
                          <span className="text-[#4E616A] text-[14px] font-medium">
                            {Number(driver.avgRating || driver.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              driver.status?.toLowerCase() === 'approved'
                                ? 'bg-[#00A63E]'
                                : driver.status?.toLowerCase() === 'suspended'
                                  ? 'bg-[#FF0707]'
                                  : 'bg-[#E9A90A]'
                            }`}
                          />
                          <span
                            className={`text-[12px] font-semibold ${
                              driver.status?.toLowerCase() === 'approved'
                                ? 'text-[#00A63E]'
                                : driver.status?.toLowerCase() === 'suspended'
                                  ? 'text-[#FF0707]'
                                  : 'text-[#E9A90A]'
                            }`}
                          >
                            {driver.status?.toLowerCase() === 'approved'
                              ? 'Active'
                              : driver.status?.toLowerCase() === 'suspended'
                                ? 'Suspended'
                                : driver.status
                                  ? driver.status.charAt(0).toUpperCase() + driver.status.slice(1)
                                  : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/driver/details/${id}`}
                            className="cursor-pointer"
                            title="View Driver"
                          >
                            <img
                              src="/icons/rider/eye.svg"
                              alt="eye"
                              className="w-[24px] h-[24px]"
                            />
                          </Link>
                          <button
                            onClick={() => setSuspendedDriverId(id)}
                            className="cursor-pointer"
                            title={
                              driver.status?.toLowerCase() === 'approved'
                                ? 'Suspend Driver'
                                : 'Activate Driver'
                            }
                          >
                            {driver.status?.toLowerCase() === 'suspended' ? (
                              <img src="icons/driver/greenUser.svg" alt="suspend" />
                            ) : (
                              <img
                                src="/icons/driver/redUser.svg"
                                alt="suspend"
                                className="w-[24px] h-[24px]"
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Loading drivers...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No drivers found.
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

      <SuspendRiderModal
        isOpen={!!suspendedDriverId}
        onClose={() => setSuspendedDriverId(null)}
        onConfirm={async (reason) => {
          if (!suspendedDriverId) return;
          const currentDriver = drivers.find((d) => (d.id || d._id) === suspendedDriverId);
          const newStatus =
            currentDriver?.status?.toLowerCase() === 'suspended' ? 'approved' : 'suspended';
          try {
            const success = await updateStatus([suspendedDriverId], newStatus, reason);
            if (success) {
              setSuspendedDriverId(null);
              refetch();
            }
          } catch (err) {
            console.error('Failed to update status:', err);
          }
        }}
        userType="driver"
        loading={isUpdating}
        mode={
          drivers.find((d) => (d.id || d._id) === suspendedDriverId)?.status?.toLowerCase() ===
          'suspended'
            ? 'reactivate'
            : 'suspend'
        }
      />
    </div>
  );
};

export default DriverPage;
