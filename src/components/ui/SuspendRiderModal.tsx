import { useState, useEffect } from 'react';

import LoadingSpinner from './LoadingSpinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  userType?: 'rider' | 'driver';
  mode?: 'suspend' | 'reactivate';
  loading?: boolean;
}

const RIDER_REASONS = [
  'Inappropriate behavior',
  'Multiple no-shows',
  'Payment-related issues',
  'Spam or fake account',
  'Customer request',
  'Missing essential Customer details.',
  'Other',
];

const DRIVER_REASONS = [
  'Unprofessional conduct',
  'Repeated complaints',
  'Fare disputes',
  'Fraudulent activity',
  'Safety violation',
  'Failure to maintain vehicle standards',
  'Other',
];

export default function SuspendRiderModal({
  isOpen,
  onClose,
  onConfirm,
  userType = 'rider',
  mode = 'suspend',
  loading = false,
}: Props) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const isRider = userType === 'rider';
  const isSuspend = mode === 'suspend';
  const reasons = isRider ? RIDER_REASONS : DRIVER_REASONS;

  useEffect(() => {
    if (isOpen) {
      setSelectedReason('');
      setNote('');
    }
  }, [isOpen, mode, userType]);

  if (!isOpen) return null;

  // Dynamic content
  const title = isSuspend
    ? isRider
      ? 'Suspend Rider?'
      : 'Suspend Driver?'
    : isRider
      ? 'Reactivate Rider?'
      : 'Reactivate Driver?';

  const description = isSuspend
    ? isRider
      ? "Are you sure you want to suspend this Rider's account? This will prevent Rider from book ride & access Platform."
      : "Are you sure you want to suspend this Driver's account? This will prevent the driver from accepting rides & accessing the platform."
    : isRider
      ? "Are you sure you want to reactivate this Rider's account? This will allow Rider to book rides & access the Platform."
      : "Are you sure you want to reactivate this Driver's account? This will allow Driver to accept rides & access the Platform.";

  const subtitle = isRider ? 'Why are you Suspending?' : 'Reason for Suspension?';
  const labelLeft = isRider ? 'Reason' : 'Details';
  const labelRight = isRider ? '(Character Limit: 250)' : '(250 character limit)';
  const placeholder = isRider ? 'Please share your reason.' : 'Please provide additional details.';
  const confirmBtnText = isSuspend
    ? isRider
      ? 'Confirm Suspend'
      : 'Confirm Suspension'
    : 'Confirm Reactivate';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 overflow-y-auto px-4">
      <div
        className={`bg-white rounded-xl shadow-xl ${isSuspend ? 'w-[640px]' : 'w-[540px]'} h-auto p-6 lg:p-8 relative my-8 animate-in fade-in zoom-in duration-200`}
      >
        <h2 className="text-[18px] font-semibold text-[#000000] mb-2">{title}</h2>
        <p className="text-[14px] text-[#4E616A] font-medium mb-3 leading-relaxed">{description}</p>

        {isSuspend && (
          <>
            <h3 className="text-[16px] font-semibold text-[#000000] mb-3">{subtitle}</h3>

            <div className="flex flex-col gap-3.5 mb-6">
              {reasons.map((reason) => (
                <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="suspensionReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-[18px] h-[18px] border-[#4E616A] rounded-sm appearance-none checked:bg-[#20B2AA] checked:border-transparent relative checked:after:content-[''] checked:after:absolute checked:after:left-[6px] checked:after:top-[3px] checked:after:w-[5px] checked:after:h-[9px] checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45 border cursor-pointer transition-all"
                  />
                  <span className="text-[14px] font-medium text-[#000000]">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other' && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 mt-2">
                  <label className="text-[14px] font-medium text-[#4E616A]">{labelLeft}</label>
                  <span className="text-[12px] font-medium text-[#4E616A]">{labelRight}</span>
                </div>
                <textarea
                  placeholder={placeholder}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-[#DFE6E5] rounded-sm p-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#20B2AA] focus:border-[#20B2AA] resize-none h-[66px] text-[#000000] placeholder:text-[#939999]"
                  maxLength={250}
                ></textarea>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-end gap-6 mt-4">
          <button
            onClick={onClose}
            className="text-[14px] font-medium cursor-pointer text-[#000000]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const reason = selectedReason === 'Other' ? note : selectedReason;
              onConfirm(reason);
            }}
            disabled={
              loading ||
              (isSuspend && (!selectedReason || (selectedReason === 'Other' && !note.trim())))
            }
            className={`px-6 py-2.5 ${isSuspend ? 'bg-[#FF0707]' : 'bg-[#00A63E]'} cursor-pointer text-white rounded-sm text-[14px] font-medium disabled:opacity-50 flex items-center justify-center min-w-[150px]`}
          >
            {loading ? <LoadingSpinner size={20} className="text-white" /> : confirmBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}
