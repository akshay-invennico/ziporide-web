import { useEffect } from 'react';
import { X, Copy, Star, Calendar, Clock, Navigation, PoundSterling, CreditCard, MapPin, Car } from 'lucide-react';

export interface TripDetail {
  id: string;
  date: string;
  time: string;
  status: 'Completed' | 'Cancelled' | 'In Progress' | 'Assigned';
  amount?: number;
  distance?: string;
  duration?: string;
  totalFare?: number;
  payment?: { method: string; last4: string };
  route: {
    pickup: string;
    stops: string[];
    destination: string;
  };
  fare: {
    baseFare?: number;
    distanceFare?: number;
    waitingCharges?: number;
    cancellationFee?: number;
    waitingCharge?: number;
    total: number;
  };
  rider: {
    name: string;
    initials: string;
    riderId: string;
    rating: number;
    avatar?: string;
  };
  vehicle?: {
    make: string;
    model: string;
    color: string;
    plate: string;
  };
  ratingByRider?: { stars: number; feedback: string };
  ratingByDriver?: { stars: number; feedback: string };
  cancellation?: {
    cancelledBy: string;
    tripStage: string;
    reason: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trip: TripDetail | null;
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-[18px] h-[18px] ${i < count ? 'fill-[#E9A90A] text-[#E9A90A]' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function TripDetailsModal({ isOpen, onClose, trip }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !trip) return null;

  const isCompleted = trip.status === 'Completed';
  const isCancelled = trip.status === 'Cancelled';

  const statusStyle = {
    Completed: {
      wrapper: 'bg-[#E3F2F1] border-[#B2DFDB] text-[#00A63E]',
      dot: 'bg-[#00A63E]',
    },
    Cancelled: {
      wrapper: 'bg-[#FEE2E2] border-[#FECACA] text-[#FF0707]',
      dot: 'bg-[#FF0707]',
    },
    'In Progress': {
      wrapper: 'bg-[#FFF7ED] border-[#FED7AA] text-[#F6921E]',
      dot: 'bg-[#F6921E]',
    },
    Assigned: {
      wrapper: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]',
      dot: 'bg-[#2563EB]',
    },
  }[trip.status];

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[620px] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE6E5] sticky top-0 bg-white rounded-t-2xl z-20">
          <h2 className="text-[17px] font-bold text-[#101828]">Trip Details</h2>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-[#4E616A]"
          >
            <X className="w-[19px] h-[19px]" />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">

          {/* Overview Section */}
          <div>
            <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-3">Overview</p>

            {/* Trip ID row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#4E616A]">Trip ID:</span>
                <span className="text-[13px] font-bold text-[#1DAFA1]">{trip.id}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(trip.id)}
                  className="text-[#1DAFA1] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <Copy className="w-[15px] h-[15px]" />
                </button>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusStyle.wrapper}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                <span className="text-[12px] font-bold">{trip.status}</span>
              </div>
            </div>

            {/* Date Time Row */}
            <div className="flex items-center gap-2.5 text-[13px] font-bold text-[#101828]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-[16px] h-[16px] text-[#4E616A]" />
                <span>{trip.date}</span>
              </div>
              <div className="w-[4px] h-[4px] rounded-full bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-[16px] h-[16px] text-[#4E616A]" />
                <span>{trip.time}</span>
              </div>
              {isCancelled && (
                <>
                  <div className="w-[4px] h-[4px] rounded-full bg-gray-300" />
                  <span>£{trip.fare.total.toFixed(2)}</span>
                </>
              )}
            </div>

            {/* 4 Stat Cards for Completed */}
            {isCompleted && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="border border-[#DFE6E5] rounded-xl p-3 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Navigation className="w-[14px] h-[14px] text-[#4E616A]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase">Distance</span>
                    <span className="text-[13px] font-bold text-[#101828]">{trip.distance}</span>
                  </div>
                </div>
                <div className="border border-[#DFE6E5] rounded-xl p-3 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Clock className="w-[14px] h-[14px] text-[#4E616A]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase">Duration</span>
                    <span className="text-[13px] font-bold text-[#101828]">{trip.duration}</span>
                  </div>
                </div>
                <div className="border border-[#DFE6E5] rounded-xl p-3 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <PoundSterling className="w-[14px] h-[14px] text-[#4E616A]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase">Total Fare</span>
                    <span className="text-[13px] font-bold text-[#101828]">£{trip.fare.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border border-[#DFE6E5] rounded-xl p-3 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <CreditCard className="w-[14px] h-[14px] text-[#4E616A]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase">Payment</span>
                    <span className="text-[12px] font-bold text-[#101828]">{trip.payment?.method} •••• {trip.payment?.last4}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-b border-[#DFE6E5] opacity-50" />

          {/* Route and Fare Section */}
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Route */}
            <div className="flex-1">
              <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-4">Trip Route</p>
              <div className="relative pl-3 flex flex-col gap-6">
                {/* Dashed line */}
                <div className="absolute top-[18px] bottom-[18px] left-[18.5px] w-px border-l border-dashed border-[#1DAFA1]" />

                {/* Pickup */}
                <div className="relative flex items-start gap-4 z-10">
                  <div className="w-[12px] h-[12px] rounded-full border-[2.5px] border-[#1DAFA1] bg-white mt-1 shrink-0 ml-[0.5px]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase tracking-wide">Pick up</span>
                    <span className="text-[12px] font-bold text-[#101828] leading-tight">{trip.route.pickup}</span>
                  </div>
                </div>

                {/* Stops */}
                {trip.route.stops.map((stop, i) => (
                  <div key={i} className="relative flex items-start gap-4 z-10">
                    <div className="w-[16px] h-[16px] rounded-full bg-[#101828] text-white flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0 -ml-[1.5px]">
                      {i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#4E616A] uppercase tracking-wide">Stop {i + 1}</span>
                      <span className="text-[12px] font-bold text-[#101828] leading-tight">{stop}</span>
                    </div>
                  </div>
                ))}

                {/* Destination */}
                <div className="relative flex items-start gap-4 z-10">
                  <MapPin className="w-[18px] h-[18px] text-[#FF0707] shrink-0 -ml-[2px] mt-0.5 fill-[#FF0707]/10" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase tracking-wide">Destination</span>
                    <span className="text-[12px] font-bold text-[#101828] leading-tight">{trip.route.destination}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="flex-1">
              <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-4">Fare Breakdown</p>
              <div className="bg-[#F0FAF9] border border-[#B2E4E0] rounded-2xl p-4 flex flex-col gap-3">
                {isCancelled ? (
                  <>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#4E616A] font-bold">Cancellation Fee</span>
                      <span className="text-[#101828] font-bold">£{trip.fare.cancellationFee?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#4E616A] font-bold">Waiting Charge</span>
                      <span className="text-[#101828] font-bold">£{trip.fare.waitingCharge?.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#4E616A] font-bold">Base Fare</span>
                      <span className="text-[#101828] font-bold">£{trip.fare.baseFare?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#4E616A] font-bold">Distance Fare</span>
                      <span className="text-[#101828] font-bold">£{trip.fare.distanceFare?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#4E616A] font-bold">Waiting Charges</span>
                      <span className="text-[#101828] font-bold">£{trip.fare.waitingCharges?.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="border-t border-[#B2E4E0] pt-3 mt-1 flex justify-between items-center">
                  <span className="text-[14px] font-bold text-[#101828]">Total</span>
                  <span className="text-[15px] font-bold text-[#101828]">£{trip.fare.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-[#DFE6E5] opacity-50" />

          {/* Rider / Driver Info */}
          <div>
            <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-4">
              {isCancelled ? "Driver's Info" : "Rider's Info"}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3">
                {trip.rider.avatar ? (
                  <img src={trip.rider.avatar} alt={trip.rider.name} className="w-[44px] h-[44px] rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-[44px] h-[44px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[15px] shrink-0">
                    {trip.rider.initials}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#101828]">{trip.rider.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] font-bold text-[#1DAFA1]">{trip.rider.riderId}</span>
                    <div className="w-[3px] h-[3px] rounded-full bg-gray-400" />
                    <div className="flex items-center gap-1">
                      <Star className="w-[12px] h-[12px] fill-[#E9A90A] text-[#E9A90A]" />
                      <span className="text-[12px] font-bold text-[#4E616A]">{trip.rider.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Card for Cancelled */}
              {isCancelled && trip.vehicle && (
                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-[#4E616A] uppercase">Vehicle</span>
                    <span className="text-[13px] font-bold text-[#101828]">{trip.vehicle.make} {trip.vehicle.model}</span>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#4E616A]">
                      <span>{trip.vehicle.color}</span>
                      <div className="w-[3px] h-[3px] rounded-full bg-gray-400" />
                      <span>{trip.vehicle.plate}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <img
                      src="/icons/car-side.png"
                      alt="car"
                      className="w-[60px] opacity-40 grayscale"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Car className="w-8 h-8 text-gray-300" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating & Feedback — Completed only */}
          {isCompleted && trip.ratingByRider && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
              <div>
                <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-2.5">Rating & Feedback by Rider</p>
                <StarRow count={trip.ratingByRider.stars} />
                <p className="text-[12px] font-bold text-[#101828] mt-2 tracking-wide opacity-80">{trip.ratingByRider.feedback}</p>
              </div>
              {trip.ratingByDriver && (
                <div>
                  <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-2.5">Rating & Feedback by Driver</p>
                  <StarRow count={trip.ratingByDriver.stars} />
                  <p className="text-[12px] font-bold text-[#101828] mt-2 tracking-wide opacity-80">{trip.ratingByDriver.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Cancellation Details */}
          {isCancelled && trip.cancellation && (
            <>
              <div className="border-b border-[#DFE6E5] opacity-50" />
              <div>
                <p className="text-[12px] font-bold text-[#4E616A] uppercase tracking-wider mb-4">Cancellation Details</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-[11px] font-bold text-[#4E616A] uppercase mb-0.5">Cancelled by</p>
                    <p className="text-[13px] font-bold text-[#101828]">{trip.cancellation.cancelledBy}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#4E616A] uppercase mb-0.5">Trip Stage</p>
                    <p className="text-[13px] font-bold text-[#101828]">{trip.cancellation.tripStage}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-bold text-[#4E616A] uppercase mb-0.5">Reason for Cancellation</p>
                    <p className="text-[13px] font-bold text-[#101828]">{trip.cancellation.reason}</p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
