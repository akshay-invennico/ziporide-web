import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '@/context/useAuth';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import { connectAdminSocket } from '@/lib/socket';
import type { AdminNotification } from '@/types/notification.types';
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
  startDate?: string;
  endDate?: string;
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
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      queryParams.append('sortBy', 'createdAt');
      if (params.status !== 'All') queryParams.append('status', params.status.toLowerCase());
      if (params.search) queryParams.append('search', params.search);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

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
      startDate: initialParams.startDate,
      endDate: initialParams.endDate,
    });
  }, [
    fetchTickets,
    initialParams.page,
    initialParams.limit,
    initialParams.status,
    initialParams.search,
    initialParams.startDate,
    initialParams.endDate,
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

export const useSupportTicketCount = () => {
  const { isAuthenticated, token } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCount = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', '1');
      queryParams.append('limit', '1');
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('status', 'open');

      const response = await apiClient.get<SupportTicketResponse>(
        `${API.SUPPORT_TICKETS}?${queryParams.toString()}`,
      );
      const data = response.data;
      if (data?.status) {
        setCount(data.meta?.totalResults ?? data.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch support ticket count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = connectAdminSocket(token);
    const handleNotification = ({ notification }: { notification: AdminNotification }) => {
      if (notification.type === 'new_support_ticket') {
        fetchCount();
      }
    };
    socket.on('admin:notification', handleNotification);
    return () => {
      socket.off('admin:notification', handleNotification);
    };
  }, [isAuthenticated, token, fetchCount]);

  return { count, loading, refetch: fetchCount };
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
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

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
          ticket.driver?.profile || 'N/A',
          ticket.driver?.name || 'N/A',
          ticket.driver?.phone || 'N/A',
          new Date(ticket.createdAt).toLocaleDateString('en-CA'),
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
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

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
