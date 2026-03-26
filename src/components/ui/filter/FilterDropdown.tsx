import { Star } from 'lucide-react';
import React, { useState } from 'react';

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  userType?: 'rider' | 'driver';
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  filterStatus,
  setFilterStatus,
  userType = 'rider',
}) => {
  // Range States
  const [spentMin, setSpentMin] = useState(110);
  const [spentMax, setSpentMax] = useState(880);
  const [tripsMin, setTripsMin] = useState(1);
  const [tripsMax, setTripsMax] = useState(400);

  if (!isOpen) return null;

  const handleSpentMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), spentMax - 10);
    setSpentMin(value);
  };

  const handleSpentMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), spentMin + 10);
    setSpentMax(value);
  };

  const handleTripsMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), tripsMax - 1);
    setTripsMin(value);
  };

  const handleTripsMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), tripsMin + 1);
    setTripsMax(value);
  };

  const clearAll = () => {
    setFilterStatus('All');
    setSpentMin(110);
    setSpentMax(880);
    setTripsMin(1);
    setTripsMax(400);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[460px] h-[550px] bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] z-50 flex flex-col items-start overflow-hidden">
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
                checked={filterStatus === 'All'}
                onChange={() => setFilterStatus('All')}
                className="w-4 h-4 rounded cursor-pointer border-[#4E616A] focus:ring-[#20B2AA] accent-[#20B2AA] checked:bg-[#20B2AA] checked:border-transparent transition-all"
              />
              <span className="text-[14px] font-medium text-[#000000]">All</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterStatus === 'Active'}
                onChange={() => setFilterStatus('Active')}
                className="w-4 h-4 rounded cursor-pointer border-[#4E616A] focus:ring-[#20B2AA] accent-[#20B2AA] checked:bg-[#20B2AA] checked:border-transparent transition-all"
              />
              <span className="text-[14px] font-medium text-[#000000]">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterStatus === 'Suspended'}
                onChange={() => setFilterStatus('Suspended')}
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
                left: `${((spentMin - 0) / (1000 - 0)) * 100}%`,
                right: `${100 - ((spentMax - 0) / (1000 - 0)) * 100}%`,
              }}
            ></div>

            {/* Range Thumbs */}
            <input
              type="range"
              min="0"
              max="1000"
              value={spentMin}
              onChange={handleSpentMinChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={spentMax}
              onChange={handleSpentMaxChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[12px] text-[#4E616A] font-medium">
              From{' '}
              <span className="text-[#000000] text-[14px] font-semibold ml-1">£{spentMin}</span>
            </span>
            <span className="text-[12px] text-[#4E616A] font-medium">
              To <span className="text-[#000000] text-[14px] font-semibold ml-1">£{spentMax}</span>
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
                left: `${((tripsMin - 0) / (500 - 0)) * 100}%`,
                right: `${100 - ((tripsMax - 0) / (500 - 0)) * 100}%`,
              }}
            ></div>

            {/* Range Thumbs */}
            <input
              type="range"
              min="0"
              max="500"
              value={tripsMin}
              onChange={handleTripsMinChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
            <input
              type="range"
              min="0"
              max="500"
              value={tripsMax}
              onChange={handleTripsMaxChange}
              className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#20B2AA] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[12px] text-[#4E616A] font-medium">
              From{' '}
              <span className="text-[#000000] text-[14px] font-semibold ml-1">
                {tripsMin < 10 ? `0${tripsMin}` : tripsMin}
              </span>
            </span>
            <span className="text-[12px] text-[#4E616A] font-medium">
              To <span className="text-[#000000] text-[14px] font-semibold ml-1">{tripsMax}</span>
            </span>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex flex-col gap-3">
          <label className="text-[12px] text-[#4E616A] font-medium">Ratings</label>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-2 border border-[#DFE6E5] rounded-md text-[12px] font-medium text-[#000000]  bg-white">
              <Star className="w-4 h-4 fill-[#E9A90A] text-[#E9A90A]" />
              All
            </button>
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-2 border border-[#DFE6E5] rounded-md text-sm font-medium text-[#000000]  bg-white">
              <Star className="w-4 h-4 fill-[#E9A90A] text-[#E9A90A]" />5 Star
            </button>
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-2 border border-[#DFE6E5] rounded-md text-sm font-medium text-[#000000]  bg-white">
              <Star className="w-4 h-4 fill-[#E9A90A] text-[#E9A90A]" />4 & above
            </button>
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-2 border border-[#DFE6E5] rounded-md text-sm font-medium text-[#000000]  bg-white">
              <Star className="w-4 h-4 fill-[#E9A90A] text-[#E9A90A]" />3 & above
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 cursor-pointer w-full border-t border-[#DFE6E5] flex items-center justify-between">
        <button onClick={clearAll} className="text-[14px] font-medium text-[#000000]">
          Clear all
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 cursor-pointer bg-[#1DAFA1] text-white rounded-sm text-[14px] font-medium transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
