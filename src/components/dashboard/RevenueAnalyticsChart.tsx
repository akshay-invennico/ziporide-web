import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

type FilterKey = 'Year' | 'Month' | 'Week';

const dummyData: Record<FilterKey, { name: string; revenue: number }[]> = {
  Year: [
    { name: 'Jan', revenue: 20000 },
    { name: 'Feb', revenue: 38000 },
    { name: 'Mar', revenue: 36000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 42000 },
    { name: 'Jun', revenue: 40000 },
    { name: 'Jul', revenue: 31000 },
    { name: 'Aug', revenue: 61000 },
    { name: 'Sep', revenue: 61000 },
    { name: 'Oct', revenue: 60000 },
    { name: 'Nov', revenue: 48000 },
    { name: 'Dec', revenue: 38000 },
  ],
  Month: [
    { name: 'Week 1', revenue: 9500 },
    { name: 'Week 2', revenue: 12000 },
    { name: 'Week 3', revenue: 8300 },
    { name: 'Week 4', revenue: 14200 },
  ],
  Week: [
    { name: 'Mon', revenue: 2100 },
    { name: 'Tue', revenue: 3400 },
    { name: 'Wed', revenue: 2800 },
    { name: 'Thu', revenue: 4100 },
    { name: 'Fri', revenue: 3700 },
    { name: 'Sat', revenue: 5100 },
    { name: 'Sun', revenue: 2600 },
  ],
};

const yTickFormatter = (value: number) =>
  `£${value >= 1000 ? `${value / 1000}K` : value}`;

export default function RevenueAnalyticsChart() {
  const [filter, setFilter] = useState<FilterKey>('Year');
  const activeData = dummyData[filter];

  return (
    <div className="bg-white p-5 lg:p-6 rounded-lg border border-[#DFE6E5] s col-span-1 lg:col-span-2 xl:col-span-4">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-[20px] font-semibold text-[#000000]">Revenue Analytics</h3>
          <p className="text-[12px] font-medium text-[#686262] mt-1">
            Track your income, upcoming payouts, and transaction history.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5 mt-4 sm:mt-0">
          {(['Year', 'Month', 'Week'] as FilterKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${filter === tab
                ? 'bg-white text-[#1CC8B1] shadow-sm border border-gray-100'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart
          - key={filter} forces ResponsiveContainer to remount on filter change,
            which (a) updates data correctly and (b) avoids the width/height -1 warning */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer key={filter} width="100%" height="100%">
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
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={yTickFormatter}
              width={55}
            />

            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
                padding: '10px 14px',
              }}
              labelStyle={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}
              itemStyle={{ color: '#111827', fontWeight: 700 }}
              // Cast value to number — Recharts types it as ValueType (string|number|undefined)
              // but our data only ever provides numbers.
              formatter={(value) => [`£${Number(value).toLocaleString()}`, 'Revenue']}
              cursor={{ stroke: '#1CC8B1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1CC8B1"
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