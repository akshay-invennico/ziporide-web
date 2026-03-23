interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend: "up" | "down";
  trendValue: string;
  trendLabel: string;
}

export default function StatCard({ title, value, icon, trend, trendValue, trendLabel }: StatCardProps) {
  const isPositive = trend === "up";
  const trendIcon = isPositive ? "/icons/statCard/Up.svg" : "/icons/statCard/Down.svg";

  return (
    <div className="bg-white p-3 rounded-lg border border-[#DFE6E5] flex flex-col justify-between h-[120px] w-[285px] relative">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[#4A5565] font-medium text-[12px]">{title}</h3>
          <h2 className="text-[24px] font-bold text-[#101828] leading-none">{value}</h2>
        </div>
        <img src={icon} alt={title} className="w-[56px] h-[56px] rounded-lg" />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[12px] font-medium">
          <span className={isPositive ? "text-[#00A63E]" : "text-[#FF0707]"}>
            {trendValue}
          </span>
          <span className="text-[#4E616A] font-medium text-[12px]">{trendLabel}</span>
        </div>
        <img src={trendIcon} alt={trend} className="w-5 h-5" />
      </div>
    </div>
  );
}
