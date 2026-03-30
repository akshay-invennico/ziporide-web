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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tickets');
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
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || 'Failed to update ticket status';
        setError(message);
        throw err;
      }
    },
    [],
  );

  useEffect(() => {
    fetchTickets(initialParams);
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
