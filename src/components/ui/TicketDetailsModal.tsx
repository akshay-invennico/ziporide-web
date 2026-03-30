import { X, Copy } from 'lucide-react';
import React from 'react';

import type { SupportTicket } from '../../types/support.types';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onStatusChange?: (id: string, newStatus: 'open' | 'checking' | 'resolved') => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onStatusChange,
}) => {
  if (!isOpen || !ticket) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const statusColors: Record<string, { dot: string; text: string; bg: string }> = {
    open: { dot: 'bg-[#4E616A]', text: 'text-[#4E616A]', bg: 'bg-[#F9F9F9]' },
    checking: { dot: 'bg-[#1DAFA1]', text: 'text-[#1DAFA1]', bg: 'bg-[#EEFFFD]' },
    resolved: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]', bg: 'bg-[#DCFCE7]' },
  };

  const colors = statusColors[ticket.status.toLowerCase()] || statusColors.open;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-[800px] flex flex-col overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE6E5]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Ticket Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors cursor-pointer hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-[#4E616A]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Top Info Section */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-[#4E616A]">Ticket ID:</span>
                <span className="text-[14px] font-semibold text-[#1DAFA1]">{ticket.ticketId}</span>
                <button
                  onClick={() => handleCopy(ticket.ticketId)}
                  className="p-1 rounded cursor-pointer hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 text-[#1DAFA1]" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#000000] font-medium">
                <img src="/icons/calender.svg" alt="date" />
                <span className="text-[#000000]">
                  {new Date(ticket.createdAt).toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[500px] ${colors.bg}`}>
              <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <span className={`text-[12px] font-semibold capitalize ${colors.text}`}>
                {ticket.status}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#747C84]">Cause</span>
              <span className="text-[14px] font-medium text-[#000000]">{ticket.cause}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[#747C84]">Against</span>
              {ticket.ride ? (
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#4E616A]">Trip ID: </span>
                  <span className="text-[14px] font-medium text-[#1DAFA1]">
                    {ticket.ride.rideNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(ticket.ride!.rideNumber)}
                    className="p-1 rounded cursor-pointer hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4 text-[#1DAFA1]" />
                  </button>
                </div>
              ) : (
                <span className="text-[14px] font-medium text-[#4E616A]">—</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-[#747C84]">Description</span>
            <p className="text-[14px] leading-relaxed font-medium text-[#000000]">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        {ticket.status !== 'resolved' && (
          <div className="px-6 py-4 border-t border-[#DFE6E5] flex justify-end gap-3 bg-white">
            {ticket.status === 'open' && (
              <button
                onClick={() => onStatusChange?.(ticket.ticketId, 'checking')}
                className="px-6 py-2.5 bg-white border border-[#DFE6E5] text-[#1DAFA1] text-[14px] font-medium rounded-md cursor-pointer transition-colors hover:bg-[#EEFFFD]"
              >
                Mark as Checking
              </button>
            )}
            <button
              onClick={() => onStatusChange?.(ticket.ticketId, 'resolved')}
              className="px-6 py-2.5 bg-white border border-[#DFE6E5] text-[#1DAFA1] text-[14px] font-medium rounded-md cursor-pointer transition-colors hover:bg-[#EEFFFD]"
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsModal;
