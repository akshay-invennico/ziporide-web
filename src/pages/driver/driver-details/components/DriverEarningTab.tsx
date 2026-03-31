import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { useDriverEarnings } from '@/hooks/useDriver';

// ── Custom Tooltip ────────────────────────────────────────────────────────────

interface TooltipPayload {
  value: number;
  payload: { rides: number };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#DFE6E5] rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] px-4 py-3 min-w-[130px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-[22px] h-[22px] rounded-md  flex items-center justify-center shrink-0">
            <img src="/icons/driver/driverIncome.svg" />
          </div>
          <span className="text-[15px] font-bold text-[#101828]">
            £{payload[0].value.toLocaleString()}
          </span>
        </div>
        <p className="text-[11px] text-[#4E616A] font-medium">
          From {payload[0].payload.rides} Rides
        </p>
        {label && <p className="text-[10px] text-[#4E616A] mt-0.5">{label}</p>}
      </div>
    );
  }
  return null;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex-1 flex items-center justify-between bg-white border border-[#DFE6E5] rounded-xl px-4 py-4 min-w-[150px]">
      <div>
        <p className="text-[12px] text-[#4E616A] font-medium mb-1">{label}</p>
        <p className="text-[24px] font-bold text-[#101828]">{value}</p>
      </div>
      <div className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center shrink-0`}>
        <img src={icon} alt={label} className="w-[48px] h-[48px]" />
      </div>
    </div>
  );
}

type Period = 'year' | 'month' | 'week';

export default function DriverEarningTab() {
  const { id } = useParams<{ id: string }>();
  const [period, setPeriod] = useState<Period>('year');
  const { data, loading, error } = useDriverEarnings(id, period);

  const formatY = (v: number) => {
    if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`;
    return `£${v}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  const chartData = data?.chartData || [];

  return (
    <div className="p-1 flex flex-col gap-5">
      {/* Stat Cards */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <StatCard
          label="Total Trips"
          value={String(data?.totalTrips || 0)}
          icon="/icons/driver/card1.svg"
        />
        <StatCard
          label="Total Earnings"
          value={`£${(data?.totalEarnings || 0).toFixed(2)}`}
          icon="/icons/driver/card2.svg"
        />
        <StatCard
          label="Average Trip Value"
          value={`£${(data?.avgTripValue || 0).toFixed(2)}`}
          icon="/icons/driver/card3.svg"
        />
        <StatCard
          label="Acceptance Rate"
          value={`${(data?.acceptanceRate || 0).toFixed(2)}%`}
          icon="/icons/driver/card4.svg"
        />
      </div>

      {/* Chart Section */}
      <div className="border border-[#DFE6E5] rounded-xl p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="text-[20px] font-semibold text-[#101828]">Earning Report</h3>
            <p className="text-[12px] text-[#4E616A] font-medium mt-0.5">
              Track Driver's Earning amounts
            </p>
          </div>

          {/* Period Toggle */}
          <div className="flex items-center gap-3 rounded-lg overflow-hidden">
            {(['year', 'month', 'week'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors capitalize ${period === p
                    ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                    : 'border-[#DFE6E5] text-[#4E616A] '
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Area Chart */}
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1DAFA1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1DAFA1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#4E616A', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fill: '#4E616A', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#1DAFA1', strokeWidth: 1, strokeDasharray: '4 2' }}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#1DAFA1"
              strokeWidth={2.5}
              fill="url(#earningsGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#1DAFA1', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
