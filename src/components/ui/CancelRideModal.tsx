import { useState } from 'react';

import LoadingSpinner from './LoadingSpinner';

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
  isLoading?: boolean;
}

const CancelRideModal = ({
  isOpen,
  onClose,
  onConfirm,
  mode = 'cancel',
  isLoading = false,
}: CancelRideModalProps) => {
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
      const finalReason = selectedReason === 'Other' ? details : selectedReason;
      onConfirm(finalReason, details);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 overflow-y-auto px-4">
      <div className="bg-white rounded-xl shadow-xl w-[640px] h-auto p-6 lg:p-8 relative my-8 animate-in fade-in zoom-in duration-200">
        <h2 className="text-[18px] font-semibold text-[#000000] mb-2">{title}</h2>
        <p className="text-[14px] text-[#4E616A] font-medium mb-3 leading-relaxed">{description}</p>

        <h3 className="text-[16px] font-semibold text-[#000000] mb-3">{reasonLabel}</h3>

        <div className="flex flex-col gap-3.5 mb-6">
          {reasons.map((reason) => (
            <label key={reason} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="cancellationReason"
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
              <label className="text-[14px] font-medium text-[#4E616A]">Specify</label>
              <span className="text-[12px] font-medium text-[#4E616A]">(250 character limit)</span>
            </div>
            <textarea
              placeholder="Please provide additional details."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border border-[#DFE6E5] rounded-sm p-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#20B2AA] focus:border-[#20B2AA] resize-none h-[66px] text-[#000000] placeholder:text-[#939999]"
              maxLength={250}
            ></textarea>
          </div>
        )}

        <div className="flex items-center justify-end gap-6 mt-4">
          <button
            onClick={handleClose}
            className="text-[14px] font-medium cursor-pointer text-[#000000]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              !selectedReason || (selectedReason === 'Other' && !details.trim()) || isLoading
            }
            className="px-6 py-2.5 bg-[#FF0707] cursor-pointer text-white rounded-sm text-[14px] font-medium "
          >
            {isLoading ? <LoadingSpinner size={20} className="text-white" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRideModal;
