import { useEffect } from 'react';
import { X } from 'lucide-react';

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
        /* Backdrop */
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 p-6"
            onClick={onClose}
        >
            {/* Modal Box */}
            <div
                className="relative w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button — top right outside/overlapping image */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-10 w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <X className="w-[18px] h-[18px] text-[#101828]" />
                </button>

                {/* Document Image */}
                {documentSrc ? (
                    <img
                        src={documentSrc}
                        alt={documentName}
                        className="w-full max-h-[85vh] object-contain rounded-lg"
                    />
                ) : (
                    <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[300px] text-[#4E616A] text-[14px] font-medium">
                        No preview available.
                    </div>
                )}
            </div>
        </div>
    );
}
