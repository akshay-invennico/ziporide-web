import { X, ZoomIn, Download } from 'lucide-react';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

const DocumentViewModal = ({ isOpen, onClose, documentTitle }: DocumentViewModalProps) => {
  if (!isOpen) return null;

  // Use a generic sample image placeholder for documents
  const documentPlaceholderUrl =
    'https://images.unsplash.com/photo-1586281380349-632b5f63d76e?q=80&w=1470&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{documentTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-6 sm:p-10 relative overflow-auto">
          <div className="relative group w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 min-h-[400px]">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img
                src={documentPlaceholderUrl}
                alt={documentTitle}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Overlay tools (Zoom) */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button className="bg-white/90 backdrop-blur shadow p-2 rounded-lg text-gray-700 hover:text-black">
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
          <div className="text-sm font-medium text-gray-500">Document 1 of 1</div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#1DAFA1] text-white hover:bg-[#14B8A6] transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;
