import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import ExportDropdown from '../../components/ui/export/ExportDropdown';
import TransactionDetailsModal from '../../components/ui/TransactionDetailsModal';
import { useTransactions } from '../../hooks/useTransactions';
import type { UseTransactionsParams } from '../../hooks/useTransactions';
import type { Transaction } from '../../types/transaction.types';

const TransactionsPage: React.FC = () => {
  const [params, setParams] = useState<UseTransactionsParams>({
    page: 1,
    limit: 12,
    category: 'All',
    search: '',
  });

  const { transactions, loading, error, pagination } = useTransactions(params);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handlePrev = () => {
    if (params.page > 1) {
      setParams(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (params.page < pagination.totalPages) {
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const isPositive =
      [
        'Ride Payment',
        'Subscription Payment',
        'Cancellation Fee',
        'No-Show Fee',
        'Driver Incentive',
      ].includes(type) && amount > 0;
    const sign = isPositive ? '+' : '-';
    // Ensure amount is treated as positive for formatting, then add sign
    const absAmount = Math.abs(amount).toFixed(2);
    const color = isPositive ? 'text-[#1DAFA1]' : 'text-[#FF0707]';
    return (
      <span className={`font-semibold ${color}`}>
        {sign} £{absAmount}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    let dotColor = '';
    let textColor = '';
    switch (status) {
      case 'Paid':
        dotColor = 'bg-[#00A63E]';
        textColor = 'text-[#00A63E]';
        break;
      case 'In Process':
        dotColor = 'bg-[#F6921E]';
        textColor = 'text-[#F6921E]';
        break;
      case 'Refunded':
        dotColor = 'bg-[#FF0707]';
        textColor = 'text-[#FF0707]';
        break;
      default:
        dotColor = 'bg-gray-400';
        textColor = 'text-gray-600';
    }
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={`text-[12px] font-semibold ${textColor}`}>{status}</span>
      </div>
    );
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    const { totalPages, currentPage } = pagination;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col bg-white p-1 h-full">
      <div className="flex flex-col bg-white rounded-lg border border-[#DFE6E5]">
        {/* Controls Bar */}
        <div className="p-4 border-b border-[#DFE6E5] flex justify-between items-center">
          <div className="relative w-[380px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-[20px] w-[20px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-[300px] border border-[#DFE6E5] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[#1DAFA1] focus:border-[#1DAFA1]"
              value={params.search}
              onChange={(e) => {
                setParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {(['All', 'Pay-in', 'Payout', 'Refund'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setParams(prev => ({ ...prev, category: filter, page: 1 }));
                  }}
                  className={`px-3 py-2 text-[14px] cursor-pointer font-medium rounded-sm border transition-colors ${
                    params.category === filter
                      ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                      : 'border-[#DFE6E5] text-[#4E616A] '
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A]"
              >
                <img src="/icons/rider/export.svg" alt="export" className="w-[18px] h-[18px]" />
                Export
              </button>
              <ExportDropdown isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="flex-1 flex flex-col min-h-[400px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-20">
              <Loader2 className="w-8 h-8 text-[#1DAFA1] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-20 text-red-500 font-medium text-[14px]">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9F9F9] border-y border-[#DFE6E5] text-[14px] font-inter font-medium uppercase tracking-wider text-[#4E616A]">
                    {[
                      { label: 'TRANSACTION ID', sortable: true },
                      { label: 'TYPE', sortable: false },
                      { label: 'AMOUNT', sortable: true },
                      { label: 'TIME & DATE', sortable: true },
                      { label: 'STATUS', sortable: true },
                      { label: 'ACTION', sortable: false },
                    ].map((header) => (
                      <th
                        key={header.label}
                        className={`px-5 py-3.5 ${header.sortable ? 'cursor-pointer group' : ''}`}
                      >
                        <div
                          className={`flex items-center ${header.sortable ? 'justify-between' : 'justify-start'}`}
                        >
                          <span className="text-[#4E616A] font-medium text-[12px] whitespace-nowrap">
                            {header.label}
                          </span>
                          {header.sortable && (
                            <img
                              src="/icons/rider/updown.svg"
                              alt="sort"
                              className="w-[14px] h-[14px]"
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {transactions.length > 0 ? (
                    transactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span 
                            className="font-medium text-[#1DAFA1] text-[14px] cursor-pointer hover:underline"
                            onClick={() => {
                              setSelectedTransaction(txn);
                              setIsModalOpen(true);
                            }}
                          >
                            {txn.id}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#4E616A] text-[14px] font-medium whitespace-nowrap">
                          {txn.type}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {formatAmount(txn.amount, txn.type)}
                        </td>
                        <td className="px-5 py-4 text-[#4E616A] text-[14px] font-medium whitespace-nowrap">
                          {txn.date} <span className="ml-2">{txn.time}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-start">
                            {getStatusBadge(txn.status)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              setSelectedTransaction(txn);
                              setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center cursor-pointer "
                          >
                            <img
                              src="/icons/rider/eye.svg"
                              alt="view"
                              className="w-[20px] h-[20px] text-[#1DAFA1]"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-20 text-center text-[#4E616A] text-[14px] font-medium">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {!loading && !error && transactions.length > 0 && (
          <div className="p-4 border-t border-[#DFE6E5] flex items-center justify-end gap-2">
            <button
              onClick={handlePrev}
              disabled={params.page === 1}
              className="p-1.5 rounded-full border border-gray-200 text-[#4E616A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-[20px] w-[20px]" />
            </button>

            <div className="flex items-center gap-1">
              {getPages().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-1.5 text-[#4E616A] text-[14px] font-medium">...</span>
                  ) : (
                    <button
                      onClick={() => setParams(prev => ({ ...prev, page: page as number }))}
                      className={`min-w-[32px] h-8 flex items-center justify-center cursor-pointer rounded-lg text-[14px] transition-colors ${
                        params.page === page
                          ? 'border border-[#1DAFA1] text-[#1DAFA1] font-semibold bg-[#EEFFFD]'
                          : 'text-[#4E616A] font-semibold hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={params.page === pagination.totalPages || pagination.totalPages === 0}
              className="p-1.5 rounded-full border border-gray-200 text-[#4E616A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="h-[20px] w-[20px]" />
            </button>
          </div>
        )}
      </div>

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
