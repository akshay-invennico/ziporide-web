import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import TicketDetailsModal from '../../components/ui/TicketDetailsModal';
import { supportTicketsData } from '../../data/SupportTicketsData';
import type { SupportTicket } from '../../data/SupportTicketsData';

const SupportTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(supportTicketsData);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Open' | 'Checking' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 12;

  const filteredData = tickets.filter((ticket) => {
    const matchesFilter = activeFilter === 'All' || ticket.status === activeFilter;
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.cause.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: SupportTicket['status']) => {
    let dotColor = '';
    let textColor = '';
    switch (status) {
      case 'Open':
        dotColor = 'bg-[#4E616A]';
        textColor = 'text-[#4E616A]';
        break;
      case 'Checking':
        dotColor = 'bg-[#1DAFA1]';
        textColor = 'text-[#1DAFA1]';
        break;
      case 'Resolved':
        dotColor = 'bg-[#00A63E]';
        textColor = 'text-[#00A63E]';
        break;
    }
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={`text-[13px] font-semibold ${textColor}`}>{status}</span>
      </div>
    );
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handleStatusChange = (id: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="flex flex-col bg-white p-1 h-full">
      <div className="flex flex-col bg-white rounded-lg border border-[#DFE6E5]">
        {/* Controls Bar */}
        <div className="p-4 border-b border-[#DFE6E5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-[20px] w-[20px] text-[#939999]" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 w-full border border-[#DFE6E5] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[#1DAFA1] focus:border-[#1DAFA1]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2">
              {(['All', 'Open', 'Checking', 'Resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-[14px] cursor-pointer font-medium rounded-sm border transition-colors ${
                    activeFilter === filter
                      ? 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                      : 'border-[#DFE6E5] text-[#4E616A]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#DFE6E5] rounded-sm text-[14px] font-medium text-[#4E616A]">
              <img src="/icons/rider/export.svg" alt="export" className="w-[18px] h-[18px]" />
              Export
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F9F9F9] border-y border-[#DFE6E5]">
                  {[
                    { label: 'TICKET ID', sortable: true, align: 'text-left' },
                    { label: 'CAUSE', sortable: true, align: 'text-left' },
                    { label: 'DRIVER', sortable: true, align: 'text-left' },
                    { label: 'RAISED ON', sortable: true, align: 'text-left' },
                    { label: 'STATUS', sortable: true, align: 'text-center' },
                    { label: 'ACTION', sortable: false, align: 'text-center' },
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
              <tbody>
                {currentData.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`group transition-colors border-b border-[#DFE6E5] hover:bg-gray-50/5 last:border-0`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-medium text-[#1DAFA1] cursor-pointer ">
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-medium text-[#4E616A]">{ticket.cause}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0 overflow-hidden"
                          style={{ backgroundColor: ticket.driver.color }}
                        >
                          <img
                            src={ticket.driver.avatar}
                            alt={ticket.driver.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-[#1DAFA1]">
                            {ticket.driver.name}
                          </span>
                          <span className="text-[12px] font-medium text-[#4E616A]">
                            {ticket.driver.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-medium text-[#4E616A]">
                        {ticket.raisedOn}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start">{getStatusBadge(ticket.status)}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center justify-center cursor-pointer p-1 hover:bg-white rounded-full transition-colors"
                        >
                          <img
                            src="/icons/rider/eye.svg"
                            alt="view"
                            className="w-[20px] h-[20px]"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="mt-auto border-t border-[#DFE6E5] px-6 py-4 flex items-center justify-end gap-2 bg-white rounded-b-xl">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-full border border-[#DFE6E5] text-[#101828] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {getPages().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-1.5 text-[#4E616A] text-[14px] font-medium">...</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-lg text-[14px] font-semibold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#EEFFFD] text-[#1DAFA1] border border-[#1DAFA1]/30'
                          : 'text-[#4E616A] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-full border border-[#DFE6E5] text-[#101828] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default SupportTicketsPage;
