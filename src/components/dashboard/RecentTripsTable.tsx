import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { useTrips, useCancelTrip } from '@/hooks/useTrips';
import type { TripRecord } from '@/types/driver.types';

import CancelRideModal from '../ui/CancelRideModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import TripDetailsModal from '../ui/TripDetailsModal';

export default function RecentTripsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelMode, setCancelMode] = useState<'cancel' | 'force-end'>('cancel');

  const { trips, loading, refetch } = useTrips('All', 1, 6);
  const { cancelTrip, isCancelling } = useCancelTrip();

  const handleViewDetails = (trip: TripRecord) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCancelClick = (trip: TripRecord) => {
    setSelectedTrip(trip);
    setCancelMode(trip.status === 'In Progress' ? 'force-end' : 'cancel');
    setIsCancelModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-[#DFE6E5] col-span-1 lg:col-span-2 xl:col-span-4 overflow-hidden mt-1">
      <div className="p-5 lg:p-6 border-b border-[#DFE6E5]">
        <h3 className="text-[20px] font-semibold text-[#000000]">Recent Trips</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-y border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
              {['TRIP ID', 'RIDER', 'DRIVER', 'ROUTE', 'AMOUNT', 'STATUS', 'TIME', 'ACTION'].map(
                (col) => (
                  <th key={col} className="px-4 py-3.5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[14px] text-[#4E616A]">{col}</span>
                      <img src="/icons/rider/updown.svg" alt="sort" className="w-[18px] h-[18px]" />
                    </div>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[#4E616A]">
                  <div className="flex justify-center items-center">
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[#4E616A]">
                  No recent trips found.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors"
                >
                  {/* Trip ID */}
                  <td className="px-4 py-3.5 text-[#14B8A6] font-medium text-[14px] text-nowrap">
                    {trip.id}
                  </td>

                  {/* Rider */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                        {trip.rider.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1DAFA1] text-[14px] text-nowrap">
                          {trip.rider.name}
                        </span>
                        <span className="text-[12px] font-medium text-[#4E616A] text-nowrap">
                          {trip.rider.countryCode} {trip.rider.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {trip.driver.avatar ? (
                        <img
                          src={trip.driver.avatar}
                          alt={trip.driver.name}
                          className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                          {trip.driver.initials}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1DAFA1] text-[14px] text-nowrap">
                          {trip.driver.name}
                        </span>
                        <span className="text-[12px] font-medium text-[#4E616A]">
                          {trip.driver.countryCode} {trip.driver.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3.5 font-medium text-[#4E616A] text-[14px] text-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{trip.route.pickupLocation.split(',')[0]}</span>
                      <ArrowRight className="w-[18px] h-[18px]" />
                      <span>{trip.route.destination.split(',')[0]}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 font-medium text-[#4A5565] text-[14px]">
                    £{(trip.totalFare || trip.amount).toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${trip.status === 'Completed'
                            ? 'bg-[#00A63E]'
                            : trip.status === 'In Progress'
                              ? 'bg-[#F6921E]'
                              : trip.status === 'Assigned'
                                ? 'bg-[#1DAFA1]'
                                : trip.status === 'Cancelled'
                                  ? 'bg-[#FF0707]'
                                  : 'bg-[#6B7280]'
                          }`}
                      />
                      <span
                        className={`font-semibold text-[12px] text-nowrap ${trip.status === 'Completed'
                            ? 'text-[#00A63E]'
                            : trip.status === 'In Progress'
                              ? 'text-[#F6921E]'
                              : trip.status === 'Assigned'
                                ? 'text-[#1DAFA1]'
                                : trip.status === 'Cancelled'
                                  ? 'text-[#FF0707]'
                                  : 'text-[#6B7280]'
                          }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3.5 font-medium text-[#4A5565] text-[14px] text-nowrap">
                    {/* {trip.date} */}
                    {trip.time}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5">
                    <div className="flex justify-start gap-3">
                      <button
                        onClick={() => handleViewDetails(trip)}
                        className="font-medium text-[14px] text-[#1DAFA1] cursor-pointer transition-colors"
                      >
                        <img
                          src="/icons/dashboard/view.svg"
                          alt="view"
                          className="w-[22px] h-[22px]"
                        />
                      </button>
                      {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                        <button onClick={() => handleCancelClick(trip)} className="cursor-pointer">
                          <img
                            src="/icons/dashboard/cancel.svg"
                            alt="cancel"
                            className="w-[22px] h-[22px]"
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TripDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trip={selectedTrip}
      />

      <CancelRideModal
        isOpen={isCancelModalOpen}
        mode={cancelMode}
        onClose={() => setIsCancelModalOpen(false)}
        isLoading={isCancelling}
        onConfirm={async (reason) => {
          if (!selectedTrip) return;
          try {
            const success = await cancelTrip(selectedTrip.rideId || selectedTrip.id, reason);
            if (success) {
              setIsCancelModalOpen(false);
              refetch();
            }
          } catch (err) {
            console.error('Cancellation failed:', err);
          }
        }}
      />
    </div>
  );
}
