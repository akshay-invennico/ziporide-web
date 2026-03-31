import { pdf } from '@react-pdf/renderer';
import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import DataTable, { type Column } from '@/components/ui/DataTable';

import SupportPDFDocument from '../../components/support/SupportPDFDocument';
import ExportDropdown from '../../components/ui/export/ExportDropdown';
import TicketDetailsModal from '../../components/ui/TicketDetailsModal';
import {
  useSupportTickets,
  useExportSupportCSV,
  useExportSupportPDF,
} from '../../hooks/useSupportTickets';
import type { UseSupportTicketsParams } from '../../hooks/useSupportTickets';
import type { SupportTicket } from '../../types/support.types';

const SupportTicketsPage: React.FC = () => {
  const [params, setParams] = useState<UseSupportTicketsParams>({
    page: 1,
    limit: 10,
    status: 'All',
    search: '',
  });

  const { tickets, loading, pagination, updateTicketStatus } = useSupportTickets(params);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { exportCSV } = useExportSupportCSV();
  const { fetchAllTickets, setIsExporting: setIsExportingPDF } = useExportSupportPDF();

  const handleExportCSV = async () => {
    await exportCSV(params);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const allTickets = await fetchAllTickets(params);
      if (allTickets && allTickets.length > 0) {
        const blob = await pdf(<SupportPDFDocument tickets={allTickets} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Support_Export_${new Date().toISOString().split('T')[0]}.pdf`;
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

  const getStatusBadge = (status: string) => {
    let dotColor = '';
    let textColor = '';
    const s = status.toLowerCase();
    switch (s) {
      case 'open':
        dotColor = 'bg-[#4E616A]';
        textColor = 'text-[#4E616A]';
        break;
      case 'checking':
        dotColor = 'bg-[#1DAFA1]';
        textColor = 'text-[#1DAFA1]';
        break;
      case 'resolved':
        dotColor = 'bg-[#00A63E]';
        textColor = 'text-[#00A63E]';
        break;
    }
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={`text-[13px] font-semibold capitalize ${textColor}`}>{s}</span>
      </div>
    );
  };

  const handleStatusChange = async (ticketId: string, newStatus: SupportTicket['status']) => {
    await updateTicketStatus(ticketId, newStatus);
    if (selectedTicket?.ticketId === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const columns = useMemo<Column<SupportTicket>[]>(
    () => [
      {
        key: 'ticketId',
        label: 'TICKET ID',
        sortable: true,
        render: (ticket) => (
          <span className="text-[14px] font-medium text-[#1DAFA1] cursor-pointer">
            {ticket.ticketId}
          </span>
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
        render: (ticket) =>
          ticket.driver ? (
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0 bg-[#1DAFA1]">
                {ticket.driver.name
                  .trim()
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
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
          ) : (
            <span className="text-[14px] font-medium text-[#4E616A]">—</span>
          ),
      },
      {
        key: 'createdAt',
        label: 'RAISED ON',
        sortable: true,
        render: (ticket) => (
          <span className="text-[14px] font-medium text-[#4E616A]">
            {new Date(ticket.createdAt).toISOString().split('T')[0]}
          </span>
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
              value={params.search}
              onChange={(e) => {
                setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
              }}
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2">
              {(['All', 'Open', 'Checking', 'Resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setParams((prev) => ({ ...prev, status: filter, page: 1 }));
                  }}
                  className={`px-3 py-2 text-[14px] cursor-pointer font-medium rounded-sm border transition-colors ${
                    params.status === filter
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

        <DataTable<SupportTicket>
          columns={columns}
          data={tickets}
          rowKey={(t) => t.id}
          loading={loading}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
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
