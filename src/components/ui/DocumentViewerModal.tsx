import { Download, ExternalLink, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentSrc?: string;
}

type DocumentKind = 'image' | 'pdf' | 'unknown';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif', 'heic'];

const detectKind = (src?: string): DocumentKind => {
  if (!src) return 'unknown';

  if (src.startsWith('data:application/pdf')) return 'pdf';
  if (src.startsWith('data:image/')) return 'image';

  let pathname = src;
  try {
    pathname = new URL(src, window.location.origin).pathname;
  } catch {
    // ignore — use raw src
  }

  const extension = pathname.split('.').pop()?.toLowerCase();
  if (!extension) return 'unknown';
  if (extension === 'pdf') return 'pdf';
  if (IMAGE_EXTENSIONS.includes(extension)) return 'image';
  return 'unknown';
};

export default function DocumentViewerModal({
  isOpen,
  onClose,
  documentName,
  documentSrc,
}: DocumentViewerModalProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setHasError(false);
  }, [isOpen, documentSrc]);

  const kind = useMemo(() => detectKind(documentSrc), [documentSrc]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (!documentSrc) {
      return (
        <div className="bg-[#2A2A2A] w-full h-full rounded-lg flex items-center justify-center text-[#A0AEC0] text-[14px] font-medium border border-[#333]">
          No preview available.
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="bg-[#2A2A2A] w-full h-full rounded-lg flex flex-col items-center justify-center gap-3 text-[#A0AEC0] text-[14px] font-medium border border-[#333] p-6">
          <span>Unable to preview this document.</span>
          <a
            href={documentSrc}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1DAFA1] text-white hover:bg-[#179a8e] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        </div>
      );
    }

    if (kind === 'image') {
      return (
        <img
          src={documentSrc}
          alt={documentName}
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        />
      );
    }

    if (kind === 'pdf') {
      return (
        <object
          data={documentSrc}
          type="application/pdf"
          className="w-full h-full bg-white rounded-lg"
          aria-label={documentName}
        >
          <iframe
            src={documentSrc}
            title={documentName}
            className="w-full h-full bg-white rounded-lg border-0"
            onError={() => setHasError(true)}
          />
        </object>
      );
    }

    return (
      <div className="bg-[#2A2A2A] w-full h-full rounded-lg flex flex-col items-center justify-center gap-3 text-[#A0AEC0] text-[14px] font-medium border border-[#333] p-6">
        <span>Preview is not supported for this file type.</span>
        <a
          href={documentSrc}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1DAFA1] text-white hover:bg-[#179a8e] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in new tab
        </a>
      </div>
    );
  };

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

      <div
        className="relative w-[1000px] h-[800px] max-w-full max-h-full flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-white px-1">
          <span className="text-[14px] sm:text-[16px] font-medium truncate pr-4">
            {documentName}
          </span>
          {documentSrc && (
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={documentSrc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
              <a
                href={documentSrc}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 text-white text-[12px] font-medium hover:bg-white/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">{renderContent()}</div>
      </div>
    </div>
  );
}
