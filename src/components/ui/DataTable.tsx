import React, { useState, useCallback, useMemo, useId } from 'react';

import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface Column<T> {
  key: string;
  label: string;
  type?: 'string' | 'number' | 'date'; // Added for smart sorting
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string;
  sort?: SortState;
  onSort?: (sort: SortState) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  loading?: boolean;
  emptyText?: string;
  emptyElement?: React.ReactNode;
  minHeight?: string;
  className?: string;
  rowClassName?: (row: T) => string;
}

const SortIcon: React.FC = () => {
  return (
    <div className="flex items-center">
      <img src="/icons/updown.svg" alt="sort" className="w-[18px] h-[18px]" />
    </div>
  );
};

function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  currentPage,
  totalPages,
  onPageChange,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  loading = false,
  emptyText = 'No data found',
  emptyElement,
  minHeight = '500px',
  className = '',
  rowClassName,
}: DataTableProps<T>) {
  const tableId = useId();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  const sortedData = useMemo(() => {
    if (!isSorted || !sortKey) return data;

    const column = columns.find((c) => c.key === sortKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const valA = (a as Record<string, unknown>)[sortKey];
      const valB = (b as Record<string, unknown>)[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      switch (column.type) {
        case 'number': {
          const numA = parseFloat(String(valA).replace(/[£,+-]/g, '')) || 0;
          const numB = parseFloat(String(valB).replace(/[£,+-]/g, '')) || 0;
          return numA - numB;
        }
        case 'date': {
          // Join date and time if available (Ziporide pattern)
          const recA = a as Record<string, unknown>;
          const recB = b as Record<string, unknown>;
          const dateStrA = recA.date && recA.time ? `${recA.date} ${recA.time}` : String(valA);
          const dateStrB = recB.date && recB.time ? `${recB.date} ${recB.time}` : String(valB);

          return new Date(String(dateStrA)).getTime() - new Date(String(dateStrB)).getTime();
        }
        case 'string':
        default: {
          const toString = (val: unknown) => {
            if (val && typeof val === 'object') {
              const obj = val as Record<string, unknown>;
              if (obj.pickupLocation) return String(obj.pickupLocation);
              return JSON.stringify(val);
            }
            return String(val ?? '');
          };
          return toString(valA).toLowerCase().localeCompare(toString(valB).toLowerCase());
        }
      }
    });
  }, [data, isSorted, sortKey, columns]);

  const getRowKey = useCallback(
    (row: T, index: number): string => {
      if (rowKey) return rowKey(row);
      if ('id' in row) return String(row.id);
      return String(index);
    },
    [rowKey],
  );

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      // 2nd click: Reset
      setSortKey(null);
      setIsSorted(false);
    } else {
      // 1st click: Ascending
      setSortKey(columnKey);
      setIsSorted(true);
    }
  };

  const allKeys = data.map((row, i) => getRowKey(row, i));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.includes(k));
  const someSelected = allKeys.some((k) => selectedKeys.includes(k)) && !allSelected;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedKeys.filter((k) => !allKeys.includes(k)));
    } else {
      onSelectionChange(Array.from(new Set([...selectedKeys, ...allKeys])));
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  const totalCols = columns.length + (selectable ? 1 : 0);

  return (
    <div className={className}>
      <div className="overflow-x-auto" style={{ minHeight }}>
        <table className="w-full text-left border-collapse" aria-label="Data table">
          <thead>
            <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase text-[#4E616A]">
              {selectable && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    className="accent-[#1DAFA1] w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                return (
                  <th
                    key={`${tableId}-th-${col.key}`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    className={`px-6 py-4 ${col.sortable ? 'cursor-pointer group hover:bg-gray-50 select-none' : ''} ${col.headerClassName || ''}`}
                  >
                    <div className={`flex items-center justify-between gap-2 w-full`}>
                      <span className="text-nowrap">{col.label}</span>
                      {col.sortable && <SortIcon />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#DFE6E5]">
            {loading ? (
              <tr>
                <td colSpan={totalCols} className="px-6 py-16 text-center">
                  <div className="flex justify-center items-center">
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="px-6 py-16 text-center">
                  {emptyElement || <span className="text-[14px] text-[#939999]">{emptyText}</span>}
                </td>
              </tr>
            ) : (
              sortedData.map((row: T, rowIndex: number) => {
                const key = getRowKey(row, rowIndex);
                const isSelected = selectedKeys.includes(key);
                return (
                  <tr
                    key={key}
                    className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-teal-50/30' : ''} ${rowClassName ? rowClassName(row) : ''}`}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          aria-label={`Select row ${key}`}
                          className="accent-[#1DAFA1] w-4 h-4 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={`${tableId}-${key}-${col.key}`}
                        className={`px-6 py-4 ${col.cellClassName || ''}`}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : (String(
                              (row as Record<string, unknown>)[col.key] ?? '',
                            ) as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {currentPage !== undefined && totalPages !== undefined && onPageChange && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

export default DataTable;
