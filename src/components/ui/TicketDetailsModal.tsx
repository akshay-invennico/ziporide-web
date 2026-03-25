import { X, Copy } from 'lucide-react';
import React from 'react';

import type { SupportTicket } from '../../data/SupportTicketsData';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onStatusChange?: (id: string, newStatus: SupportTicket['status']) => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ isOpen, onClose, ticket, onStatusChange }) => {
  if (!isOpen || !ticket) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const statusColors = {
    Open: { dot: 'bg-[#4E616A]', text: 'text-[#4E616A]', bg: 'bg-[#F9F9F9]' },
    Checking: { dot: 'bg-[#1DAFA1]', text: 'text-[#1DAFA1]', bg: 'bg-[#EEFFFD]' },
    Resolved: { dot: 'bg-[#00A63E]', text: 'text-[#00A63E]', bg: 'bg-[#DCFCE7]' },
  };

  const colors = statusColors[ticket.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-[800px] flex flex-col overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE6E5]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Ticket Details</h2>
          <button onClick={onClose} className="p-1 rounded-full transition-colors cursor-pointer hover:bg-gray-100">
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
                <span className="text-[14px] font-semibold text-[#1DAFA1]">{ticket.id}</span>
                <button onClick={() => handleCopy(ticket.id)} className="p-1 rounded cursor-pointer hover:bg-gray-50">
                  <Copy className="w-4 h-4 text-[#1DAFA1]" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#000000] font-medium">
                <img src="/icons/rider/dates.svg" alt="calendar" className="w-5 h-5" />
                <span>{ticket.raisedOn}</span>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[500px] ${colors.bg}`}>
              <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <span className={`text-[12px] font-semibold ${colors.text}`}>{ticket.status}</span>
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
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#4E616A]">Trip ID: </span>
                <span className="text-[14px] font-medium text-[#1DAFA1]">{ticket.tripId}</span>
                <button onClick={() => handleCopy(ticket.tripId)} className="p-1 rounded cursor-pointer hover:bg-gray-50">
                  <Copy className="w-4 h-4 text-[#1DAFA1]" />
                </button>
              </div>
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
        {ticket.status !== 'Resolved' && (
          <div className="px-6 py-4 border-t border-[#DFE6E5] flex justify-end gap-3 bg-white">
            {ticket.status === 'Open' && (
              <button
                onClick={() => onStatusChange?.(ticket.id, 'Checking')}
                className="px-6 py-2.5 bg-white border border-[#DFE6E5] text-[#1DAFA1] text-[14px] font-medium rounded-md  cursor-pointer"
              >
                Mark as Checking
              </button>
            )}
            <button
              onClick={() => onStatusChange?.(ticket.id, 'Resolved')}
              className="px-6 py-2.5 bg-white border border-[#DFE6E5] text-[#1DAFA1] text-[14px] font-medium rounded-md  cursor-pointer"
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
