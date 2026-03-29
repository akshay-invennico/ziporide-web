import { Search, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import DataTable, { type Column } from '@/components/ui/DataTable';
import { useRiders, useUpdateRiderStatus } from '@/hooks/useRider';
import type { Rider } from '@/types/rider.types';

import ExportDropdown from '../../components/ui/export/ExportDropdown';
import FilterDropdown, { type FilterType } from '../../components/ui/filter/FilterDropdown';
import SuspendRiderModal from '../../components/ui/SuspendRiderModal';

const RiderPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [filters, setFilters] = useState<FilterType>({
    status: 'All',
    minSpent: 0,
    maxSpent: 1000,
    minTrips: 0,
    maxTrips: 500,
    rating: 'All',
  });

  const { riders, loading, totalPages, refetch } = useRiders(
    filters,
    currentPage,
    itemsPerPage,
    searchQuery,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const [selectedRiderIds, setSelectedRiderIds] = useState<string[]>([]);
  const [suspendedRiderId, setSuspendedRiderId] = useState<string | null>(null);

  const { updateStatus, isUpdating } = useUpdateRiderStatus();

  const columns = useMemo<Column<Rider>[]>(
    () => [
      {
        key: 'name',
        label: 'RIDER',
        sortable: true,
        render: (rider) => (
          <div className="flex items-center gap-3">
            {rider.profilePhotoUrl || rider.avatar ? (
              <div className="h-[40px] w-[40px] rounded-full overflow-hidden shrink-0 border border-gray-200">
                <img
                  src={rider.profilePhotoUrl || rider.avatar}
                  alt={rider.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-[40px] w-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                {rider.initials || rider.name[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-[#1DAFA1] text-[14px]">{rider.name}</span>
              <span className="text-[12px] font-medium text-[#4E616A]">{rider.phone}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'EMAIL',
        sortable: true,
        render: (rider) => (
          <span className="text-[#1DAFA1] font-medium text-[14px]">{rider.email || '-'}</span>
        ),
      },
      {
        key: 'totalTrips',
        label: 'TOTAL TRIPS',
        sortable: true,
        render: (rider) => (
          <span className="text-[#4E616A] text-[14px] font-medium">{rider.totalTrips || 0}</span>
        ),
      },
      {
        key: 'totalSpent',
        label: 'TOTAL SPENT',
        sortable: true,
        render: (rider) => (
          <span className="text-[#4E616A] text-[14px] font-medium">
            £{Number(rider.totalSpent || 0).toFixed(2)}
          </span>
        ),
      },
      {
        key: 'rating',
        label: 'RATINGS',
        sortable: true,
        render: (rider) => (
          <div className="flex items-center gap-1.5">
            <Star className="h-[15px] w-[15px] fill-[#E9A90A] text-[#E9A90A]" />
            <span className="text-[#4E616A] text-[14px] font-medium">
              {Number(rider.rating || rider.avgRating || 0).toFixed(1)}
            </span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (rider) => (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${rider.status?.toLowerCase() === 'active' ? 'bg-[#00A63E]' : 'bg-[#FF0707]'}`}
            />
            <span
              className={`font-semibold text-[12px] ${rider.status?.toLowerCase() === 'active' ? 'text-[#00A63E]' : 'text-[#FF0707]'}`}
            >
              {rider.status?.toLowerCase() === 'active' ? 'Active' : 'Suspended'}
            </span>
          </div>
        ),
      },
      {
        key: 'action',
        label: 'ACTION',
        render: (rider) => (
          <div className="flex items-center gap-3">
            <Link to={`/rider/details/${rider.id}`} className="cursor-pointer" title="View Rider">
              <img src="/icons/rider/eye.svg" alt="eye" className="w-[24px] h-[24px]" />
            </Link>
            <button
              onClick={() => setSuspendedRiderId(rider.id)}
              className="cursor-pointer"
              title={
                rider.status?.toLowerCase() === 'suspended' ? 'Reactivate Rider' : 'Suspend Rider'
              }
            >
              {rider.status?.toLowerCase() === 'suspended' ? (
                <img
                  src="/icons/driver/greenUser.svg"
                  alt="reactivate"
                  className="w-[22px] h-[22px]"
                />
              ) : (
                <img src="/icons/driver/redUser.svg" alt="suspend" className="w-[22px] h-[22px]" />
              )}
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] p-1 relative">
      <div className="bg-white rounded-lg border border-[#DFE6E5]">
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
                className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/filters.svg" alt="filters" className="w-[22px] h-[22px]" />
                Filters
              </button>
              <FilterDropdown
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] w-full sm:w-auto justify-center"
              >
                <img src="/icons/rider/export.svg" alt="export" className="w-[22px] h-[22px]" />
                Export
              </button>
              <ExportDropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            </div>
          </div>
        </div>

        <DataTable<Rider>
          columns={columns}
          data={riders}
          rowKey={(r) => r.id}
          loading={loading}
          selectable
          selectedKeys={selectedRiderIds}
          onSelectionChange={setSelectedRiderIds}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyText="No riders found matching your search."
        />
      </div>

      {/* Suspend Rider Modal */}
      <SuspendRiderModal
        isOpen={!!suspendedRiderId}
        onClose={() => setSuspendedRiderId(null)}
        onConfirm={async (reason) => {
          if (!suspendedRiderId) return;
          const currentRider = riders.find((r) => r.id === suspendedRiderId);
          const newStatus =
            currentRider?.status?.toLowerCase() === 'suspended' ? 'active' : 'suspended';
          try {
            const success = await updateStatus([suspendedRiderId], newStatus, reason);
            if (success) {
              setSuspendedRiderId(null);
              refetch();
            }
          } catch (err) {
            console.error('Failed to update status:', err);
          }
        }}
        userType="rider"
        loading={isUpdating}
        mode={
          riders.find((r) => r.id === suspendedRiderId)?.status?.toLowerCase() === 'suspended'
            ? 'reactivate'
            : 'suspend'
        }
      />
    </div>
  );
};

export default RiderPage;
