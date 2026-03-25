import { X, Copy } from 'lucide-react';
import React from 'react';

interface TransactionRecord {
  id: string;
  type: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  paymentMethod?: string;
  externalId?: string;
  tripId?: string;
  driver?: {
    name: string;
    id: string;
    avatar: string;
  };
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: string) => {
    let bg = '';
    let dot = '';
    let text = '';
    switch (status) {
      case 'Paid':
        bg = 'bg-[#DCFCE7]';
        dot = 'bg-[#00A63E]';
        text = 'text-[#00A63E]';
        break;
      case 'In Process':
        bg = 'bg-[#FFF7E4]';
        dot = 'bg-[#F6921E]';
        text = 'text-[#F6921E]';
        break;
      case 'Refunded':
        bg = 'bg-[#FFEEEE]';
        dot = 'bg-[#FF0707]';
        text = 'text-[#FF0707]';
        break;
      default:
        bg = 'bg-gray-100';
        dot = 'bg-gray-400';
        text = 'text-gray-600';
    }
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[500px] ${bg}`}>
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <span className={`text-[12px] font-semibold ${text}`}>{status}</span>
      </div>
    );
  };

  const formatAmount = (amount: number, type: string) => {
    const isPositive = ['Ride Payment', 'Subscription Payment', 'Cancellation Fee', 'No-Show Fee', 'Driver Incentive'].includes(type) && amount > 0;
    const sign = isPositive ? '+' : '-';
    const absAmount = Math.abs(amount).toFixed(2);
    const color = isPositive ? 'text-[#1DAFA1]' : 'text-[#FF0707]';
    return <span className={`text-[16px] font-semibold ${color}`}>{sign} £{absAmount}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-[800px] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE6E5]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Transactions Details</h2>
          <button onClick={onClose} className="p-1  rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-[#4E616A]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-8">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-[#4E616A]">Transaction ID:</span>
                <span className="text-[14px] font-semibold text-[#1DAFA1]">{transaction.id}</span>
                <button onClick={() => handleCopy(transaction.id)} className="p-1  rounded cursor-pointer">
                  <Copy className="w-4 h-4 text-[#1DAFA1]" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-[#000000] font-medium">
                <div className="flex items-center gap-2">
                  <img src="/icons/rider/dates.svg" alt="calender" />
                  <span>{transaction.date}</span>
                </div>
                <div className="w-px h-4 bg-[#DFE6E5]" />
                <span>{transaction.time}</span>
              </div>
            </div>
            {getStatusBadge(transaction.status)}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#747C84]">Amount</span>
              {formatAmount(transaction.amount, transaction.type)}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#747C84]">Type</span>
              <span className="text-[14px] font-medium text-[#000000]">{transaction.type}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#747C84]">Payment Method</span>
              <span className="text-[14px] font-medium text-[#1DAFA1]">{transaction.paymentMethod || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#747C84]">External Payment ID</span>
              <span className="text-[14px] font-medium text-[#1DAFA1]">{transaction.externalId || 'N/A'}</span>
            </div>

            {/* For most types (except Subscription), show Trip ID */}
            {transaction.type !== 'Subscription Payment' && (
              <div className="flex flex-col gap-1.5 col-span-2">
                <span className="text-[12px] font-medium text-[#747C84]">Trip ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#1DAFA1]">{transaction.tripId || 'N/A'}</span>
                  {transaction.tripId && transaction.tripId !== 'N/A' && (
                    <button onClick={() => handleCopy(transaction.tripId!)} className="p-1 hover:bg-gray-50 rounded cursor-pointer">
                      <Copy className="w-4 h-4 text-[#1DAFA1]" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Show Driver/Receiver Info for Subscription, Refund, or Driver Payout */}
            {(transaction.type === 'Subscription Payment' || transaction.type === 'Refund' || transaction.type === 'Driver Payout') && (
              <div className="flex flex-col gap-1.5 col-span-2">
                <span className="text-[12px] font-medium text-[#667085]">
                  {transaction.type === 'Refund' ? 'Receiver Info' : 'Driver Info'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={transaction.driver?.avatar || '/icons/driver/avatar1.png'}
                      alt={transaction.driver?.name || 'Driver'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[#101828]">
                      {transaction.driver?.name || 'Unknown User'}
                    </span>
                    <span className="text-[12px] text-[#1DAFA1] font-medium">{transaction.driver?.id || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
