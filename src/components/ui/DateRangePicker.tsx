import { format, parse, isValid } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { DayPicker, type DateRange as DayPickerRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const ISO = 'yyyy-MM-dd';

const toDate = (s: string): Date | undefined => {
  if (!s) return undefined;
  const d = parse(s, ISO, new Date());
  return isValid(d) ? d : undefined;
};

const toISO = (d?: Date) => (d ? format(d, ISO) : '');

const formatPart = (d: string) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y.slice(2)}`;
};

const buildLabel = (range: DateRange) => {
  if (!range.startDate && !range.endDate) return 'Date Range';
  if (range.startDate && range.endDate)
    return `${formatPart(range.startDate)} - ${formatPart(range.endDate)}`;
  if (range.startDate) return `From ${formatPart(range.startDate)}`;
  return `Until ${formatPart(range.endDate)}`;
};

const toDraft = (v: DateRange): DayPickerRange | undefined => {
  const from = toDate(v.startDate);
  const to = toDate(v.endDate);
  if (!from && !to) return undefined;
  return { from, to };
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DayPickerRange | undefined>(() => toDraft(value));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setDraft(toDraft(value));
  }, [isOpen, value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const hasValue = !!(value.startDate || value.endDate);
  const hasDraft = !!(draft?.from || draft?.to);

  const apply = () => {
    onChange({
      startDate: toISO(draft?.from),
      endDate: toISO(draft?.to),
    });
    setIsOpen(false);
  };

  const clearAll = () => {
    setDraft(undefined);
    onChange({ startDate: '', endDate: '' });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`flex items-center cursor-pointer gap-2 px-4 py-2 border rounded-sm text-[14px] font-medium w-full sm:w-auto justify-center transition-colors ${
          hasValue
            ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
            : 'border-[#DFE6E5] text-[#4E616A]'
        }`}
        title={hasValue ? buildLabel(value) : 'Filter by date range'}
      >
        <svg
          className="w-[18px] h-[18px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="whitespace-nowrap">{buildLabel(value)}</span>
        {hasValue && (
          <span
            role="button"
            aria-label="Clear date range"
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            className="ml-1 leading-none text-[18px] cursor-pointer hover:opacity-70"
          >
            ×
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[620px] bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] z-50 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-[#939999] font-medium">
                From
              </span>
              <span className="text-[14px] text-[#1F2937] font-medium">
                {draft?.from ? format(draft.from, 'dd MMM yyyy') : '—'}
              </span>
            </div>
            <div className="w-px h-8 bg-[#DFE6E5]" />
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-[#939999] font-medium">
                To
              </span>
              <span className="text-[14px] text-[#1F2937] font-medium">
                {draft?.to ? format(draft.to, 'dd MMM yyyy') : '—'}
              </span>
            </div>
          </div>

          <div className="rdp-ziporide">
            <DayPicker
              mode="range"
              selected={draft}
              onSelect={setDraft}
              numberOfMonths={2}
              showOutsideDays
              captionLayout="label"
              style={
                {
                  '--rdp-accent-color': '#1DAFA1',
                  '--rdp-accent-background-color': '#EEFFFD',
                  '--rdp-today-color': '#1DAFA1',
                  '--rdp-day-height': '36px',
                  '--rdp-day-width': '36px',
                  '--rdp-day_button-height': '32px',
                  '--rdp-day_button-width': '32px',
                  '--rdp-day_button-border-radius': '8px',
                  '--rdp-selected-border': '0',
                  '--rdp-range_middle-background-color': '#EEFFFD',
                  '--rdp-range_middle-color': '#1DAFA1',
                  '--rdp-range_start-color': '#FFFFFF',
                  '--rdp-range_end-color': '#FFFFFF',
                } as React.CSSProperties
              }
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#DFE6E5]">
            <button
              type="button"
              onClick={clearAll}
              className="text-[14px] font-medium text-[#000000] cursor-pointer hover:opacity-70"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!hasDraft}
              className={`px-4 py-2 rounded-sm text-[14px] font-medium transition-colors ${
                !hasDraft
                  ? 'bg-[#DFE6E5] text-[#939999] cursor-not-allowed'
                  : 'bg-[#1DAFA1] text-white cursor-pointer hover:bg-[#178f84]'
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
