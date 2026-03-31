import { pdf } from '@react-pdf/renderer';
import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import DataTable, { type Column } from '@/components/ui/DataTable';

import TransactionPDFDocument from '../../components/transactions/TransactionPDFDocument';
import ExportDropdown from '../../components/ui/export/ExportDropdown';
import TransactionDetailsModal from '../../components/ui/TransactionDetailsModal';
import {
  useTransactions,
  useExportTransactionsCSV,
  useExportTransactionsPDF,
} from '../../hooks/useTransactions';
import type { UseTransactionsParams } from '../../hooks/useTransactions';
import type { Transaction } from '../../types/transaction.types';

const TransactionsPage: React.FC = () => {
  const [params, setParams] = useState<UseTransactionsParams>({
    page: 1,
    limit: 12,
    category: 'All',
    search: '',
  });

  const { transactions, loading, pagination } = useTransactions(params);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { exportCSV } = useExportTransactionsCSV();
  const { fetchAllTransactions, setIsExporting: setIsExportingPDF } = useExportTransactionsPDF();

  const handleExportCSV = async () => {
    await exportCSV(params);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const allTransactions = await fetchAllTransactions(params);
      if (allTransactions && allTransactions.length > 0) {
        const blob = await pdf(<TransactionPDFDocument transactions={allTransactions} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Transactions_Export_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF Export failed:', err);
    } finally {
      setIsExportingPDF(false);
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

  const columns = useMemo<Column<Transaction>[]>(
    () => [
      {
        key: 'id',
        label: 'TRANSACTION ID',
        sortable: true,
        render: (txn) => (
          <span className="font-medium text-[#1DAFA1] text-[14px] cursor-pointer hover:underline">
            {txn.id}
          </span>
        ),
      },
      {
        key: 'type',
        label: 'TYPE',
        render: (txn) => (
          <span className="text-[#4E616A] text-[14px] font-medium whitespace-nowrap">
            {txn.type}
          </span>
        ),
      },
      {
        key: 'amount',
        label: 'AMOUNT',
        sortable: true,
        render: (txn) => (
          <span className="whitespace-nowrap">{formatAmount(txn.amount, txn.type)}</span>
        ),
      },
      {
        key: 'date',
        label: 'TIME & DATE',
        sortable: true,
        render: (txn) => (
          <span className="text-[#4E616A] text-[14px] font-medium whitespace-nowrap">
            {txn.date} <span className="ml-2">{txn.time}</span>
          </span>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (txn) => getStatusBadge(txn.status),
      },
      {
        key: 'action',
        label: 'ACTION',
        render: (txn) => (
          <button
            onClick={() => {
              setSelectedTransaction(txn);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center cursor-pointer"
          >
            <img src="/icons/rider/eye.svg" alt="view" className="w-[20px] h-[20px]" />
          </button>
        ),
      },
    ],
    [],
  );

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
                setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {(['All', 'Pay-in', 'Payout', 'Refund'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setParams((prev) => ({ ...prev, category: filter, page: 1 }));
                  }}
                  className={`px-3 py-2 text-[14px] cursor-pointer font-medium rounded-sm border transition-colors ${params.category === filter
                      ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                      : 'border-[#DFE6E5] text-[#4E616A]'
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
              <ExportDropdown
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>
        </div>

        <DataTable<Transaction>
          columns={columns}
          data={transactions}
          rowKey={(txn) => txn.id}
          loading={loading}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          emptyText="No transactions found matching your criteria."
        />
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
