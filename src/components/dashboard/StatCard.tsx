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
    <div className="bg-white p-3 rounded-lg border border-[#DFE6E5]  flex flex-col h-[120px] w-[300px]  relative ">
      <div className="flex justify-between items-start ">
        <h3 className="text-[#4A5565] font-medium text-[12px]">{title}</h3>
        <img src={icon} alt={title} className="w-[58px] h-[58px] rounded-lg" />
      </div>

      <div >
        <h2 className="text-[24px] font-bold text-[#101828]  leading-none">{value}</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[12px] font-medium">
            <span className={isPositive ? "text-[#00A63E]" : "text-[#FF0707]"}>
              {trendValue}
            </span>
            <span className="text-[#4E616A] font-medium text-[12px]">{trendLabel}</span>
          </div>
          <img src={trendIcon} alt={trend} className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
