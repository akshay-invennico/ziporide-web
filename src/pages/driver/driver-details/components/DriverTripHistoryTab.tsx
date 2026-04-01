import { Star, ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import DataTable, { type Column } from '@/components/ui/DataTable';
import { useDriverTrips, useTripDetails } from '@/hooks/useDriver';
import type { TripRecord } from '@/types/driver.types';

import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import TripDetailsModal from '../../../../components/ui/TripDetailsModal';

const ITEMS_PER_PAGE = 12;

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { dot: string; text: string }> = {
    Completed: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
    Cancelled: { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' },
    'In Progress': { dot: 'bg-[#F6921E]', text: 'text-[#F6921E]' },
    Assigned: { dot: 'bg-[#1DAFA1]', text: 'text-[#1DAFA1]' },
  };
  const { dot, text } = cfg[status] || cfg['Assigned'];
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className={`text-[12px] font-semibold ${text}`}>{status}</span>
    </div>
  );
}

export default function DriverTripHistoryTab() {
  const { id: driverId } = useParams<{ id: string }>();
  const [period, setPeriod] = useState<'Year' | 'This Month' | 'This Week'>('Year');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);
  const [loadingTripId, setLoadingTripId] = useState<string | null>(null);

  const { trips, loading, error, totalPages } = useDriverTrips(
    driverId,
    period,
    currentPage,
    ITEMS_PER_PAGE,
  );

  const { fetchDetails } = useTripDetails(undefined);

  const columns: Column<TripRecord>[] = [
    {
      key: 'id',
      label: 'TRIP ID',
      sortable: true,
      render: (trip) => (
        <span className="text-[14px] font-medium text-[#1DAFA1] text-nowrap cursor-pointer">
          {trip.id}
        </span>
      ),
    },
    {
      key: 'rider',
      label: 'RIDER',
      sortable: false,
      render: (trip) => (
        <div className="flex items-center gap-2.5">
          <div className="w-[36px] h-[36px] rounded-full flex bg-[#1DAFA1] items-center justify-center text-white font-bold text-[14px] shrink-0">
            {trip.rider.initials}
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#1DAFA1] leading-tight text-nowrap">
              {trip.rider.name}
            </p>
            <p className="text-[12px] text-[#4E616A] font-medium">
              {trip.rider.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'route',
      label: 'ROUTE',
      sortable: false,
      render: (trip) => (
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#4E616A]">
          <span className="whitespace-nowrap">{trip.route.pickupLocation}</span>
          <ArrowRightIcon className="w-4 h-4" />
          <span className="whitespace-nowrap">{trip.route.destination}</span>
        </div>
      ),
    },
    {
      key: 'totalFare',
      label: 'AMOUNT',
      type: 'number',
      sortable: true,
      render: (trip) => (
        <span className="text-[14px] font-medium text-[#4E616A]">
          £{trip.totalFare.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'DATE',
      type: 'date',
      sortable: true,
      render: (trip) => (
        <span className="text-[14px] font-medium text-[#4E616A] whitespace-nowrap">
          {trip.date}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'RATING',
      sortable: false,
      render: (trip) => (
        trip.rider.rating !== null ? (
          <div className="flex items-center gap-1">
            <Star className="w-[14px] h-[14px] fill-[#E9A90A] text-[#E9A90A]" />
            <span className="text-[14px] font-medium text-[#4E616A]">
              {trip.rider.rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <span className="text-[14px] text-[#4E616A]">-</span>
        )
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      render: (trip) => (
        <StatusBadge status={trip.status} />
      ),
    },
    {
      key: 'action',
      label: 'ACTION',
      sortable: false,
      render: (trip) => (
        <button
          onClick={() => handleViewTrip(trip)}
          disabled={loadingTripId === (trip.rideId || trip.id)}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#1DAFA1] cursor-pointer disabled:opacity-50"
        >
          {loadingTripId === (trip.rideId || trip.id) ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              <img
                src="/icons/rider/eye.svg"
                alt="eye"
                className="w-[22px] h-[22px]"
              />
              View
            </>
          )}
        </button>
      ),
    },
  ];

  const handleViewTrip = async (trip: TripRecord) => {
    // Show loading for this specific trip
    setLoadingTripId(trip.rideId || trip.id);
    try {
      // Use the custom hook to fetch single trip details
      const fullTripData = await fetchDetails(trip.rideId || trip.id);
      if (fullTripData) {
        setSelectedTrip(fullTripData);
        setIsModalOpen(true);
      } else {
        // Fallback to the trip data we already have if API fails
        setSelectedTrip(trip);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch full trip details:', err);
      // Fallback on error
      setSelectedTrip(trip);
      setIsModalOpen(true);
    } finally {
      setLoadingTripId(null);
    }
  };



  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  return (
    <div className="p-1">
      {/* Table */}
      <div className="border border-[#DFE6E5] rounded-lg overflow-hidden bg-white">
        <div className="px-4 py-4 border-b border-[#DFE6E5]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-[20px] font-semibold text-[#000000]">Recent Trips</span>
            <div className="flex items-center gap-3">
              {(['Year', 'This Month', 'This Week'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${period === p
                    ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                    : 'border-[#DFE6E5] text-[#4E616A]'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataTable<TripRecord>
          columns={columns}
          data={trips}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyElement={
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-[#000000] font-semibold text-[16px]">No trips found</p>
                <p className="text-[#4E616A] text-[14px]">
                  There are no trip records for the selected {period.toLowerCase()}.
                </p>
              </div>
            </div>
          }
        />
      </div>

      {/* Trip Details Modal */}
      <TripDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trip={selectedTrip}
        viewMode="driver"
      />
    </div>
  );
}
