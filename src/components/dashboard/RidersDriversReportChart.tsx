import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const [filter, setFilter] = useState('Year');

  return (
    <div className="bg-white p-5 lg:p-6 rounded-lg border border-[#DFE6E5]  col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold text-[#000000]">Riders & Drivers Report</h3>
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

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dummyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2} barSize={8}>
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
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ top: -45, left: -20, fontSize: '12px' }}
            />
            <Bar dataKey="riders" name="Riders" fill="#1CC8B1" radius={[4, 4, 4, 4]} />
            <Bar dataKey="drivers" name="Drivers" fill="#2A2E33" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
