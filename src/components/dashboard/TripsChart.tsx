import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FilterKey = 'Year' | 'Month';

const dummyData = [
  { name: 'Jan', trips: 11000 },
  { name: 'Feb', trips: 20000 },
  { name: 'Mar', trips: 16000 },
  { name: 'Apr', trips: 36000 },
  { name: 'May', trips: 42000 },
  { name: 'Jun', trips: 53000 },
  { name: 'Jul', trips: 59000 },
  { name: 'Aug', trips: 52000 },
  { name: 'Sep', trips: 44000 }
];

export default function TripsChart() {
  const [filter, setFilter] = useState<FilterKey>('Year');


  return (
    <div className="bg-white p-5 lg:p-6 rounded-lg border border-[#DFE6E5]  col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[20px] font-semibold text-[#000000]">Trips</h3>
          <p className="text-[12px] text-[#4E616A] font-medium  mt-1">Trips Over the time</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {(['Year', 'Month'] as FilterKey[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-1.5 text-[13px] cursor-pointer font-medium rounded-sm border transition-colors ${filter === item
                ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                : 'border-[#DFE6E5] text-[#4E616A] bg-white'
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1CC8B1" stopOpacity={0.05} />
                <stop offset="95%" stopColor="#1CC8B1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
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
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="trips"
              stroke="#1CC8B1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTrips)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
