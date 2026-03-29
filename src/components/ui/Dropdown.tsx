import { ChevronDown, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback, useId } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  name?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error,
  loading = false,
  name,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const item = listboxRef.current.children[highlightedIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const selectOption = useCallback(
    (opt: DropdownOption) => {
      if (opt.disabled) return;
      onChange?.(opt.value);
      setIsOpen(false);
    },
    [onChange],
  );

  const toggle = () => {
    if (disabled || loading) return;
    setIsOpen((prev) => {
      if (!prev) {
        const idx = options.findIndex((o) => o.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
      return !prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!isOpen) {
          toggle();
        } else if (highlightedIndex >= 0 && !options[highlightedIndex]?.disabled) {
          selectOption(options[highlightedIndex]);
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const idx = options.findIndex((o) => o.value === value);
          setHighlightedIndex(idx >= 0 ? idx : 0);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next]?.disabled) next++;
            return next < options.length ? next : prev;
          });
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next]?.disabled) next--;
            return next >= 0 ? next : prev;
          });
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        break;
      }
    }
  };

  const borderClass = error
    ? 'border-red-400 focus-within:border-red-500'
    : isOpen
      ? 'border-[#1DAFA1] shadow-[0_0_16px_0_rgba(237,155,14,0.2)]'
      : 'border-[#DFE6E5] hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)]';

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {name && <input type="hidden" name={name} value={value || ''} />}
      {label && (
        <label id={labelId} className="block text-[14px] font-medium text-[#4E616A] mb-2">
          {label}
        </label>
      )}

      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between w-full border rounded-md p-3 text-[14px] font-medium bg-white transition-all focus:outline-none ${borderClass} ${disabledClass}`}
      >
        <span className={selectedOption ? 'text-[#000000]' : 'text-[#939999]'}>
          {loading ? 'Loading...' : selectedOption ? selectedOption.label : placeholder}
        </span>

        {loading ? (
          <Loader2 className="w-[18px] h-[18px] text-[#4E616A] animate-spin shrink-0" />
        ) : (
          <ChevronDown
            className={`w-[18px] h-[18px] text-[#4E616A] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>

      {isOpen && !loading && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className="absolute z-50 mt-1 w-full bg-white border border-[#DFE6E5] rounded-md shadow-[0_0_16px_0_rgba(237,155,14,0.2)] max-h-[240px] overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {options.length === 0 ? (
            <li className="px-4 py-3 text-[14px] text-[#939999] text-center">
              No options available
            </li>
          ) : (
            options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-3 text-[14px] font-medium transition-colors ${
                    option.disabled
                      ? 'text-[#939999] cursor-not-allowed'
                      : isHighlighted
                        ? 'bg-[#EEFFFD] text-[#000000] cursor-pointer'
                        : isSelected
                          ? 'text-[#1DAFA1] cursor-pointer'
                          : 'text-[#000000] cursor-pointer hover:bg-[#F9F9F9]'
                  }`}
                >
                  {option.label}
                </li>
              );
            })
          )}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Dropdown;
