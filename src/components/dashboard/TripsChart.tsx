import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [filter, setFilter] = useState('Year');

  return (
    <div className="bg-white p-5 lg:p-6 rounded-lg border border-[#DFE6E5]  col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[20px] font-semibold text-[#000000]">Trips</h3>
          <p className="text-[12px] text-[#4E616A] font-medium  mt-1">Trips Over the time</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
          {['Year', 'Month'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === tab ? 'text-[#1CC8B1] border border-[#1CC8B1] bg-teal-50/10' : 'text-gray-500'
                }`}
            >
              {tab}
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
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
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
