import React, { useState, useCallback, useId } from 'react';

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

const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => {
  if (!direction) {
    return (
      <img src="/icons/rider/updown.svg" alt="sort" className="w-[18px] h-[18px] opacity-60" />
    );
  }
  return (
    <svg
      className="w-[18px] h-[18px] text-[#1DAFA1]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === 'asc' ? (
        <polyline points="18 15 12 9 6 15" />
      ) : (
        <polyline points="6 9 12 15 18 9" />
      )}
    </svg>
  );
};

function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  sort,
  onSort,
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
  const [internalSort, setInternalSort] = useState<SortState>({
    column: '',
    direction: null,
  });

  const activeSort = sort ?? internalSort;

  const getRowKey = useCallback(
    (row: T, index: number): string => {
      if (rowKey) return rowKey(row);
      if ('id' in row) return String(row.id);
      return String(index);
    },
    [rowKey],
  );

  const handleSort = (columnKey: string) => {
    let direction: SortDirection;
    if (activeSort.column === columnKey) {
      if (activeSort.direction === 'asc') direction = 'desc';
      else if (activeSort.direction === 'desc') direction = null;
      else direction = 'asc';
    } else {
      direction = 'asc';
    }
    const newSort: SortState = { column: columnKey, direction };
    if (onSort) {
      onSort(newSort);
    } else {
      setInternalSort(newSort);
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
                const isSorted = activeSort.column === col.key;
                return (
                  <th
                    key={`${tableId}-th-${col.key}`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    aria-sort={
                      isSorted && activeSort.direction
                        ? activeSort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                    className={`px-6 py-4 ${col.sortable ? 'cursor-pointer group hover:bg-gray-50 select-none' : ''} ${col.headerClassName || ''}`}
                  >
                    <div
                      className={`flex items-center ${col.sortable ? 'justify-between' : 'justify-start'} gap-2`}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <SortIcon direction={isSorted ? activeSort.direction : null} />
                      )}
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
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="px-6 py-16 text-center">
                  {emptyElement || <span className="text-[14px] text-[#939999]">{emptyText}</span>}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
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
