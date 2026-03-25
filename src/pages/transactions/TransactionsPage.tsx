import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import TransactionDetailsModal from '../../components/ui/TransactionDetailsModal';
import { transactionsData } from '../../data/TransactionsData';
import type { TransactionRecord } from '../../data/TransactionsData';

const TransactionsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pay-in' | 'Payout' | 'Refund'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null);
  const itemsPerPage = 12;

  const filteredData = transactionsData.filter((txn) => {
    // Filter by type
    if (activeFilter === 'Pay-in' && !['Ride Payment', 'Subscription Payment'].includes(txn.type))
      return false;
    if (activeFilter === 'Payout' && !['Driver Payout', 'Driver Incentive'].includes(txn.type))
      return false;
    if (activeFilter === 'Refund' && txn.type !== 'Refund') return false;

    // Search
    if (searchQuery) {
      if (
        !txn.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !txn.type.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {['All', 'Pay-in', 'Payout', 'Refund'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-[14px] cursor-pointer font-medium rounded-sm border transition-colors ${
                    activeFilter === filter
                      ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                      : 'border-[#DFE6E5] text-[#4E616A] '
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A] ">
              <img src="/icons/rider/export.svg" alt="export" className="w-[18px] h-[18px]" />
              Export
            </button>
          </div>
        </div>

        {/* Table container */}
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
              {currentData.length > 0 ? (
                currentData.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-[#DFE6E5] hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-medium text-[#1DAFA1] text-[14px] cursor-pointer hover:underline">
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
                    <td className="px-5 py-4">{getStatusBadge(txn.status)}</td>
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
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1.5 rounded-full border border-gray-200 text-[#4E616A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-[20px] w-[20px] cursor-pointer" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-8 flex items-center justify-center cursor-pointer rounded-lg text-[14px] transition-colors ${
                      currentPage === pageNum
                        ? 'border border-[#1DAFA1] text-[#1DAFA1] font-semibold bg-[#EEFFFD]'
                        : 'text-[#4E616A] font-semibold hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span key={pageNum} className="text-[#4E616A] px-1 font-semibold">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-full border border-gray-200 text-[#4E616A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-[20px] w-[20px] cursor-pointer" />
          </button>
        </div>
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
