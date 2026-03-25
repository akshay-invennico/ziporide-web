import { X, Copy, Star } from 'lucide-react';
import { useState } from 'react';

import type { TripRecord } from '../../data/TripHistoryData';

import CancelRideModal from './CancelRideModal';

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripRecord | null;
}

const STATUS_BADGE: Record<string, { bg: string; dot: string; text: string }> = {
  Assigned: { bg: 'bg-[#EEFFFD]', dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
  'In Progress': { bg: 'bg-[#FFF7E4]', dot: 'bg-[#F6921E]', text: 'text-[#F6921E]' },
  Completed: { bg: 'bg-[#EAFFF2]', dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
  Cancelled: { bg: 'bg-[#FFEEEE]', dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' },
};

const TripDetailsModal = ({ isOpen, onClose, trip }: TripDetailsModalProps) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (!isOpen || !trip) return null;

  const badge = STATUS_BADGE[trip.status] ?? STATUS_BADGE['Assigned'];
  const isAssigned = trip.status === 'Assigned';
  const isInProgress = trip.status === 'In Progress';
  const showCancelBtn = isAssigned || isInProgress;
  const isCompleted = trip.status === 'Completed';
  const isCancelled = trip.status === 'Cancelled';
  const cancelledByRider = isCancelled && trip.cancellationDetails?.cancelledBy === 'rider';
  const cancelledByDriver = isCancelled && trip.cancellationDetails?.cancelledBy === 'driver';

  const handleCopy = () => {
    navigator.clipboard.writeText(trip.id);
  };

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-xl w-full max-w-[900px] flex flex-col overflow-hidden max-h-[95vh] overflow-y-auto hide-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE6E5]">
            <h2 className="text-[18px] font-semibold text-[#101828]">Trip Details</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full  cursor-pointer"
            >
              <X className="w-[22px] h-[22px] text-[#4E616A]" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Overview Section */}
            <div className="flex flex-col gap-3">
              <span className="text-[14px] font-medium text-[#4E616A]">Overview</span>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#4E616A]">Trip ID:</span>
                  <span className="text-[14px] font-semibold text-[#1DAFA1]">{trip.id}</span>
                  <button onClick={handleCopy} className="cursor-pointer">
                    <Copy className="w-[14px] h-[14px] text-[#1DAFA1]" />
                  </button>
                </div>
                <div className={`flex items-center ${badge.bg} rounded-[500px] px-4 py-2 gap-1.5`}>
                  <div className={`w-[6px] h-[6px] rounded-full ${badge.dot}`} />
                  <span className={`text-[14px] font-medium ${badge.text}`}>{trip.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[14px] font-medium text-[#000000]">
                <div className="flex items-center gap-1.5">
                  <img src="/icons/verification/cale.svg" alt="date" className="w-4 h-4" />
                  <span>{trip.date}</span>
                </div>
                <div className="w-[5px] h-[5px] rounded-full bg-[#939999]" />
                <div className="flex items-center gap-3">
                  <span>{trip.time}</span>
                  {cancelledByRider && (
                    <>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#939999]" />
                      <span className="font-semibold text-[#101828]">
                        £{trip.totalFare.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {!isCancelled && (
                <div className={`grid ${isCompleted ? 'grid-cols-4' : 'grid-cols-3'} gap-2 mt-1`}>
                  <div className="border border-[#DFE6E5] rounded-lg p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                      <img
                        src="/icons/tripDetails/Distance.svg"
                        alt="time"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-[#747C84]">Distance</span>
                      <span className="text-[14px] font-semibold text-[#000000]">
                        {trip.distance} Kms
                      </span>
                    </div>
                  </div>
                  <div className="border border-[#DFE6E5] rounded-lg p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                      <img
                        src="/icons/tripDetails/Time.svg"
                        alt="time"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-[#747C84]">
                        Estimated Duration
                      </span>
                      <span className="text-[14px] font-semibold text-[#000000]">
                        {trip.estimatedTime} Mins
                      </span>
                    </div>
                  </div>
                  <div className="border border-[#DFE6E5] rounded-lg p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                      <img
                        src="/icons/tripDetails/Price.svg"
                        alt="time"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-[#747C84]">Total Fare</span>
                      <span className="text-[14px] font-semibold text-[#000000]">
                        £{trip.totalFare}
                      </span>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="border border-[#DFE6E5] rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                        <img
                          src="/icons/tripDetails/Payment.svg"
                          alt="payment"
                          className="w-[20px] h-[20px]"
                          onError={(e) => {
                            e.currentTarget.src = '/icons/tripDetails/Price.svg';
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-[#747C84]">Payment</span>
                        <span className="text-[14px] font-semibold text-[#000000]">
                          {trip.payment?.method || 'Visa'} •••• {trip.payment?.last4 || '4245'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Route + Fare Section */}
            <div className=" border-t border-[#DFE6E5] pt-5 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <span className="text-[14px] font-medium text-[#4E616A]">Trip Route</span>
                <div className="flex flex-col gap-0 relative">
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <img
                        src="/icons/tripDetails/Ellipse.svg"
                        alt="pickup"
                        className="w-[20px] h-[20px]"
                      />
                      <div className="w-[4px] h-10 border-l-2 border-dashed border-[#1DAFA1]" />
                    </div>
                    <div className="flex flex-col pb-4">
                      <span className="text-[12px] font-medium text-[#4E616A]">Pick up</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {trip.route.pickupLocation}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#000000] shrink-0 mt-0.5 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">1</span>
                      </div>
                      <div className="w-[4px] h-10 border-l-2 border-dashed border-[#1DAFA1]" />
                    </div>
                    <div className="flex flex-col pb-4">
                      <span className="text-[12px] font-medium text-[#4E616A]">Stop 1</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {trip.route.stop1Location}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <img
                        src="/icons/tripDetails/Group.svg"
                        alt="pickup"
                        className="w-[22px] h-[22px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-[#4E616A]">Destination</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {trip.route.destination}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!cancelledByDriver && (
                <div className="flex flex-col gap-3">
                  <span className="text-[14px] font-medium text-[#4E616A]">Fare Breakdown</span>
                  <div
                    className={`border border-[#1DAFA1] ${isCompleted || isCancelled ? 'bg-[#DCFCE7]' : 'bg-[#DCFCE7]'} rounded-lg overflow-hidden`}
                  >
                    <div className="divide-y divide-[#DFE6E5]">
                      <div className="flex justify-between px-4 py-2.5 text-[14px] font-medium">
                        <span className="text-[#4E616A]">
                          {isCancelled ? 'Cancellation Fee' : 'Base Fare'}
                        </span>
                        <span className="font-semibold text-[12px] text-[#101828]">
                          £
                          {isCancelled
                            ? (trip.cancellationDetails?.fee || 2.5).toFixed(2)
                            : '12.50'}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-2.5 text-[14px] font-medium">
                        <span className="text-[#4E616A]">
                          {isCancelled ? 'Waiting Charge' : 'Distance Fare'}
                        </span>
                        <span className="font-semibold text-[12px] text-[#101828]">
                          £
                          {isCancelled
                            ? (trip.cancellationDetails?.waitingCharge || 1.0).toFixed(2)
                            : '3.00'}
                        </span>
                      </div>
                      {!isCancelled && (
                        <div className="flex justify-between px-4 py-2.5 text-[14px] font-medium">
                          <span className="text-[#4E616A]">
                            {isCompleted ? 'Waiting Charges' : 'Airport Parking Charges'}
                          </span>
                          <span className="font-semibold text-[12px] text-[#101828]">£3.00</span>
                        </div>
                      )}
                      <div
                        className={`flex justify-between px-4 py-2.5 ${isCompleted || isCancelled ? 'bg-[#DCFCE7]' : 'bg-[#DCFCE7]'} text-[14px] font-semibold`}
                      >
                        <span className="text-[#101828]">Total</span>
                        <span className="font-semibold text-[16px] text-[#101828]">
                          £{trip.totalFare.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rider + Driver Section */}
            <div className="border-t border-[#DFE6E5] pt-5 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-medium text-[#4E616A]">Rider's Info</span>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white text-[16px] font-bold shrink-0">
                    {trip.rider.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[#101828]">
                      {trip.rider.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[12px] text-[#1DAFA1] font-medium">
                        {trip.rider.id}
                      </span>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#4E616A]" />
                      <div className="flex items-center gap-1">
                        <Star className="w-[16px] h-[16px] text-[#E9A90A] fill-[#E9A90A]" />
                        <span className="text-[12px] text-[#4E616A] font-medium">
                          {trip.rider.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!cancelledByDriver && (
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] font-medium text-[#4E616A]">Driver's Info</span>
                  <div className="flex items-center gap-3">
                    <div className="w-[42px] h-[42px] rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
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
                            parent.style.color = 'white';
                            parent.style.fontSize = '16px';
                            parent.style.fontWeight = '700';
                            parent.innerText = trip.driver.name
                              .split(' ')
                              .map((w: string) => w[0])
                              .join('')
                              .slice(0, 2);
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-[#101828]">
                        {trip.driver.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[12px] text-[#1DAFA1] font-medium">
                          {trip.driver.id}
                        </span>
                        <div className="w-[5px] h-[5px] rounded-full bg-[#4E616A]" />
                        <div className="flex items-center gap-1">
                          <Star className="w-[16px] h-[16px] text-[#E9A90A] fill-[#E9A90A]" />
                          <span className="text-[12px] text-[#4E616A] font-medium">
                            {trip.driver.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" rounded-lg p-3 flex items-center justify-between mt-1 bg-[#F7F7F7]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-medium text-[#4E616A]">Vehicle</span>
                      <span className="text-[14px] font-semibold text-[#101828]">
                        {trip.driver.vehicle.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[12px] font-medium text-[#4E616A]">
                          {trip.driver.vehicle.color}
                        </span>
                        <div className="w-[5px] h-[5px] rounded-full bg-[#4E616A]" />
                        <span className="text-[12px] font-medium text-[#4E616A]">
                          {trip.driver.vehicle.registrationNumber}
                        </span>
                      </div>
                    </div>
                    <img
                      src="/icons/tripDetails/car.svg"
                      alt="car"
                      className="h-[68px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {isCompleted && (
              <div className="border-t border-[#DFE6E5] pt-5 mt-2 grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  <span className="text-[14px] font-medium text-[#4E616A]">
                    Rating & Feedback by Rider
                  </span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= (trip.riderFeedback?.rating || 5)
                              ? 'text-[#E9A90A] fill-[#E9A90A]'
                              : 'text-[#DFE6E5]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] font-medium text-[#4E616A]">
                      {trip.riderFeedback?.note || 'Professional'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[14px] font-medium text-[#4E616A]">
                    Rating & Feedback by Driver
                  </span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= (trip.driverFeedback?.rating || 5)
                              ? 'text-[#E9A90A] fill-[#E9A90A]'
                              : 'text-[#DFE6E5]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] font-medium text-[#4E616A]">
                      {trip.driverFeedback?.note || 'Humble'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {cancelledByRider && (
              <div className="border-t border-[#DFE6E5] pt-5 mt-2 flex flex-col gap-5">
                <span className="text-[14px] font-medium text-[#4E616A]">Cancellation Details</span>
                <div className="grid grid-cols-2 gap-5 ">
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-medium text-[#4E616A]">Cancelled by</span>
                    <span className="text-[14px] font-semibold uppercase text-[#000000]">
                      {trip.cancellationDetails?.cancelledBy || 'Rider'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-medium text-[#4E616A]">Trip Stage</span>
                    <span className="text-[14px] font-semibold text-[#000000]">
                      {trip.cancellationDetails?.tripStage || 'After Driver Arrival'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-medium text-[#4E616A]">
                    Reason for Cancellation
                  </span>
                  <span className="text-[14px] font-semibold text-[#000000]">
                    {trip.cancellationDetails?.reason || "Driver's Behaviour"}
                  </span>
                </div>
              </div>
            )}

            {cancelledByDriver && (
              <div className="border-t border-[#DFE6E5] pt-5 mt-2 flex flex-col gap-3">
                <span className="text-[14px] font-medium text-[#4E616A]">Cancellation Reason</span>
                <span className="text-[14px] font-medium text-[#000000]">
                  {trip.cancellationDetails?.reason || 'Taking Too Much time to get Ride Confirm'}
                </span>
              </div>
            )}
          </div>

          {/* Footer Section */}
          {showCancelBtn && (
            <div className="px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-md border border-[#DFE6E5] text-[#FF0707] text-[14px] font-medium cursor-pointer"
              >
                <img
                  src="/icons/tripDetails/cancell.svg"
                  alt="cancel"
                  className="w-[22px] h-[22px]"
                />
                {isInProgress ? 'Force End Ride' : 'Cancel Ride'}
              </button>
            </div>
          )}
        </div>
      </div>
      <CancelRideModal
        isOpen={isCancelModalOpen}
        mode={isInProgress ? 'force-end' : 'cancel'}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(reason, details) => {
          console.warn(`${isInProgress ? 'Force End' : 'Cancellation'} confirmed:`, {
            reason,
            details,
          });
          setIsCancelModalOpen(false);
          // In a real app, you would handle the cancellation logic here (API call, etc.)
        }}
      />
    </>
  );
};

export default TripDetailsModal;
