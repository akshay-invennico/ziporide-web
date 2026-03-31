import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { Transaction, TransactionResponse } from '@/types/transaction.types';

export interface UseTransactionsParams {
  page: number;
  limit: number;
  category: 'All' | 'Pay-in' | 'Payout' | 'Refund';
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

export const useTransactions = (
  initialParams: UseTransactionsParams = { page: 1, limit: 12, category: 'All', search: '' },
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

      if (params.category !== 'All') {
        queryParams.append('category', params.category.toLowerCase());
      }

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
          driver: item.driver
            ? {
                ...item.driver,
                avatar:
                  item.driver.avatar ||
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
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch transactions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(initialParams);
  }, [
    fetchTransactions,
    initialParams.page,
    initialParams.limit,
    initialParams.category,
    initialParams.search,
  ]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
  };
};
