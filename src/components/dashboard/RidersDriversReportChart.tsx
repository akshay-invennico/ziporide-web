import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FilterKey = 'Year' | 'Month';

const dummyData = [
  { name: 'Jan', riders: 58000, drivers: 41000 },
  { name: 'Feb', riders: 47000, drivers: 50000 },
  { name: 'Mar', riders: 23000, drivers: 7000 },
  { name: 'Apr', riders: 21000, drivers: 21000 },
  { name: 'May', riders: 27000, drivers: 22000 },
  { name: 'Jun', riders: 58000, drivers: 41000 },
  { name: 'Jul', riders: 24000, drivers: 41000 },
  { name: 'Aug', riders: 35000, drivers: 17000 },
  { name: 'Sep', riders: 40000, drivers: 55000 },
  { name: 'Oct', riders: 61000, drivers: 58000 },
  { name: 'Nov', riders: 32000, drivers: 36000 },
  { name: 'Dec', riders: 29000, drivers: 41000 },
];

export default function RidersDriversReportChart() {
  const [filter, setFilter] = useState<FilterKey>('Year');

  return (
    <div className="bg-white p-5 lg:p-6 rounded-lg border border-[#DFE6E5] col-span-1 lg:col-span-2">
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[20px] font-semibold text-[#000000] leading-none">Riders & Drivers Report</h3>
          <div className="flex items-center gap-6 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-[12px] h-[12px] rounded-sm bg-[#1DAFA1]" />
              <span className="text-[12px] font-medium text-[#4E616A] leading-none">Riders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[12px] h-[12px] rounded-sm bg-[#2D2D2D]" />
              <span className="text-[12px] font-medium text-[#4E616A] leading-none">Drivers</span>
            </div>
          </div>
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

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dummyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={6} barSize={10}>
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
              tickFormatter={(value) => `${value === 0 ? '0' : value / 1000}K`}
              width={55}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="riders" name="Riders" fill="#1DAFA1" radius={[5, 5, 5, 5]} />
            <Bar dataKey="drivers" name="Drivers" fill="#2D2D2D" radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
