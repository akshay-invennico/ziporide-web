import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { tripHistoryData, type TripRecord } from '../../data/TripHistoryData';
import CancelRideModal from '../ui/CancelRideModal';
import TripDetailsModal from '../ui/TripDetailsModal';

const dummyTrips = [
  {
    id: 'ZPT-2845148',
    rider: { name: 'Mia Chen', phone: '+44 231 5623', initials: 'MC' },
    driver: { name: 'Jasmine Lee', phone: '+44 987 6543', img: 'https://i.pravatar.cc/150?img=1' },
    routeFrom: 'Uptown',
    routeTo: 'Station',
    amount: 12.5,
    status: 'Assigned',
    time: '2min ago',
  },
  {
    id: 'ZPT-2845149',
    rider: { name: 'Amir Suleiman', phone: '+44 231 5632', initials: 'AS' },
    driver: {
      name: 'David Thompson',
      phone: '+44 564 7381',
      img: 'https://i.pravatar.cc/150?img=11',
    },
    routeFrom: 'Midtown',
    routeTo: 'Mall',
    amount: 22.0,
    status: 'In Progress',
    time: '3min ago',
  },
  {
    id: 'ZPT-2845150',
    rider: { name: 'Ravi Kumar', phone: '+44 231 5641', initials: 'RK' },
    driver: { name: 'Aisha Patel', phone: '+44 123 4567', img: 'https://i.pravatar.cc/150?img=5' },
    routeFrom: 'Seaside',
    routeTo: 'Resort',
    amount: 18.0,
    status: 'Completed',
    time: '4min ago',
  },
  {
    id: 'ZPT-2845151',
    rider: { name: 'Lara Brown', phone: '+44 231 5650', initials: 'LB' },
    driver: { name: 'Oliver Smith', phone: '+44 246 6103', img: 'https://i.pravatar.cc/150?img=8' },
    routeFrom: 'Lakeside',
    routeTo: 'Park',
    amount: 30.0,
    status: 'Cancelled',
    time: '5min ago',
  },
  {
    id: 'ZPT-2845152',
    rider: { name: 'Tommy Nguyen', phone: '+44 231 5669', initials: 'TN' },
    driver: {
      name: 'Sophie Wright',
      phone: '+44 753 1594',
      img: 'https://i.pravatar.cc/150?img=9',
    },
    routeFrom: 'Hilltop',
    routeTo: 'Observatory',
    amount: 21.5,
    status: 'In Progress',
    time: '6min ago',
  },
  {
    id: 'ZPT-2845153',
    rider: { name: 'Nina Davis', phone: '+44 231 5678', initials: 'ND' },
    driver: {
      name: 'Liam Johnson',
      phone: '+44 321 9876',
      img: 'https://i.pravatar.cc/150?img=12',
    },
    routeFrom: 'Riverside',
    routeTo: 'Cafe',
    amount: 16.0,
    status: 'Completed',
    time: '7min ago',
  },
];

export default function RecentTripsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelMode, setCancelMode] = useState<'cancel' | 'force-end'>('cancel');

  const handleViewDetails = (tripId: string) => {
    const fullTrip = tripHistoryData.find((t) => t.id === tripId);
    if (fullTrip) {
      setSelectedTrip(fullTrip);
      setIsModalOpen(true);
    }
  };

  const handleCancelClick = (status: string) => {
    setCancelMode(status === 'In Progress' ? 'force-end' : 'cancel');
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
            {dummyTrips.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors"
              >
                {/* Trip ID */}
                <td className="px-4 py-3.5 text-[#14B8A6] font-medium text-[14px]">{trip.id}</td>

                {/* Rider */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white font-bold text-[18px] shrink-0">
                      {trip.rider.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#1DAFA1] text-[14px]">
                        {trip.rider.name}
                      </span>
                      <span className="text-[12px] font-medium text-[#4E616A]">
                        {trip.rider.phone}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Driver */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={trip.driver.img}
                      alt={trip.driver.name}
                      className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-[#1DAFA1] text-[14px]">
                        {trip.driver.name}
                      </span>
                      <span className="text-[12px] font-medium text-[#4E616A]">
                        {trip.driver.phone}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Route */}
                <td className="px-4 py-3.5 font-medium text-[#4E616A] text-[14px]">
                  <div className="flex items-center gap-1.5">
                    <span>{trip.routeFrom}</span>
                    <ArrowRight className="w-[18px] h-[18px]" />
                    <span>{trip.routeTo}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-4 py-3.5 font-medium text-[#4A5565] text-[14px]">
                  £{trip.amount.toFixed(2)}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        trip.status === 'Completed'
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
                      className={`font-semibold text-[12px] ${
                        trip.status === 'Completed'
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
                <td className="px-4 py-3.5 font-medium text-[#4A5565] text-[14px]">{trip.time}</td>

                {/* Action */}
                <td className="px-4 py-3.5">
                  <div className="flex justify-start gap-3">
                    <button
                      onClick={() => handleViewDetails(trip.id)}
                      className="font-medium text-[14px] text-[#1DAFA1] cursor-pointer transition-colors"
                    >
                      <img
                        src="/icons/dashboard/view.svg"
                        alt="view"
                        className="w-[20px] h-[20px]"
                      />
                    </button>
                    {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelClick(trip.status)}
                        className="cursor-pointer"
                      >
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
            ))}
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
        onConfirm={() => {
          setIsCancelModalOpen(false);
        }}
      />
    </div>
  );
}
