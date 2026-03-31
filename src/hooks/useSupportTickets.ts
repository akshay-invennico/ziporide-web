import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  SupportTicket,
  SupportTicketResponse,
  UpdateTicketStatusResponse,
} from '@/types/support.types';

export interface UseSupportTicketsParams {
  page: number;
  limit: number;
  status: 'All' | 'Open' | 'Checking' | 'Resolved';
  search: string;
}

export const useSupportTickets = (
  initialParams: UseSupportTicketsParams = { page: 1, limit: 12, status: 'All', search: '' },
) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  });

  const fetchTickets = useCallback(async (params: UseSupportTicketsParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params.status !== 'All') queryParams.append('status', params.status.toLowerCase());
      if (params.search) queryParams.append('search', params.search);

      const response = await apiClient.get<SupportTicketResponse>(
        `${API.SUPPORT_TICKETS}?${queryParams.toString()}`,
      );
      const data = response.data;
      if (data && data.status) {
        setTickets(data.data);
        setPagination({
          currentPage: data.meta.page,
          totalPages: data.meta.totalPages,
          totalResults: data.meta.totalResults,
        });
      } else {
        setError(data?.message || 'Failed to fetch tickets.');
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : (err as Error).message || 'Failed to fetch tickets';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTicketStatus = useCallback(
    async (id: string, status: 'open' | 'checking' | 'resolved') => {
      try {
        const response = await apiClient.patch<UpdateTicketStatusResponse>(
          API.UPDATE_TICKET_STATUS(id),
          { status },
        );
        if (response.data.status) {
          // Update local state to reflect the change
          setTickets((prev) => prev.map((t) => (t.ticketId === id ? { ...t, status } : t)));
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to update ticket status');
        }
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : (err as Error).message || 'Failed to update ticket status';
        setError(message);
        throw err;
      }
    },
    [],
  );

  useEffect(() => {
    fetchTickets({
      page: initialParams.page,
      limit: initialParams.limit,
      status: initialParams.status,
      search: initialParams.search,
    });
  }, [
    fetchTickets,
    initialParams.page,
    initialParams.limit,
    initialParams.status,
    initialParams.search,
  ]);

  return {
    tickets,
    loading,
    error,
    pagination,
    fetchTickets,
    updateTicketStatus,
  };
};

export const useExportSupportCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(async (params: UseSupportTicketsParams) => {
    setIsExporting(true);
    try {
      let allTickets: SupportTicket[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '50');

        if (params.status !== 'All') queryParams.append('status', params.status.toLowerCase());
        if (params.search) queryParams.append('search', params.search);

        const response = await apiClient.get<SupportTicketResponse>(
          `${API.SUPPORT_TICKETS}?${queryParams.toString()}`,
        );
        const data = response.data;
        if (data && data.status) {
          allTickets = [...allTickets, ...data.data];
          totalPages = data.meta.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      if (allTickets.length > 0) {
        const headers = ['Ticket ID', 'Cause', 'Driver', 'Phone', 'Created At', 'Status'];
        const rows = allTickets.map((ticket) => [
          ticket.ticketId,
          ticket.cause,
          ticket.driver?.name || 'N/A',
          ticket.driver?.phone || 'N/A',
          new Date(ticket.createdAt).toLocaleDateString(),
          ticket.status,
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Support_Tickets_Export_${new Date().toISOString().split('T')[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('CSV Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportCSV, isExporting };
};

export const useExportSupportPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllTickets = useCallback(async (params: UseSupportTicketsParams) => {
    setIsExporting(true);
    try {
      let allTickets: SupportTicket[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '50');

        if (params.status !== 'All') queryParams.append('status', params.status.toLowerCase());
        if (params.search) queryParams.append('search', params.search);

        const response = await apiClient.get<SupportTicketResponse>(
          `${API.SUPPORT_TICKETS}?${queryParams.toString()}`,
        );
        const data = response.data;
        if (data && data.status) {
          allTickets = [...allTickets, ...data.data];
          totalPages = data.meta.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      return allTickets;
    } catch (err) {
      console.error('Failed to fetch tickets for PDF:', err);
      return [];
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { fetchAllTickets, isExporting, setIsExporting };
};
