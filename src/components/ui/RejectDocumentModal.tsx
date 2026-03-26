import { useState } from 'react';
//import { X } from "lucide-react";

const REJECTION_REASONS = [
  'Document is unclear or blurred',
  'Document is expired',
  'Incorrect document uploaded',
  'Information does not match profile details',
  'Document is cropped or partially visible',
  'Invalid or unrecognized document',
  'Tampered or edited document',
  'Other',
];

interface RejectDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName?: string;
  onConfirm?: (reasons: string[], note: string) => void;
}

const RejectDocumentModal = ({ isOpen, onClose, onConfirm }: RejectDocumentModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    );
  };

  const handleConfirm = () => {
    if (onConfirm) {
      const reasonsToSubmit = selectedReasons.includes('Other')
        ? [note || 'Other']
        : selectedReasons;
      onConfirm(reasonsToSubmit, note);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setNote('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-xl w-[600px]  overflow-hidden">
        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[18px] font-semibold text-[#000000]">Reject Document?</h2>
            <p className="text-[14px] font-medium text-[#4E616A] leading-relaxed">
              Please select a reason for rejection. This will be shared with the driver to help them
              correct and resubmit the required information.
            </p>
          </div>

          {/* Reasons */}
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold text-[#000000]">Reason for Rejections?</span>
            <div className="flex flex-col gap-2">
              {REJECTION_REASONS.map((reason) => {
                const checked = selectedReasons.includes(reason);
                return (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer group mt-3">
                    <div
                      onClick={() => toggleReason(reason)}
                      className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                        checked ? 'bg-[#1DAFA1] border-[#1DAFA1]' : 'border-[#4E616A]'
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
                      className="text-[14px] select-none text-[#000000] font-medium"
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
          {selectedReasons.includes('Other') && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-medium text-[#4E616A]">Note</span>
                <span className="text-[12px] font-medium text-[#FF0707]">
                  (Required for 'Other')
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Please provide additional details."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-[#DFE6E5] rounded-sm px-3 py-2.5 text-[14px] text-[#000000] placeholder-[#939999] resize-none focus:outline-none focus:border-[#1DAFA1] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 flex items-center justify-end gap-3 ">
          <button
            onClick={handleClose}
            className="px-6 py-2.5  cursor-pointer rounded-[500px] text-[14px] font-medium text-[#000000] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 cursor-pointer rounded-sm text-[14px] font-medium bg-[#FF0707] text-white "
          >
            Reject & Notify Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDocumentModal;
