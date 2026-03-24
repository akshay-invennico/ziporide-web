import React from 'react';

interface RemoveCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveCategoryModal: React.FC<RemoveCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl w-[580px] h-[270px] overflow-hidden shadow-xl">
        <div className="p-6 flex flex-col">
          <h2 className="text-[20px] font-semibold text-[#000000] mb-3">Remove Vehicle Category?</h2>

          <div className="flex flex-col gap-4 mb-6">
            <p className="text-[14px] font-medium text-[#4E616A] leading-[1.6]">
              Are you sure you want to remove this category? This action will make it unavailable for new ride bookings.
            </p>
            <p className="text-[14px] font-medium text-[#4E616A] leading-[1.6]">
              Drivers assigned to this category will no longer receive ride requests under this category. Existing and completed rides will not be affected.
            </p>
          </div>

          <div className="flex items-center justify-end gap-6">
            <button
              onClick={onClose}
              className="text-[14px] font-medium text-[#000000]  cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-sm text-[14px] font-medium text-white bg-[#FF0707]  cursor-pointer"
            >
              Remove Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveCategoryModal;
