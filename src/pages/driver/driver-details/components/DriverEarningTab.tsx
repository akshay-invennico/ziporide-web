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

// ── Data ─────────────────────────────────────────────────────────────────────

const yearlyData = [
  { month: 'Jan', earnings: 18000, rides: 12 },
  { month: 'Feb', earnings: 22000, rides: 14 },
  { month: 'Mar', earnings: 58000, rides: 38 },
  { month: 'Apr', earnings: 52000, rides: 34 },
  { month: 'May', earnings: 45000, rides: 30 },
  { month: 'Jun', earnings: 40000, rides: 26 },
  { month: 'Jul', earnings: 62000, rides: 41 },
  { month: 'Aug', earnings: 55000, rides: 36 },
  { month: 'Sep', earnings: 61000, rides: 40 },
  { month: 'Oct', earnings: 48000, rides: 32 },
  { month: 'Nov', earnings: 44000, rides: 29 },
  { month: 'Dec', earnings: 28000, rides: 18 },
];

const monthlyData = [
  { month: 'Wk 1', earnings: 820, rides: 5 },
  { month: 'Wk 2', earnings: 550, rides: 20 },
  { month: 'Wk 3', earnings: 940, rides: 6 },
  { month: 'Wk 4', earnings: 710, rides: 4 },
];

const weeklyData = [
  { month: 'Mon', earnings: 120, rides: 3 },
  { month: 'Tue', earnings: 200, rides: 5 },
  { month: 'Wed', earnings: 85, rides: 2 },
  { month: 'Thu', earnings: 310, rides: 8 },
  { month: 'Fri', earnings: 260, rides: 6 },
  { month: 'Sat', earnings: 450, rides: 11 },
  { month: 'Sun', earnings: 180, rides: 4 },
];

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

// ── Main Component ────────────────────────────────────────────────────────────

type Period = 'Year' | 'Month' | 'Week';

export default function DriverEarningTab() {
  const [period, setPeriod] = useState<Period>('Year');

  const chartData = period === 'Year' ? yearlyData : period === 'Month' ? monthlyData : weeklyData;

  const formatY = (v: number) => {
    if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`;
    return `£${v}`;
  };

  return (
    <div className="p-1 flex flex-col gap-5">
      {/* Stat Cards */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <StatCard label="Total Trips" value="145" icon="/icons/driver/card1.svg" />
        <StatCard label="Total Earnings" value="£121550.00" icon="/icons/driver/card2.svg" />
        <StatCard label="Average Trip Value" value="£16.64" icon="/icons/driver/card3.svg" />
        <StatCard label="Acceptance Rate" value="96.08%" icon="/icons/driver/card4.svg" />
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
            {(['Year', 'Month', 'Week'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-1.5 text-[12px] cursor-pointer font-medium rounded-sm border transition-colors ${period === p
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
              tick={{ fill: '#4E616A', fontSize: 11, fontWeight: 500 }}
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
