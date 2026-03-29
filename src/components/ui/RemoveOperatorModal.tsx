import { X } from 'lucide-react';
import React from 'react';

interface RemoveOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
  isRemoving?: boolean;
}

const RemoveOperatorModal: React.FC<RemoveOperatorModalProps> = ({
  isOpen,
  onClose,
  onRemove,
  isRemoving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl  border border-[#DFE6E5] w-[580px] h-[248px] overflow-hidden">
        <div className="p-6 space-y-4 text-center sm:text-left">
          <div className="flex justify-between items-start">
            <h2 className="text-[20px] font-semibold text-[#000000] font-inter">
              Remove Operator?
            </h2>
            <button
              onClick={onClose}
              disabled={isRemoving}
              className="p-1 cursor-pointer text-[#4E616A]"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-[14px] font-medium text-[#4E616A] font-inter leading-relaxed">
              Are you sure you want to remove this operator? They will lose access to the admin
              panel immediately.
            </p>
            <p className="text-[14px] font-medium text-[#4E616A] font-inter">
              This action cannot be undone. All active sessions will be terminated
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={isRemoving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md text-[14px] font-medium text-[#000000] bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onRemove}
              disabled={isRemoving}
              className="w-full sm:w-auto px-6 py-3 rounded-md text-[14px] font-medium text-white bg-[#FF0707] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRemoving ? 'Removing...' : 'Remove Operator'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveOperatorModal;
