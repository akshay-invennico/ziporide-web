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

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRevenueAnalytics } from '@/hooks/useDashboard';

type FilterKey = 'Year' | 'Month';

const yTickFormatter = (value: number) => `£${value >= 1000 ? `${value / 1000}K` : value}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#DFE6E5] shadow-[0_0_16px_0_#ED9B0E3D] w-[154px] h-[80px] rounded-lg flex flex-col items-start">
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

export default function RevenueAnalyticsChart() {
  const [trendFilter, setTrendFilter] = useState<FilterKey>('Year');
  const { data: activeData, loading, error } = useRevenueAnalytics(trendFilter);

  return (
    <div className="bg-white h-[418px]  p-5 rounded-lg border border-[#DFE6E5] s col-span-1 lg:col-span-2 xl:col-span-4 transition-all overflow-hidden">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-[20px] font-semibold text-[#000000]">Revenue Analytics</h3>
          <p className="text-[12px] font-medium text-[#686262] mt-1">
            Track your income, upcoming payouts, and transaction history.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {(['Year', 'Month'] as FilterKey[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTrendFilter(filter)}
              disabled={loading}
              className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${trendFilter === filter
                ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                : 'border-[#DFE6E5] text-[#4E616A] '
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <LoadingSpinner />
          </div>
        )}

        {error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            <p className="text-sm">Failed to load revenue data</p>
          </div>
        ) : activeData.length === 0 && !loading ? (
          <div className="flex h-full items-center justify-center text-[#4E616A]">
            <p className="text-sm">No data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer key={trendFilter} width="100%" height="100%">
            <AreaChart data={activeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1CC8B1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1CC8B1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

              <XAxis
                dataKey={(item) => item.month || item.day || 'N/A'}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#4E616A', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#4E616A', fontSize: 12, fontWeight: 500 }}
                tickFormatter={yTickFormatter}
                width={55}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#1CC8B1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1DAFA1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{ r: 5, fill: '#1CC8B1', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
