interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendLabel: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendLabel,
}: StatCardProps) {
  const isPositive = trend === 'up';
  const trendIcon = isPositive
    ? '/icons/statCard/Up.svg'
    : '/icons/statCard/Down.svg';

  return (
    <div className="bg-white p-3 lg:p-4 xl:p-5 rounded-lg border border-[#DFE6E5] flex flex-col justify-between h-[110px] lg:h-[120px] w-full">

      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-[#4A5565] font-medium text-[11px] lg:text-[12px]">
            {title}
          </h3>
          <h2 className="text-[20px] lg:text-[22px] xl:text-[24px] font-bold text-[#101828] leading-none mt-3">
            {value}
          </h2>
        </div>

        <img
          src={icon}
          alt={title}
          className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] xl:w-[56px] xl:h-[56px] rounded-lg"
        />
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-1 text-[11px] lg:text-[12px] font-medium">
          <span className={isPositive ? 'text-[#00A63E]' : 'text-[#FF0707]'}>
            {trendValue}
          </span>
          <span className="text-[#4E616A]">
            {trendLabel}
          </span>
        </div>

        <img src={trendIcon} alt={trend} className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
    </div>
  );
}