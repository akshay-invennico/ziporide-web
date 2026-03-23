

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SuspendRiderModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 overflow-y-auto px-4 fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] p-6 lg:p-8 relative my-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Suspend Rider?</h2>
        <p className="text-[15px] text-slate-500 mb-6 leading-relaxed">
          Are you sure you want to suspend this Rider's account? This will prevent Rider from book ride & access Platform.
        </p>

        <h3 className="text-base font-bold text-gray-900 mb-4">Why are you Suspending?</h3>
        
        <div className="flex flex-col gap-3.5 mb-6">
          {[
            "Inappropriate behavior",
            "Multiple no-shows",
            "Payment-related issues",
            "Spam or fake account",
            "Customer request",
            "Missing essential Customer details.",
            "Other"
          ].map((reason) => (
            <label key={reason} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-[18px] h-[18px] rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA] accent-[#20B2AA]"
                defaultChecked={reason === "Other"}
              />
              <span className="text-[15px] font-medium text-gray-900">{reason}</span>
            </label>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 mt-2">
            <label className="text-sm font-medium text-slate-500">Reason</label>
            <span className="text-xs font-medium text-slate-500">(Character Limit: 250)</span>
          </div>
          <textarea 
            placeholder="Please share your reason."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#20B2AA] focus:border-[#20B2AA] resize-none h-[100px] text-gray-700 placeholder:text-gray-400"
            maxLength={250}
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-6 mt-4">
          <button 
            onClick={onClose}
            className="text-[15px] font-bold text-gray-900 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            Confirm Suspend
          </button>
        </div>
      </div>
    </div>
  );
}
