import { useState } from 'react';

const CANCELLATION_REASONS = [
  'Rider requested cancellation via support',
  'Driver requested cancellation via support',
  'No driver available / excessive delay',
  'Incorrect ride assignment',
  'Duplicate booking detected',
  'Suspected fraudulent activity',
  'Safety concern reported',
  'Technical or system issue',
  'Other',
];

const FORCE_END_REASONS = [
  'Emergency / SOS triggered',
  'Rider safety concern',
  'Driver safety concern',
  'Ride stuck due due to technical issue',
  'Driver not following route / suspicious activity',
  'Rider requested immediate termination',
  'Dispute between rider and driver',
  'Fraudulent trip detected',
  'Other',
];

interface CancelRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (reason: string, details?: string) => void;
  mode?: 'cancel' | 'force-end';
}

const CancelRideModal = ({ isOpen, onClose, onConfirm, mode = 'cancel' }: CancelRideModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const isForceEnd = mode === 'force-end';
  const reasons = isForceEnd ? FORCE_END_REASONS : CANCELLATION_REASONS;
  const title = isForceEnd ? 'Force End Ride?' : 'Cancel Ride?';
  const description = isForceEnd
    ? 'You are about to manually end an ongoing ride. This action will immediately stop the trip and calculate the fare based on the distance covered so far. This action is irreversible and should only be used in exceptional situations.'
    : 'You are about to cancel this ride before it begins. This action will notify both the rider and driver and may impact their experience. This action cannot be undone. Please select an appropriate reason before proceeding.';
  const reasonLabel = isForceEnd ? 'Reason for Force End?' : 'Reason for Cancellation?';
  const confirmLabel = isForceEnd ? 'Force End Ride' : 'Confirm Cancellation';

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedReason, selectedReason === 'Other' ? details : undefined);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[500px] overflow-hidden shadow-xl">
        {/* Body */}
        <div className="p-8 flex flex-col gap-6">
          {/* Title & Description */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[20px] font-bold text-[#101828]">{title}</h2>
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-medium text-[#4E616A] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Reasons Section */}
          <div className="flex flex-col gap-4">
            <span className="text-[16px] font-bold text-[#101828]">{reasonLabel}</span>
            <div className="flex flex-col gap-3.5">
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setSelectedReason(reason)}
                      className={`w-[20px] h-[20px] rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#1DAFA1] border-[#1DAFA1]'
                          : 'border-[#98A2B3] group-hover:border-[#1DAFA1]'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="12"
                          height="10"
                          viewBox="0 0 12 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 5L4.5 8.5L11 1.5"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-[14px] select-none font-medium text-[#101828]`}
                      onClick={() => setSelectedReason(reason)}
                    >
                      {reason}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Details for 'Other' */}
          {selectedReason === 'Other' && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-semibold text-[#4E616A]">Specify</span>
                <span className="text-[12px] font-medium text-[#4E616A]">(Optional)</span>
              </div>
              <textarea
                rows={3}
                placeholder="Please provide additional details."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full border border-[#DFE6E5] rounded-lg p-3 text-[14px] text-[#101828] placeholder-[#98A2B3] resize-none focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 flex items-center justify-end gap-6">
          <button
            onClick={handleClose}
            className="text-[15px] font-bold text-[#101828] hover:text-[#4E616A] transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason}
            className={`px-8 py-3 rounded-lg text-[15px] font-bold text-white transition-all shadow-sm ${
              selectedReason
                ? 'bg-[#FF0707] hover:bg-[#E60606] cursor-pointer'
                : 'bg-[#FF0707]/50 cursor-not-allowed'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRideModal;
