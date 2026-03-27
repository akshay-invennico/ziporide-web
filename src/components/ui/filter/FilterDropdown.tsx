import { Star } from 'lucide-react';
import React from 'react';

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: string;
    minEarnings: number;
    maxEarnings: number;
    minTrips: number;
    maxTrips: number;
    rating: string;
  };
  setFilters: (filters: FilterDropdownProps['filters']) => void;
  userType?: 'rider' | 'driver';
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  userType = 'rider',
}) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  // Sync local filters with props when opening
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleStatusChange = (status: string) => {
    setLocalFilters({ ...localFilters, status });
  };

  const handleSpentMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localFilters.maxEarnings - 10);
    setLocalFilters({ ...localFilters, minEarnings: value });
  };

  const handleSpentMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localFilters.minEarnings + 10);
    setLocalFilters({ ...localFilters, maxEarnings: value });
  };

  const handleTripsMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localFilters.maxTrips - 1);
    setLocalFilters({ ...localFilters, minTrips: value });
  };

  const handleTripsMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localFilters.minTrips + 1);
    setLocalFilters({ ...localFilters, maxTrips: value });
  };

  const handleRatingChange = (rating: string) => {
    setLocalFilters({ ...localFilters, rating });
  };

  const clearAll = () => {
    const defaults = {
      status: 'All',
      minEarnings: 0,
      maxEarnings: 1000,
      minTrips: 0,
      maxTrips: 500,
      rating: 'All',
    };
    setLocalFilters(defaults);
    setFilters(defaults);
    onClose();
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[460px] h-[550px] bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] z-50 flex flex-col items-start overflow-hidden z">
      <div className="p-5 w-full border-b border-[#DFE6E5]">
        <h3 className="font-semibold text-[#000000] text-[18px]">Filters</h3>
      </div>

      <div className="p-5 w-full flex flex-col gap-4">
        {/* Status */}
        <div className="flex flex-col gap-3">
          <label className="text-[12px] text-[#4E616A] font-medium">Status</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.status === 'All'}
                onChange={() => handleStatusChange('All')}
                className="w-4 h-4 rounded cursor-pointer border-[#4E616A] focus:ring-[#20B2AA] accent-[#20B2AA] checked:bg-[#20B2AA] checked:border-transparent transition-all"
              />
              <span className="text-[14px] font-medium text-[#000000]">All</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.status === 'Active'}
                onChange={() => handleStatusChange('Active')}
                className="w-4 h-4 rounded cursor-pointer border-[#4E616A] focus:ring-[#20B2AA] accent-[#20B2AA] checked:bg-[#20B2AA] checked:border-transparent transition-all"
              />
              <span className="text-[14px] font-medium text-[#000000]">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.status === 'Suspended'}
                onChange={() => handleStatusChange('Suspended')}
                className="w-4 h-4 rounded cursor-pointer border-[#4E616A] focus:ring-[#20B2AA] accent-[#20B2AA] checked:bg-[#20B2AA] checked:border-transparent transition-all"
              />
              <span className="text-[14px] font-medium text-[#000000]">Suspended</span>
            </label>
          </div>
        </div>

        {/* Range Label (Spent or Earn) */}
        <div className="flex flex-col gap-3">
          <label className="text-[12px] text-[#4E616A] font-medium">
            {userType === 'driver' ? 'Earn Range' : 'Spent Range'}
          </label>
          <div className="relative h-[6px] w-[96%] mx-auto bg-gray-100 rounded-full mt-3 flex items-center">
            {/* Range Progress Bar */}
            <div
              className="absolute h-full bg-[#20B2AA] rounded-full pointer-events-none"
              style={{
                left: `${((localFilters.minEarnings - 0) / (1000 - 0)) * 100}%`,
                right: `${100 - ((localFilters.maxEarnings - 0) / (1000 - 0)) * 100}%`,
              }}
            ></div>

            {/* Range Thumbs */}
            <input
              type="range"
              min="0"
              max="1000"
              value={localFilters.minEarnings}
              onChange={handleSpentMinChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={localFilters.maxEarnings}
              onChange={handleSpentMaxChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[12px] text-[#4E616A] font-medium">
              From{' '}
              <span className="text-[#000000] text-[14px] font-semibold ml-1">
                £{localFilters.minEarnings}
              </span>
            </span>
            <span className="text-[12px] text-[#4E616A] font-medium">
              To{' '}
              <span className="text-[#000000] text-[14px] font-semibold ml-1">
                £{localFilters.maxEarnings}
              </span>
            </span>
          </div>
        </div>

        {/* Trips Range */}
        <div className="flex flex-col gap-3">
          <label className="text-[12px] text-[#4E616A] font-medium">Trips Range</label>
          <div className="relative h-[6px] w-[96%] mx-auto bg-gray-100 rounded-full mt-3 flex items-center">
            {/* Range Progress Bar */}
            <div
              className="absolute h-full bg-[#20B2AA] rounded-full pointer-events-none"
              style={{
                left: `${((localFilters.minTrips - 0) / (500 - 0)) * 100}%`,
                right: `${100 - ((localFilters.maxTrips - 0) / (500 - 0)) * 100}%`,
              }}
            ></div>

            {/* Range Thumbs */}
            <input
              type="range"
              min="0"
              max="500"
              value={localFilters.minTrips}
              onChange={handleTripsMinChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={localFilters.maxTrips}
              onChange={handleTripsMaxChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[12px] text-[#4E616A] font-medium">
              From{' '}
              <span className="text-[#000000] text-[14px] font-semibold ml-1">
                {localFilters.minTrips < 10 ? `0${localFilters.minTrips}` : localFilters.minTrips}
              </span>
            </span>
            <span className="text-[12px] text-[#4E616A] font-medium">
              To{' '}
              <span className="text-[#000000] text-[14px] font-semibold ml-1">
                {localFilters.maxTrips}
              </span>
            </span>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex flex-col gap-3">
          <label className="text-[12px] text-[#4E616A] font-medium">Ratings</label>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'All', value: 'All' },
              { label: '5 Star', value: '5_and_above' },
              { label: '4 & above', value: '4_and_above' },
              { label: '3 & above', value: '3_and_above' },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => handleRatingChange(r.value)}
                className={`flex items-center cursor-pointer gap-1.5 px-3 py-2 border rounded-md text-[12px] font-medium transition-colors ${
                  localFilters.rating === r.value
                    ? 'bg-[#1DAFA1] text-white border-[#1DAFA1]'
                    : 'bg-white text-[#000000] border-[#DFE6E5]'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    localFilters.rating === r.value
                      ? 'fill-white text-white'
                      : 'fill-[#E9A90A] text-[#E9A90A]'
                  }`}
                />
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 cursor-pointer w-full border-t border-[#DFE6E5] flex items-center justify-between">
        <button onClick={clearAll} className="text-[14px] font-medium text-[#000000]">
          Clear all
        </button>
        <button
          onClick={applyFilters}
          className="px-5 py-2.5 cursor-pointer bg-[#1DAFA1] text-white rounded-sm text-[14px] font-medium transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
