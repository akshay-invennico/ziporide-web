import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useRiderDriverReport } from '@/hooks/useDashboard';

type FilterKey = 'Month' | 'Daily';

export default function RidersDriversReportChart() {
  const [filter, setFilter] = useState<FilterKey>('Month');
  const { data: chartData, loading, error } = useRiderDriverReport(filter);

  return (
    <div className="bg-white p-5 lg:p-6 rounded-lg border border-[#DFE6E5] col-span-1 lg:col-span-2 transition-all overflow-hidden">
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[20px] font-semibold text-[#000000] leading-none">
            Riders & Drivers Report
          </h3>
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
          {(['Month', 'Daily'] as FilterKey[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              disabled={loading}
              className={`px-5 py-1.5 text-[13px] cursor-pointer font-medium rounded-sm border transition-colors ${
                filter === item
                  ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                  : 'border-[#DFE6E5] text-[#4E616A] bg-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="w-8 h-8 border-4 border-[#1DAFA1] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            <p className="text-sm">Failed to load report data</p>
          </div>
        ) : chartData.length === 0 && !loading ? (
          <div className="flex h-full items-center justify-center text-[#4E616A]">
            <p className="text-sm">No data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barGap={6}
              barSize={10}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey={(item) => item.month || item.day || 'N/A'}
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
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="riders" name="Riders" fill="#1DAFA1" radius={[5, 5, 5, 5]} />
              <Bar dataKey="drivers" name="Drivers" fill="#2D2D2D" radius={[5, 5, 5, 5]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
