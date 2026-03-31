import { useState, useEffect, useCallback, useMemo } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  Rider,
  RiderResponse,
  RiderDetailsResponse,
  RiderSummary,
  RiderSummaryResponse,
  SpendingTrendItem,
  RiderSpendingTrendResponse,
} from '@/types/rider.types';

interface RiderFilters {
  status?: string;
  minSpend?: number;
  maxSpend?: number;
  minTrips?: number;
  maxTrips?: number;
  rating?: string;
}

export const useRiders = (
  initialFilters: RiderFilters = {},
  page: number = 1,
  limit: number = 10,
  searchQuery: string = '',
) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchRiders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if any filters are actually applied (not default)
      const hasAppliedFilters =
        (initialFilters.status && initialFilters.status !== 'All') ||
        (initialFilters.minSpend !== undefined && initialFilters.minSpend > 0) ||
        (initialFilters.maxSpend !== undefined && initialFilters.maxSpend < 1000) ||
        (initialFilters.minTrips !== undefined && initialFilters.minTrips > 0) ||
        (initialFilters.maxTrips !== undefined && initialFilters.maxTrips < 500) ||
        (initialFilters.rating && initialFilters.rating !== 'All');

      const params: Record<string, string | number | undefined> = {
        page,
        limit,
      };

      if (hasAppliedFilters) {
        if (initialFilters.status && initialFilters.status !== 'All') {
          params.status = initialFilters.status.toLowerCase();
        }

        if (initialFilters.minSpend !== undefined && initialFilters.minSpend > 0) {
          params.minSpend = initialFilters.minSpend;
        }
        if (initialFilters.maxSpend !== undefined && initialFilters.maxSpend < 1000) {
          params.maxSpend = initialFilters.maxSpend;
        }
        if (initialFilters.minTrips !== undefined && initialFilters.minTrips > 0) {
          params.minTrips = initialFilters.minTrips;
        }
        if (initialFilters.maxTrips !== undefined && initialFilters.maxTrips < 500) {
          params.maxTrips = initialFilters.maxTrips;
        }
        if (initialFilters.rating && initialFilters.rating !== 'All') {
          params.rating = String(initialFilters.rating)
            .toLowerCase()
            .replace(/ & /g, '_')
            .replace(/ /g, '_');
        }
      }

      const response = await apiClient.get<RiderResponse>(API.RIDERS, { params });
      const data = response.data;

      if (data && data.success) {
        setRiders(data.data.results || []);
        setTotalPages(data.data.totalPages || 0);
        setTotalResults(data.data.totalResults || 0);
      } else {
        setError(data?.message || 'Failed to fetch riders.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch riders');
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    initialFilters.status,
    initialFilters.minSpend,
    initialFilters.maxSpend,
    initialFilters.minTrips,
    initialFilters.maxTrips,
    initialFilters.rating,
  ]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  // Client-side search logic (matching useDriver pattern)
  const filteredRiders = useMemo(() => {
    if (!searchQuery) return riders;
    const query = searchQuery.toLowerCase();
    return riders.filter(
      (rider) =>
        rider.name?.toLowerCase().includes(query) ||
        rider.email?.toLowerCase().includes(query) ||
        rider.phone?.includes(query),
    );
  }, [riders, searchQuery]);

  return {
    riders: filteredRiders,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchRiders,
  };
};

export const useRiderDetails = (id: string | undefined) => {
  const [rider, setRider] = useState<Rider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiderDetails = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RiderDetailsResponse>(API.RIDER_DETAILS(id));
      if (response.data?.success && response.data?.data?.user) {
        setRider(response.data.data.user);
      } else {
        setError(response.data?.message || 'Failed to fetch rider details.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch rider details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRiderDetails();
  }, [fetchRiderDetails]);

  return { rider, loading, error, refetch: fetchRiderDetails };
};

export const useUpdateRiderStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (riderIds: string[], status: string, suspendReason?: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const payload: Record<string, string | string[]> = {
        riderIds,
        status: status.toLowerCase(),
      };

      if (status.toLowerCase() === 'suspended' && suspendReason) {
        payload.suspendReason = suspendReason;
      }

      const response = await apiClient.patch(API.RIDER_BULK_STATUS, payload);
      if (response.data?.success) {
        return true;
      }
      return false;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Failed to update status';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating, error };
};

export const useRiderSummary = (riderId: string | undefined) => {
  const [summary, setSummary] = useState<RiderSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!riderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RiderSummaryResponse>(API.RIDER_SUMMARY, {
        params: { riderId },
      });
      if (response.data?.success) {
        setSummary(response.data.data);
      } else {
        setError(response.data?.message || 'Failed to fetch summary');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [riderId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};

export const useRiderSpendingTrend = (riderId: string | undefined, type: string) => {
  const [trend, setTrend] = useState<SpendingTrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    if (!riderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RiderSpendingTrendResponse>(API.RIDER_SPENDING_TREND, {
        params: { riderId, type },
      });
      if (response.data?.success) {
        setTrend(response.data.data);
      } else {
        setError(response.data?.message || 'Failed to fetch trend');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch trend');
    } finally {
      setLoading(false);
    }
  }, [riderId, type]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { trend, loading, error, refetch: fetchTrend };
};

export const useExportRidersCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(async (filters: RiderFilters = {}) => {
    setIsExporting(true);
    try {
      let allRiders: Rider[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: 20,
        };

        if (filters.status && filters.status !== 'All') {
          params.status = filters.status.toLowerCase();
        }

        const response = await apiClient.get<RiderResponse>(API.RIDERS, { params });
        if (response.data && response.data.success) {
          const results = response.data.data.results || [];
          allRiders = [...allRiders, ...results];
          totalPages = response.data.data.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      if (allRiders.length > 0) {
        const headers = [
          'Rider ID',
          'Name',
          'Email',
          'Phone',
          'Total Trips',
          'Total Spent (£)',
          'Rating',
          'Status',
        ];
        const rows = allRiders.map((rider) => [
          rider.id,
          rider.name,
          rider.email || '',
          rider.phone,
          rider.totalTrips || 0,
          (rider.totalSpent || 0).toFixed(2),
          (rider.rating || 0).toFixed(1),
          rider.status,
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Riders_Export_${new Date().toISOString().split('T')[0]}.csv`,
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

export const useExportRidersPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllRiders = useCallback(async (filters: RiderFilters = {}) => {
    setIsExporting(true);
    try {
      let allRiders: Rider[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: 20,
        };

        if (filters.status && filters.status !== 'All') {
          params.status = filters.status.toLowerCase();
        }

        const response = await apiClient.get<RiderResponse>(API.RIDERS, { params });
        if (response.data && response.data.success) {
          const results = response.data.data.results || [];
          allRiders = [...allRiders, ...results];
          totalPages = response.data.data.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      return allRiders;
    } catch (err) {
      console.error('Failed to fetch riders for PDF:', err);
      return [];
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { fetchAllRiders, isExporting, setIsExporting };
};

// ── Use useTrips.ts for ride-related hooks ─────────────────────────
