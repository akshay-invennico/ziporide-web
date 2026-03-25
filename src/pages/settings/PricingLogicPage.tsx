import { useState } from 'react';

const PricingLogicPage = () => {
  const [surgeEnabled, setSurgeEnabled] = useState(true);

  // Helper for input fields
  const NumberInput = ({
    label,
    info,
    placeholder,
    suffix,
  }: {
    label: string;
    info?: string;
    placeholder: string;
    suffix?: string;
  }) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-medium text-[#4E616A]">{label}</label>
        {info && (
          <div className="flex items-center gap-1.5 text-[#4E616A]">
            <img src="/icons/settings/info.svg" alt="info" className='w-[15px] h-[15px]' />
            <span className="text-[12px] font-medium">{info}</span>
          </div>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-[#DFE6E5] rounded-lg text-[14px] font-medium text-[#000000] placeholder:text-[#939999] focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-[14px] font-medium text-[#000000]">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-1 relative flex flex-col gap-6">
      {/* Min Pricing */}
      <div className="bg-white rounded-lg h-[174px] border border-[#DFE6E5] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[32px] h-[32px] rounded-sm bg-[#F9F9F9] flex items-center justify-center">
            <img src="/icons/settings/pound.svg" alt="pound" className='w-[20px] h-[20px]' />
          </div>
          <h2 className="text-[18px] font-semibold text-[#101828]">Min Pricing</h2>
        </div>
        <div className="w-full">
          <NumberInput
            label="Minimum Fare"
            info="Minimum charge for any ride"
            placeholder="e.g. £10.00"
          />
        </div>
      </div>

      {/* Additional Charges */}
      <div className="bg-white rounded-lg h-[335px] border border-[#DFE6E5] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[32px] h-[32px] rounded-sm bg-[#F9F9F9] flex items-center justify-center">
            <img src="/icons/settings/clock.svg" alt="clock" className='w-[20px] h-[20px]' />
          </div>
          <h2 className="text-[18px] font-semibold text-[#101828]">Additional Charges</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
          <NumberInput
            label="Cancellation Fee (Rider)"
            info="Charged when rider cancels after driver accepts."
            placeholder="e.g. £10.00"
          />
          <NumberInput
            label="Airport Parking Charges"
            info="Applied for airport rides"
            placeholder="e.g. £10.00"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-6">
          <NumberInput
            label="Waiting Charge"
            info="Charged after free waiting time"
            placeholder="e.g. £10.00"
            suffix="/Min"
          />
          <NumberInput
            label="Free Waiting Time"
            info="Grace time before charges apply"
            placeholder="e.g. 03"
            suffix="Mins"
          />
          <NumberInput
            label="Max Paid Waiting Time"
            info="Paid waiting time"
            placeholder="e.g. 07"
            suffix="Mins"
          />
        </div>

        <div className="bg-[#FFF6F6] rounded-sm p-3 flex items-center gap-2">
          <img src="/icons/settings/redInfo.svg" alt="redinfo" className='w-[15px] h-[15px]' />
          <span className="text-[12px] font-medium text-[#FF0707]">
            Ride will get automatically cancelled after Maximum Paid waiting time
          </span>
        </div>
      </div>

      {/* Surge Pricing */}
      <div className="bg-white rounded-lg h-[498px] border border-[#DFE6E5] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-[32px] h-[32px] rounded-sm bg-[#F9F9F9] flex items-center justify-center">
              <img src="/icons/settings/trendup.svg" alt="trendup" className='w-[20px] h-[20px]' />
            </div>
            <h2 className="text-[18px] font-semibold text-[#101828]">Surge Pricing</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-medium text-[#4E616A]">Enable Surge Pricing</span>
            <button
              onClick={() => setSurgeEnabled(!surgeEnabled)}
              className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${surgeEnabled ? 'bg-[#14B8A6]' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${surgeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 pr-0 md:pr-3 mb-8">
          <NumberInput
            label="Default Surge Multiplier"
            info="Multiply base fare during high demand (e.g., 1.5x, 2.0x)"
            placeholder="e.g. £10.00"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rules Box */}
          <div className="border border-[#1DAFA1] h-[284px] bg-[#EEFFFD] rounded-lg p-3">
            <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Surge Pricing Rules</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A] mt-2 shrink-0" />
                <span className="text-[14px] font-medium text-[#4E616A]">Automatically applies during peak hours (7-9 AM, 5-7 PM)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A] mt-2 shrink-0" />
                <span className="text-[14px] font-medium text-[#4E616A]">Triggers when driver demand exceeds supply by 30%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#4E616A] mt-2 shrink-0" />
                <span className="text-[14px] font-medium text-[#4E616A]">Maximum multiplier capped at 3.0x for rider protection</span>
              </li>
            </ul>
          </div>

          {/* Example Fare Box */}
          <div className="border border-[#1DAFA1] h-[284px] bg-[#EEFFFD] rounded-lg p-3">
            <h3 className="text-[14px] font-semibold text-[#000000] mb-4">Example Fare Calculation</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-[#DFE6E5]">
                <span className="text-[14px] font-medium text-[#4E616A]">Base Fare</span>
                <span className="text-[14px] font-medium text-[#4E616A]">£10.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-[#DFE6E5]">
                <span className="text-[14px] font-medium text-[#4E616A]">Distance (10 miles @ £1.50/mi)</span>
                <span className="text-[14px] font-medium text-[#4E616A]">£15.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-[#DFE6E5]">
                <span className="text-[14px] font-medium text-[#4E616A]">Time (20 mins @ £0.35/min)</span>
                <span className="text-[14px] font-medium text-[#4E616A]">£07.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-[#DFE6E5]">
                <span className="text-[14px] font-medium text-[#1DAFA1]">Surge (1.5x)</span>
                <span className="text-[14px] font-medium text-[#1DAFA1]">+£13.50</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[14px] font-semibold text-[#000000]">Total Fare</span>
                <span className="text-[14px] font-semibold text-[#000000]">£45.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Buttons */}
      <div className="flex justify-end pt-2">
        <button className="px-6 py-3 bg-[#14B8A6] cursor-pointer  text-white text-[14px] font-semibold rounded-md ">
          Update Pricing Logics
        </button>
      </div>
    </div>
  );
};

export default PricingLogicPage;
