import { ChevronDown } from 'lucide-react';

const PushNotificationsPage = () => {
  return (
    <div className="flex justify-center  p-6">
      {/* Send Custom Notification Card */}
      <div className="w-[641px] h-[588px] border border-[#DFE6E5] bg-white rounded-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 w-[40px] h-[40px] bg-[#F9F9F9] rounded-sm">
            <img src="/icons/settings/send.svg" alt="send" className="w-[22px] h-[22px]" />
          </div>
          <h2 className="text-[20px] font-inter font-semibold text-[#101828]">
            Send Custom Notification
          </h2>
        </div>

        <div className="space-y-8 font-inter">
          {/* Target Audience */}
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2">
              Target Audience
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-white cursor-pointer border border-[#DFE6E5] rounded-md px-4 py-3 pr-10 text-[#0000000] text-[14px] font-medium outline-none focus:border-[#1DAFA1] transition-colors">
                <option value="">Select Audience</option>
                <option value="riders">Riders</option>
                <option value="drivers">Drivers</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-[#000000]" />
              </div>
            </div>
          </div>

          {/* Notification Title */}
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2">
              Notification Title
            </label>
            <input
              type="text"
              placeholder="Enter notification title"
              className="w-full bg-white border  border-[#DFE6E5] rounded-md px-4 py-3 text-[#000000] text-[14px] font-medium outline-none focus:border-[#1DAFA1] transition-colors placeholder:text-[#0A0A0A80]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2">Message</label>
            <textarea
              placeholder="Enter notification message"
              rows={5}
              className="w-full bg-white border border-[#DFE6E5] rounded-md px-4 py-3 text-[#000000] text-[14px] font-medium outline-none focus:border-[#1DAFA1] transition-colors placeholder:text-[#0A0A0A80] resize-none"
            />
          </div>

          {/* Send Button */}
          <button className="w-full bg-[#1DAFA1] cursor-pointer font-inter  text-white font-semibold py-4 rounded-md text-[14px] transition-colors flex items-center justify-center gap-2">
            Send Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationsPage;
