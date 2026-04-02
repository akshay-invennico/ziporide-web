import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { Transaction, TransactionResponse } from '@/types/transaction.types';

export interface UseTransactionsParams {
  page: number;
  limit: number;
  search: string;
}

const mapType = (type: string) => {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const mapStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'completed') return 'Paid';
  if (s === 'pending') return 'In Process';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const mapPaymentMethod = (pm: Record<string, unknown> | string | null | undefined): string => {
  if (!pm) return 'N/A';
  if (typeof pm === 'string') return pm;
  if (pm.type === 'card' && pm.card) {
    const card = pm.card as Record<string, unknown>;
    const brand = card?.brand
      ? String(card.brand).charAt(0).toUpperCase() + String(card.brand).slice(1)
      : 'Card';
    return `${brand} •••• ${card?.last4}`;
  }
  return pm.type ? String(pm.type).charAt(0).toUpperCase() + String(pm.type).slice(1) : 'N/A';
};

export const useTransactions = (
  initialParams: UseTransactionsParams = { page: 1, limit: 12, search: '' },
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  });

  const fetchTransactions = useCallback(async (params: UseTransactionsParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());

      if (params.search) {
        queryParams.append('search', params.search);
      }

      const response = await apiClient.get<TransactionResponse>(
        `${API.TRANSACTIONS}?${queryParams.toString()}`,
      );
      const apiResponse = response.data;

      if (apiResponse && apiResponse.success) {
        const results = apiResponse.data.results.map((item) => ({
          ...item,
          id: item.transactionId, // Prefer display ID for UI identification
          originalId: item.id, // Keep Stripe ID
          type: mapType(item.type),
          status: mapStatus(item.status),
          date: item.createdAt.substring(0, 10),
          time: item.createdAt.substring(11, 16),
          paymentMethod: mapPaymentMethod(item.paymentMethod),
          externalId:
            ((item as unknown as Record<string, unknown>).stripeTransferId as string) || 'N/A',
          tripId:
            (((item as unknown as Record<string, unknown>).ride as Record<string, unknown>)
              ?.rideNumber as string) || 'N/A',
          driver: item.driver
            ? {
                ...item.driver,
                avatar:
                  item.driver.profile ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(item.driver.name)}&background=1DAFA1&color=fff`,
              }
            : undefined,
        }));

        setTransactions(results);
        setPagination({
          currentPage: apiResponse.data.page,
          totalPages: apiResponse.data.totalPages,
          totalResults: apiResponse.data.totalResults,
        });
      } else {
        setError(apiResponse?.message || 'Failed to fetch transactions.');
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : (err as Error).message || 'Failed to fetch transactions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions({
      page: initialParams.page,
      limit: initialParams.limit,
      search: initialParams.search,
    });
  }, [fetchTransactions, initialParams.page, initialParams.limit, initialParams.search]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
  };
};

export const useExportTransactionsCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(async (params: UseTransactionsParams) => {
    setIsExporting(true);
    try {
      let allTransactions: Transaction[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '50'); // Fetch larger chunks for export

        if (params.search) {
          queryParams.append('search', params.search);
        }

        const response = await apiClient.get<TransactionResponse>(
          `${API.TRANSACTIONS}?${queryParams.toString()}`,
        );

        if (response.data && response.data.success) {
          const results = response.data.data.results.map((item) => ({
            ...item,
            id: item.transactionId,
            type: mapType(item.type),
            status: mapStatus(item.status),
            date: item.createdAt.substring(0, 10),
            time: item.createdAt.substring(11, 16),
          }));

          allTransactions = [...allTransactions, ...results];
          totalPages = response.data.data.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      if (allTransactions.length > 0) {
        const headers = [
          'Transaction ID',
          'Type',
          'Amount (£)',
          'Date',
          'Time',
          'Status',
          'Driver',
        ];
        const rows = allTransactions.map((txn) => [
          txn.id,
          txn.type,
          txn.amount.toFixed(2),
          txn.date,
          txn.time,
          txn.status,
          txn.driver?.name || 'N/A',
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Transactions_Export_${new Date().toISOString().split('T')[0]}.csv`,
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

export const useExportTransactionsPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllTransactions = useCallback(async (params: UseTransactionsParams) => {
    setIsExporting(true);
    try {
      let allTransactions: Transaction[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '50');

        if (params.search) {
          queryParams.append('search', params.search);
        }

        const response = await apiClient.get<TransactionResponse>(
          `${API.TRANSACTIONS}?${queryParams.toString()}`,
        );

        if (response.data && response.data.success) {
          const results = response.data.data.results.map((item) => ({
            ...item,
            id: item.transactionId,
            type: mapType(item.type),
            status: mapStatus(item.status),
            date: item.createdAt.substring(0, 10),
            time: item.createdAt.substring(11, 16),
          }));

          allTransactions = [...allTransactions, ...results];
          totalPages = response.data.data.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      return allTransactions;
    } catch (err) {
      console.error('Failed to fetch transactions for PDF:', err);
      return [];
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { fetchAllTransactions, isExporting, setIsExporting };
};
