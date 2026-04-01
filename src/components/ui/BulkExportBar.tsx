import React, { useState, useRef, useEffect } from 'react';
import ExportDropdown from './export/ExportDropdown';

interface BulkExportBarProps {
  count: number;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

const BulkExportBar: React.FC<BulkExportBarProps> = ({ count, onExportPDF, onExportCSV }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-16 left-220 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-300  shadow-[0_0_16px_0_rgba(237,155,14,0.2)]">
      <div className="bg-[#4a4a4a] px-12 py-3 rounded-lg flex items-center shadow-[0_0_16px_0_rgba(237,155,14,0.2)]">
        <div className="relative flex items-center justify-center" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2  cursor-pointer"
          >
            <img
              src="/icons/rider/export.svg"
              alt="export"
              className="w-[22x] h-[22px] brightness-0 invert"
            />
            <span className="text-[14px] font-medium text-white">Export</span>
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
            <div className="absolute bottom-full left-35 -translate-x-1/2 mb-[20px]">
              <ExportDropdown
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onExportPDF={onExportPDF}
                onExportCSV={onExportCSV}
                placement="top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkExportBar;
