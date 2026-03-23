import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

type FilterKey = 'Year' | 'Month' | 'Week';

const dummyData: Record<FilterKey, { name: string; revenue: number; rides: number }[]> = {
  Year: [
    { name: 'Jan', revenue: 20000, rides: 145 },
    { name: 'Feb', revenue: 38000, rides: 212 },
    { name: 'Mar', revenue: 36000, rides: 198 },
    { name: 'Apr', revenue: 61000, rides: 310 },
    { name: 'May', revenue: 42000, rides: 243 },
    { name: 'Jun', revenue: 40000, rides: 228 },
    { name: 'Jul', revenue: 31000, rides: 184 },
    { name: 'Aug', revenue: 61000, rides: 305 },
    { name: 'Sep', revenue: 61000, rides: 318 },
    { name: 'Oct', revenue: 60000, rides: 295 },
    { name: 'Nov', revenue: 48000, rides: 260 },
    { name: 'Dec', revenue: 38000, rides: 215 },
  ],
  Month: [
    { name: 'Week 1', revenue: 9500, rides: 52 },
    { name: 'Week 2', revenue: 12000, rides: 68 },
    { name: 'Week 3', revenue: 8300, rides: 45 },
    { name: 'Week 4', revenue: 14200, rides: 82 },
  ],
  Week: [
    { name: 'Mon', revenue: 2100, rides: 12 },
    { name: 'Tue', revenue: 3400, rides: 21 },
    { name: 'Wed', revenue: 2800, rides: 16 },
    { name: 'Thu', revenue: 4100, rides: 28 },
    { name: 'Fri', revenue: 3700, rides: 24 },
    { name: 'Sat', revenue: 5100, rides: 39 },
    { name: 'Sun', revenue: 2600, rides: 15 },
  ],
};

const yTickFormatter = (value: number) =>
  `£${value >= 1000 ? `${value / 1000}K` : value}`;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    // const value = payload[0].value;
    // const formattedValue = `£${Number(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
      <div className="bg-white p-3 border border-[#DFE6E5] shadow-[0_0_16px_0_#ED9B0E3D] w-[154px] h-[80px] rounded-lg flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1">
          <img src="/icons/rider/income.svg" alt="income" className='w-[24px] h-[24px]' />
          <span className="font-semibold text-[#000000] text-[16px]">£{payload[0].value.toLocaleString()}</span>
        </div>
        <span className="text-[12px] text-[#4E616A] font-medium">From {payload[0].payload.rides} Rides</span>
      </div>
    );
  }
  return null;
};

export default function RevenueAnalyticsChart() {
  const [trendFilter, setTrendFilter] = useState<FilterKey>('Year');
  const activeData = dummyData[trendFilter];

  return (
    <div className="bg-white h-[418px]  p-5 lg:p-6 rounded-lg border border-[#DFE6E5] s col-span-1 lg:col-span-2 xl:col-span-4">

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
          {(['Year', 'Month', 'Week'] as FilterKey[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTrendFilter(filter)}
              className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${trendFilter === filter
                ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                : 'border-[#DFE6E5] text-[#4E616A] '
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart
          - key={filter} forces ResponsiveContainer to remount on filter change,
            which (a) updates data correctly and (b) avoids the width/height -1 warning */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer key={trendFilter} width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1CC8B1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#1CC8B1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
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
      </div>
    </div>
  );
}