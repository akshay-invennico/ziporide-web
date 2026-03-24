import { Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useState } from 'react';

import TripDetailsModal from '../../../../components/ui/TripDetailsModal';
import type { TripRecord } from '../../../../data/TripHistoryData';

type TripStatus = 'Completed' | 'Cancelled' | 'In Progress' | 'Assigned';

interface Trip {
  id: string;
  rider: { name: string; phone: string; initials: string; color: string };
  from: string;
  to: string;
  amount: number;
  date: string;
  rating: number | null;
  status: TripStatus;
}

const COLORS = ['#1DAFA1', '#E9A90A', '#F87171', '#60A5FA', '#A78BFA', '#34D399'];

const RIDERS = [
  { name: 'Mia Chen', phone: '+44 231 5623', initials: 'MC', color: COLORS[0] },
  { name: 'Amir Suleiman', phone: '+44 231 5632', initials: 'AS', color: COLORS[1] },
  { name: 'Ravi Kumar', phone: '+44 231 5641', initials: 'RK', color: COLORS[2] },
  { name: 'Lara Brown', phone: '+44 231 5650', initials: 'LB', color: COLORS[3] },
  { name: 'Tommy Nguyen', phone: '+44 231 5669', initials: 'TN', color: COLORS[4] },
  { name: 'Nina Davis', phone: '+44 231 5678', initials: 'ND', color: COLORS[5] },
  { name: 'Sophia Smith', phone: '+44 231 5687', initials: 'SS', color: COLORS[0] },
  { name: 'David Patel', phone: '+44 231 5696', initials: 'DP', color: COLORS[1] },
  { name: 'Clara Kim', phone: '+44 231 5705', initials: 'CK', color: COLORS[2] },
];

const routes = [
  { from: 'Uptown', to: 'Station' },
  { from: 'Midtown', to: 'Mall' },
  { from: 'Seaside', to: 'Resort' },
  { from: 'Lakeside', to: 'Park' },
  { from: 'Hilltop', to: 'Observatory' },
  { from: 'Riverside', to: 'Cafe' },
  { from: 'Forestview', to: 'Lodge' },
  { from: 'Suburban', to: 'Plaza' },
  { from: 'Industrial', to: 'Complex' },
];

const STATUSES: TripStatus[] = [
  'Completed',
  'Completed',
  'Completed',
  'Cancelled',
  'In Progress',
  'Assigned',
];

const allTrips: Trip[] = Array.from({ length: 99 }, (_, i) => {
  const rider = RIDERS[i % RIDERS.length];
  const route = routes[i % routes.length];
  const status = STATUSES[i % STATUSES.length];
  const ratings = [4.0, null, 2.0, 5.0, null, 3.0, 2.0, 4.0, 3.0];
  return {
    id: `ZPT-284514${8 + i}`,
    rider,
    from: route.from,
    to: route.to,
    amount: parseFloat((12.5 + (i % 9) * 2).toFixed(2)),
    date: `2023-${String(10 - Math.floor(i / 10)).padStart(2, '0')}-${String(28 - (i % 28)).padStart(2, '0')}`,
    rating: status === 'Completed' ? (ratings[i % ratings.length] ?? null) : null,
    status,
  };
});

const ITEMS_PER_PAGE = 12;

function StatusBadge({ status }: { status: TripStatus }) {
  const cfg: Record<TripStatus, { dot: string; text: string }> = {
    Completed: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]' },
    Cancelled: { dot: 'bg-[#FF0707]', text: 'text-[#FF0707]' },
    'In Progress': { dot: 'bg-[#F6921E]', text: 'text-[#F6921E]' },
    Assigned: { dot: 'bg-[#2563EB]', text: 'text-[#2563EB]' },
  };
  const { dot, text } = cfg[status];
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className={`text-[12px] font-semibold ${text}`}>{status}</span>
    </div>
  );
}

export default function DriverTripHistoryTab() {
  const [period, setPeriod] = useState<'Year' | 'This Month' | 'This Week'>('Year');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);

  const totalPages = Math.ceil(allTrips.length / ITEMS_PER_PAGE);
  const pageData = allTrips.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  const handleViewTrip = (trip: Trip) => {
    const record: TripRecord = {
      id: trip.id,
      rider: {
        id: 'RDR-' + trip.id,
        name: trip.rider.name,
        phone: trip.rider.phone,
        avatar: trip.rider.initials,
        rating: trip.rating ?? 4.5,
      },
      driver: {
        id: 'DRV-001',
        name: 'James Williams',
        phone: '+44 231 5732',
        avatar: '/icons/avatar1.png',
        rating: 4.9,
        vehicle: {
          name: 'Standard',
          photo: '/icons/vehicle/vehicle2.svg',
          color: 'Pearl White',
          registrationNumber: 'LK21 MNX',
        },
      },
      route: {
        pickupLocation: trip.from,
        stop1Location: 'City Center',
        destination: trip.to,
        from: trip.from,
        to: trip.to,
      },
      distance: 6.4,
      estimatedTime: 18,
      totalFare: trip.amount,
      amount: trip.amount,
      date: trip.date,
      time: '09:41 AM',
      status: trip.status,
    };
    setSelectedTrip(record);
    setIsModalOpen(true);
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-[18px] font-bold text-[#101828]">Recent Trips</h3>
        <div className="flex items-center rounded-lg gap-3 overflow-hidden">
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

      {/* Table */}
      <div className="border border-[#DFE6E5] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#DFE6E5] text-[12px] font-medium uppercase tracking-wider text-[#4E616A]">
                {['TRIP ID', 'RIDER', 'ROUTE', 'AMOUNT', 'DATE', 'RATING', 'STATUS', 'ACTION'].map(
                  (col) => (
                    <th key={col} className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {col}
                        {col !== 'ACTION' && (
                          <img
                            src="/icons/rider/updown.svg"
                            alt="sort"
                            className="w-3 h-3 opacity-60"
                          />
                        )}
                      </div>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {pageData.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Trip ID */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-medium text-[#1DAFA1] hover:underline cursor-pointer">
                      {trip.id}
                    </span>
                  </td>

                  {/* Rider */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                        style={{ backgroundColor: trip.rider.color }}
                      >
                        {trip.rider.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#101828] leading-tight">
                          {trip.rider.name}
                        </p>
                        <p className="text-[11px] text-[#4E616A] font-medium">{trip.rider.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#4E616A]">
                      <span className="whitespace-nowrap">{trip.from}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4E616A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <span className="whitespace-nowrap">{trip.to}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-[13px] font-medium text-[#4E616A]">
                    £{trip.amount.toFixed(2)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-[13px] font-medium text-[#4E616A] whitespace-nowrap">
                    {trip.date}
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    {trip.rating !== null ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-[14px] h-[14px] fill-[#E9A90A] text-[#E9A90A]" />
                        <span className="text-[13px] font-medium text-[#4E616A]">
                          {trip.rating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[13px] text-[#4E616A]">-</span>
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
                      className="flex items-center gap-1.5 text-[13px] font-medium text-[#1DAFA1] hover:underline cursor-pointer"
                    >
                      <Eye className="w-[15px] h-[15px]" />
                      View
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
            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors border ${
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
            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
      />
    </div>
  );
}
