import { useState } from "react";
//import { X } from "lucide-react";

const REJECTION_REASONS = [
  "Document is unclear or blurred",
  "Document is expired",
  "Incorrect document uploaded",
  "Information does not match profile details",
  "Document is cropped or partially visible",
  "Invalid or unrecognized document",
  "Tampered or edited document",
];

interface RejectDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName?: string;
  onConfirm?: (reasons: string[], note: string) => void;
}

const RejectDocumentModal = ({
  isOpen,
  onClose,
  documentName,
  onConfirm,
}: RejectDocumentModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(selectedReasons, note);
    handleClose();
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setNote("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[20px] font-bold text-gray-900">
              Reject Document?
              {documentName && (
                <span className="text-[16px] font-semibold text-gray-500 ml-2">
                  — {documentName}
                </span>
              )}
            </h2>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Please select a reason for rejection. This will be shared with the
              driver to help them correct and resubmit the required information.
            </p>
          </div>

          {/* Reasons */}
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-bold text-gray-800">
              Reason for Rejections?
            </span>
            <div className="flex flex-col gap-2 mt-2">
              {REJECTION_REASONS.map((reason) => {
                const checked = selectedReasons.includes(reason);
                return (
                  <label
                    key={reason}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => toggleReason(reason)}
                      className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${checked
                          ? "bg-[#1DAFA1] border-[#1DAFA1]"
                          : "border-gray-300 group-hover:border-[#1DAFA1]"
                        }`}
                    >
                      {checked && (
                        <svg
                          width="11"
                          height="9"
                          viewBox="0 0 11 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L4 7L10 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-[14px] select-none ${checked ? "text-gray-900 font-medium" : "text-gray-700"
                        }`}
                      onClick={() => toggleReason(reason)}
                    >
                      {reason}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-gray-600">Note</span>
              <span className="text-[13px] text-gray-400">(Optional)</span>
            </div>
            <textarea
              rows={3}
              placeholder="Please provide additional details."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-200 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#1DAFA1] focus:border-[#1DAFA1] transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-lg text-[14px] font-bold bg-[#EF4444] text-white hover:bg-red-600 transition-colors"
          >
            Reject &amp; Notify Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDocumentModal;
