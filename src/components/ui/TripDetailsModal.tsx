import { X, Copy, Star } from 'lucide-react';

import type { TripRecord } from '../../data/TripHistoryData';

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripRecord | null;
}

const STATUS_BADGE: Record<string, { dot: string; text: string }> = {
  Assigned: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
  'In Progress': { dot: 'bg-[#F6921E]', text: 'text-[#F6921E]' },
  Completed: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
  Cancelled: { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' },
};

const TripDetailsModal = ({ isOpen, onClose, trip }: TripDetailsModalProps) => {
  if (!isOpen || !trip) return null;

  const badge = STATUS_BADGE[trip.status] ?? STATUS_BADGE['Assigned'];
  const isAssigned = trip.status === 'Assigned';
  const isInProgress = trip.status === 'In Progress';
  const showCancelBtn = isAssigned || isInProgress;

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
              <X className="w-4 h-4 text-[#4E616A]" />
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
                <div className="flex items-center bg-[#EEFFFD] rounded-[500px] px-4 py-2 gap-1.5">
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
                <span>{trip.time}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1">
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
                    <span className="text-[14px] font-semibold text-[#000000]">15.5 Kms</span>
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
                    <span className="text-[14px] font-semibold text-[#000000]">28 Mins</span>
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
                      £{trip.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route + Fare Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <span className="text-[14px] font-medium text-[#4E616A]">Tripe Route</span>
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
                        Gate6, Nottingham Central Airport, Greater..
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
                        75, Cheapside, One New Change, St Paul's,..
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
                        48, Notting Hill Gate, The Coronet Theatre,..
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[14px] font-medium text-[#4E616A]">Fare Breakdown</span>
                <div className="border border-[#1DAFA1] bg-[#DCFCE7] rounded-lg overflow-hidden">
                  <div className="divide-y divide-[#DFE6E5]">
                    <div className="flex justify-between px-4 py-2.5 text-[14px] font-medium">
                      <span className="text-[#4E616A]">Base Fare</span>
                      <span className="font-semibold text-[12px] text-[#101828]">£12.50</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 text-[14px] font-medium">
                      <span className="text-[#4E616A]">Distance Fare</span>
                      <span className="font-semibold text-[12px] text-[#101828]">£3.00</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 text-[14px] font-medium">
                      <span className="text-[#4E616A]">Airport Parking Charges</span>
                      <span className="font-semibold text-[12px] text-[#101828]">£3.00</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 bg-[#DCFCE7] text-[14px] font-semibold">
                      <span className="text-[#101828]">Total</span>
                      <span className="font-semibold text-[16px] text-[#101828]">
                        £{trip.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rider + Driver Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <span className="text-[12px] text-[#1DAFA1] font-medium">RDR-2001</span>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#4E616A]" />
                      <div className="flex items-center gap-1">
                        <Star className="w-[16px] h-[16px] text-[#E9A90A] fill-[#E9A90A]" />
                        <span className="text-[12px] text-[#4E616A] font-medium">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                      <span className="text-[12px] text-[#1DAFA1] font-medium">RDR-2001</span>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#4E616A]" />
                      <div className="flex items-center gap-1">
                        <Star className="w-[16px] h-[16px] text-[#E9A90A] fill-[#E9A90A]" />
                        <span className="text-[12px] text-[#4E616A] font-medium">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" rounded-lg p-3 flex items-center justify-between mt-1 bg-[#F7F7F7]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] font-medium text-[#4E616A]">Vehicle</span>
                    <span className="text-[14px] font-semibold text-[#101828]">Tesla Model S</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[12px] font-medium text-[#4E616A]">Silver</span>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#4E616A]" />
                      <span className="text-[12px] font-medium text-[#4E616A]">EVN84235TS03</span>
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
            </div>
          </div>

          {/* Footer Section */}
          {showCancelBtn && (
            <div className="px-6 py-4  flex items-center justify-end">
              <button className="flex items-center gap-2 px-5 py-2 rounded-sm border border-[#FF0707] text-[#FF0707] text-[14px] font-medium cursor-pointer hover:bg-[#FFF6F6] transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF0707"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Cancel Ride
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TripDetailsModal;
