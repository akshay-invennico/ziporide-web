import React, { useCallback, useId, useMemo, useState } from 'react';

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
  type?: 'string' | 'number' | 'date';
  sortable?: boolean;
  sortValue?: (row: T) => unknown;
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
  pageSize?: number;
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
    <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
      <img
        src="/icons/updown.svg"
        alt="sort"
        className="h-[18px] w-[18px] min-h-[18px] min-w-[18px] shrink-0"
      />
    </div>
  );
};

const toComparableString = (val: unknown) => {
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    if (obj.name) return String(obj.name);
    if (obj.pickupLocation) return String(obj.pickupLocation);
    return JSON.stringify(val);
  }

  return String(val ?? '');
};

function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  sort,
  onSort,
  currentPage: controlledPage,
  totalPages: controlledTotalPages,
  pageSize = 10,
  onPageChange: controlledOnPageChange,
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
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const activeSortKey = sort?.column || sortKey;
  const activeSortDirection = sort?.direction ?? sortDirection;

  const isControlledPagination =
    controlledPage !== undefined &&
    controlledTotalPages !== undefined &&
    controlledOnPageChange !== undefined;
  const [internalPage, setInternalPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!activeSortDirection || !activeSortKey) return data;

    const column = columns.find((c) => c.key === activeSortKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const valA = column.sortValue
        ? column.sortValue(a)
        : (a as Record<string, unknown>)[activeSortKey];
      const valB = column.sortValue
        ? column.sortValue(b)
        : (b as Record<string, unknown>)[activeSortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined || valA === '') return 1;
      if (valB === null || valB === undefined || valB === '') return -1;

      let comparison = 0;

      switch (column.type) {
        case 'number': {
          const numA = Number(String(valA).replace(/[^0-9.-]/g, ''));
          const numB = Number(String(valB).replace(/[^0-9.-]/g, ''));
          comparison = (Number.isNaN(numA) ? 0 : numA) - (Number.isNaN(numB) ? 0 : numB);
          break;
        }
        case 'date': {
          const recA = a as Record<string, unknown>;
          const recB = b as Record<string, unknown>;
          const dateStrA = recA.date && recA.time ? `${recA.date} ${recA.time}` : String(valA);
          const dateStrB = recB.date && recB.time ? `${recB.date} ${recB.time}` : String(valB);
          const timeA = new Date(String(dateStrA)).getTime();
          const timeB = new Date(String(dateStrB)).getTime();

          if (Number.isNaN(timeA) && Number.isNaN(timeB)) comparison = 0;
          else if (Number.isNaN(timeA)) return 1;
          else if (Number.isNaN(timeB)) return -1;
          else comparison = timeA - timeB;

          break;
        }
        case 'string':
        default:
          comparison = toComparableString(valA)
            .toLowerCase()
            .localeCompare(toComparableString(valB).toLowerCase(), undefined, {
              numeric: true,
              sensitivity: 'base',
            });
      }

      return activeSortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }, [data, activeSortDirection, activeSortKey, columns]);

  const currentPage = isControlledPagination ? controlledPage : internalPage;
  const totalPages = isControlledPagination
    ? controlledTotalPages
    : Math.max(1, Math.ceil(sortedData.length / pageSize));
  const onPageChange = isControlledPagination ? controlledOnPageChange : setInternalPage;

  const paginatedData = useMemo(() => {
    if (isControlledPagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [isControlledPagination, sortedData, currentPage, pageSize]);

  React.useEffect(() => {
    if (
      !isControlledPagination &&
      currentPage > 1 &&
      (currentPage - 1) * pageSize >= sortedData.length
    ) {
      setInternalPage(1);
    }
  }, [sortedData.length, isControlledPagination, currentPage, pageSize]);

  const getRowKey = useCallback(
    (row: T, index: number): string => {
      if (rowKey) return rowKey(row);
      if ('id' in row) return String(row.id);
      return String(index);
    },
    [rowKey],
  );

  const handleSort = (columnKey: string) => {
    const nextDirection: SortDirection =
      activeSortKey === columnKey && activeSortDirection === 'asc' ? 'desc' : 'asc';

    if (onSort) {
      onSort({ column: columnKey, direction: nextDirection });
    } else {
      setSortKey(columnKey);
      setSortDirection(nextDirection);
    }

    if (!isControlledPagination) {
      setInternalPage(1);
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
      <div className="overflow-x-auto scrollbar-thin" style={{ minHeight }}>
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
                    <div className="flex items-center justify-between gap-2 w-full">
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
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="px-6 py-16 text-center">
                  {emptyElement || <span className="text-[14px] text-[#939999]">{emptyText}</span>}
                </td>
              </tr>
            ) : (
              paginatedData.map((row: T, rowIndex: number) => {
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

export default DataTable;
