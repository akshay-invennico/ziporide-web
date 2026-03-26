import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentSrc?: string;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  documentName,
  documentSrc,
}: DocumentViewerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#1A1A1A] p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 text-white hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-none p-2"
        aria-label="Close"
      >
        <X className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <div className="relative w-[1000px] h-[800px] max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {documentSrc ? (
          <img
            src={documentSrc}
            alt={documentName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="bg-[#2A2A2A] w-full h-full rounded-lg flex items-center justify-center text-[#A0AEC0] text-[14px] font-medium border border-[#333]">
            No preview available.
          </div>
        )}
      </div>
    </div>
  );
}
