import { Star, ChevronLeft, ChevronRight, ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDriverTrips, useTripDetails } from '@/hooks/useDriver';
import type { TripRecord } from '@/types/driver.types';

import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import TripDetailsModal from '../../../../components/ui/TripDetailsModal';

const ITEMS_PER_PAGE = 12;

interface TripTableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

const tripTableColumns: TripTableColumn[] = [
  { key: 'tripId', label: 'TRIP ID', sortable: true },
  { key: 'rider', label: 'RIDER', sortable: true },
  { key: 'route', label: 'ROUTE', sortable: true },
  { key: 'amount', label: 'AMOUNT', sortable: true },
  { key: 'date', label: 'DATE', sortable: true },
  { key: 'rating', label: 'RATING', sortable: true },
  { key: 'status', label: 'STATUS', sortable: true },
  { key: 'action', label: 'ACTION', sortable: false },
];

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
      )
        pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

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

  if (loading && trips.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  return (
    <div className="p-1">
      {/* Table */}
      <div className="border border-[#DFE6E5] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Recent Trips title + period filters inside table */}
              <tr className="border-b border-[#DFE6E5] bg-white">
                <th colSpan={tripTableColumns.length} className="px-4 py-4">
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
                          className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${
                            period === p
                              ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                              : 'border-[#DFE6E5] text-[#4E616A]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </th>
              </tr>

              {/* Column headers via map */}
              <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
                {tripTableColumns.map((col) => (
                  <th key={col.key} className="px-4 py-3.5 whitespace-nowrap">
                    {col.sortable ? (
                      <div className="flex justify-between gap-1">
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
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Trip ID */}
                  <td className="px-4 py-3">
                    <span className="text-[14px] font-medium text-[#1DAFA1] text-nowrap cursor-pointer">
                      {trip.id}
                    </span>
                  </td>

                  {/* Rider */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[36px] h-[36px] rounded-full flex bg-[#1DAFA1] items-center justify-center text-white font-bold text-[14px] shrink-0">
                        {trip.rider.initials}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[#1DAFA1] leading-tight text-nowrap">
                          {trip.rider.name}
                        </p>
                        <p className="text-[12px] text-[#4E616A] font-medium">{trip.rider.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#4E616A]">
                      <span className="whitespace-nowrap">{trip.route.pickupLocation}</span>
                      <ArrowRightIcon className="w-4 h-4" />
                      <span className="whitespace-nowrap">{trip.route.destination}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A]">
                    £{trip.totalFare.toFixed(2)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A] whitespace-nowrap">
                    {trip.date}
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    {trip.rider.rating !== null ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-[14px] h-[14px] fill-[#E9A90A] text-[#E9A90A]" />
                        <span className="text-[14px] font-medium text-[#4E616A]">
                          {trip.rider.rating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] text-[#4E616A]">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.status} />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewTrip(trip)}
                      disabled={loadingTripId === (trip.rideId || trip.id)}
                      className="flex items-center gap-1.5 text-[14px] font-medium text-[#1DAFA1] cursor-pointer disabled:opacity-50"
                    >
                      {loadingTripId === (trip.rideId || trip.id) ? (
                        <LoadingSpinner size={20} />
                      ) : (
                        <>
                          <img src="/icons/rider/eye.svg" alt="eye" className="w-[22px] h-[22px]" />
                          View
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#DFE6E5] flex items-center justify-end gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-full cursor-pointer border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                className={`min-w-[32px] cursor-pointer h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors border ${
                  currentPage === page
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
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-full cursor-pointer border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-[20px] h-[20px]" />
          </button>
        </div>
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
