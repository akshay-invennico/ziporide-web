import { Star, ChevronLeft, ChevronRight, ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useRiderSummary, useRiderSpendingTrend } from '@/hooks/useRider';
import { useRiderTrips, useRideDetails } from '@/hooks/useTrips';
import type { TripRecord } from '@/types/driver.types';
import type { Rider } from '@/types/rider.types';

import TripDetailsModal from '../../../../components/ui/TripDetailsModal';

interface Props {
  rider: Rider;
}

export default function SpentTripHistoryTab({ rider }: Props) {
  const [trendFilter, setTrendFilter] = useState('Year');
  const [tripsFilter, setTripsFilter] = useState('Year');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const itemsPerPage = 6;

  const {
    trips: currentTrips,
    loading: tripsLoading,
    totalPages,
  } = useRiderTrips(rider.id, tripsFilter, currentPage, itemsPerPage);

  const { trip: detailedRide } = useRideDetails(selectedRideId || undefined);

  // New hooks for summary and trend
  const { summary, loading: summaryLoading } = useRiderSummary(rider.id);
  const apiType = trendFilter === 'Year' ? 'month' : 'daily';
  const { trend: spendingTrend } = useRiderSpendingTrend(rider.id, apiType);

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Custom generic tooltip for the chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#DFE6E5] shadow-[0_0_16px_0_#ED9B0E3D] w-[128px] h-[80px] rounded-lg flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <img src="/icons/rider/income.svg" alt="income" className="w-[24px] h-[24px]" />
            <span className="font-semibold text-[#000000] text-[16px]">
              £{payload[0].value.toLocaleString()}
            </span>
          </div>
          <span className="text-[12px] text-[#4E616A] font-medium">
            From {payload[0].payload.rides} Rides
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full fade-in">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DFE6E5] rounded-lg p-5 flex items-center justify-between ">
          <div>
            <p className="text-[12px] font-medium text-[#4A5565] mb-1">Total Trips</p>
            <h3 className="text-[24px] font-bold text-[#101828]">
              {summaryLoading ? '...' : summary?.totalTrips || 0}
            </h3>
          </div>
          <img src="/icons/rider/card1.svg" alt="card1" className="w-[58px] h-[58px]" />
        </div>

        <div className="bg-white border border-[#DFE6E5] rounded-lg p-5 flex items-center justify-between ">
          <div>
            <p className="text-[12px] font-medium text-[#4A5565] mb-1">Total Spent</p>
            <h3 className="text-[24px] font-bold text-[#101828]">
              £{summaryLoading ? '...' : Number(summary?.totalSpent || 0).toFixed(2)}
            </h3>
          </div>
          <img src="/icons/rider/card2.svg" alt="card1" className="w-[58px] h-[58px]" />
        </div>

        <div className="bg-white border border-[#DFE6E5] rounded-lg p-5 flex items-center justify-between ">
          <div>
            <p className="text-[12px] font-medium text-[#4A5565] mb-1">Average Trip Value</p>
            <h3 className="text-[24px] font-bold text-[#101828]">
              £{summaryLoading ? '...' : Number(summary?.averageTripValue || 0).toFixed(2)}
            </h3>
          </div>
          <img src="/icons/rider/card3.svg" alt="card1" className="w-[58px] h-[58px]" />
        </div>

        <div className="bg-white border border-[#DFE6E5] rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium text-[#4A5565] mb-1">Cancellation Rate</p>
            <h3 className="text-[24px] font-bold text-[#101828]">
              {summaryLoading ? '...' : (summary?.cancellationRate || 0).toFixed(1)}%
            </h3>
          </div>
          <img src="/icons/rider/card4.svg" alt="card1" className="w-[58px] h-[58px]" />
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="bg-white h-[418px] border border-[#DFE6E5] rounded-lg p-6 ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-[20px] font-semibold text-[#101828]">Spending Trend</h3>
            <p className="text-[12px] text-[#4E616A] mt-1 font-medium">
              Track Ride's Spending amounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['Year', 'Month', 'Week'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTrendFilter(filter)}
                className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${
                  trendFilter === filter
                    ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                    : 'border-[#DFE6E5] text-[#4E616A] '
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20B2AA" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#20B2AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value: number) =>
                  value >= 1000 ? `£${value / 1000}K` : `£${value}`
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area
                type="monotone"
                dataKey="spent"
                stroke="#1DAFA1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpent)"
                activeDot={{ r: 4, strokeWidth: 0, fill: '#20B2AA' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-white border border-[#DFE6E5] rounded-lg  overflow-hidden flex flex-col">
        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#DFE6E5]">
          <h3 className="text-[20px] font-semibold text-[#000000]">Recent Trips</h3>
          <div className="flex items-center gap-2">
            {['Year', 'This Month', 'This Week'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setTripsFilter(filter);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
                className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${
                  tripsFilter === filter
                    ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                    : 'border-[#DFE6E5] text-[#4E616A] '
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F9F9F9] border-y border-[#DFE6E5] text-[14px] font-medium uppercase text-[#4E616A]">
                {['TRIP ID', 'DRIVER', 'ROUTE', 'RATING', 'AMOUNT', 'DATE', 'STATUS', 'ACTION'].map(
                  (header) => (
                    <th key={header} className="px-4 py-3.5 cursor-pointer group">
                      <div className="flex items-center justify-between gap-1">
                        <span>{header}</span>
                        <img
                          src="/icons/rider/updown.svg"
                          alt="sort"
                          className="w-[18px] h-[18px]"
                        />
                      </div>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {tripsLoading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-[#4E616A]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-[#1DAFA1] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading trips...</span>
                    </div>
                  </td>
                </tr>
              ) : currentTrips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-[#4E616A]">
                    No trips found for this period.
                  </td>
                </tr>
              ) : (
                currentTrips.map((trip: TripRecord) => (
                  <tr
                    key={trip.id}
                    className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 px-5 text-[#1DAFA1] font-medium text-[14px]">{trip.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          {/* Using a placeholder avatar box if image not present, mimicking image with a colored background */}
                          <div className="w-full h-full bg-teal-100 flex items-center justify-center text-[#1DAFA1] font-bold text-[16px]">
                            {trip.driver.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1DAFA1] text-[14px] ">
                            {trip.driver.name}
                          </span>
                          <span className="text-[12px] font-medium text-[#4E616A]">
                            {trip.driver.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#4E616A] font-medium text-[14px]">
                      <div className="flex items-center gap-2">
                        <span>{trip.route.pickupLocation}</span>
                        <ArrowRightIcon className="w-4 h-4" />
                        <span>{trip.route.destination}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-[15px] w-[15px] fill-[#E9A90A] text-[#E9A90A]" />
                        <span className="font-medium text-[#4E616A] text-[14px]">
                          {trip.driver.rating ? trip.driver.rating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#4E616A] text-[14px]">
                      £{trip.amount ? trip.amount.toFixed(2) : '0.00'}
                    </td>
                    <td className="p-4 font-medium text-[#4E616A] text-[14px]">{trip.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            trip.status === 'Completed'
                              ? 'bg-[#00A63E]'
                              : trip.status === 'In Progress'
                                ? 'bg-[#F6921E]'
                                : trip.status === 'Assigned'
                                  ? 'bg-[#1DAFA1]'
                                  : 'bg-[#FF0707]'
                          }`}
                        ></div>
                        <span
                          className={`font-semibold text-[12px] ${
                            trip.status === 'Completed'
                              ? 'text-[#00A63E]'
                              : trip.status === 'In Progress'
                                ? 'text-[#F6921E]'
                                : trip.status === 'Assigned'
                                  ? 'text-[#1DAFA1]'
                                  : 'text-[#FF0707]'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedRideId(trip.rideId || trip.id)}
                        className="flex items-center gap-1 font-medium text-[14px] transition-colors text-[#1DAFA1] cursor-pointer"
                      >
                        <img src="/icons/rider/eye.svg" alt="eye" className="w-[22px] h-[22px]" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
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
                      className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[14px] font-semibold transition-colors ${
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

      <TripDetailsModal
        isOpen={!!selectedRideId}
        onClose={() => setSelectedRideId(null)}
        trip={detailedRide}
      />
    </div>
  );
}
