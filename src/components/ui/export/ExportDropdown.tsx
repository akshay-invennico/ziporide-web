import React from 'react';

interface ExportDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  placement?: 'top' | 'bottom';
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  isOpen,
  onClose,
  onExportPDF,
  onExportCSV,
  placement = 'bottom',
}) => {
  if (!isOpen) return null;

  const positionClasses = placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div
      className={`absolute right-0 ${positionClasses} w-[140px] bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] z-50 overflow-hidden py-3`}
    >
      <div className="px-5 pb-2 pt-1">
        <span className="text-[12px] font-medium text-[#4E616A]">Export as</span>
      </div>
      <div className="flex flex-col gap-1">
        <button
          className="w-full flex items-center gap-4 px-5 py-2 text-left group hover:bg-gray-50 transition-colors"
          onClick={() => {
            onExportPDF();
            onClose();
          }}
        >
          <img src="/icons/pdf.svg" alt="pdf" className="w-[22px] h-[22px]" />
          <span className="text-[14px] cursor-pointer font-medium text-[#000000] font-inter">
            PDF
          </span>
        </button>
        <button
          className="w-full flex items-center gap-4 px-5 py-2 text-left group hover:bg-gray-50 transition-colors"
          onClick={() => {
            onExportCSV();
            onClose();
          }}
        >
          <img src="/icons/csv.svg" alt="csv" className="w-[22px] h-[22px]" />
          <span className="text-[14px] cursor-pointer font-medium text-[#000000] font-inter">
            CSV
          </span>
        </button>
      </div>
    </div>
  );
};

export default ExportDropdown;
