import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import DataTable, { type Column } from '@/components/ui/DataTable';

import ExportDropdown from '../../components/ui/export/ExportDropdown';
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
  const [isExportOpen, setIsExportOpen] = useState(false);
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

  const handleStatusChange = (id: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const columns = useMemo<Column<SupportTicket>[]>(
    () => [
      {
        key: 'id',
        label: 'TICKET ID',
        sortable: true,
        render: (ticket) => (
          <span className="text-[14px] font-medium text-[#1DAFA1] cursor-pointer">{ticket.id}</span>
        ),
      },
      {
        key: 'cause',
        label: 'CAUSE',
        sortable: true,
        render: (ticket) => (
          <span className="text-[14px] font-medium text-[#4E616A]">{ticket.cause}</span>
        ),
      },
      {
        key: 'driver',
        label: 'DRIVER',
        sortable: true,
        render: (ticket) => (
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
              <span className="text-[14px] font-semibold text-[#1DAFA1]">{ticket.driver.name}</span>
              <span className="text-[12px] font-medium text-[#4E616A]">{ticket.driver.phone}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'raisedOn',
        label: 'RAISED ON',
        sortable: true,
        render: (ticket) => (
          <span className="text-[14px] font-medium text-[#4E616A]">{ticket.raisedOn}</span>
        ),
      },
      {
        key: 'status',
        label: 'STATUS',
        sortable: true,
        render: (ticket) => <div className="flex items-start">{getStatusBadge(ticket.status)}</div>,
      },
      {
        key: 'action',
        label: 'ACTION',
        render: (ticket) => (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSelectedTicket(ticket);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center cursor-pointer p-1 hover:bg-white rounded-full transition-colors"
            >
              <img src="/icons/rider/eye.svg" alt="view" className="w-[20px] h-[20px]" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

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

        <DataTable<SupportTicket>
          columns={columns}
          data={currentData}
          rowKey={(t) => t.id}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          emptyText="No tickets found."
        />
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
