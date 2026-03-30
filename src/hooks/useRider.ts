import { useState, useEffect, useCallback, useMemo } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { Rider, RiderResponse, RiderDetailsResponse } from '@/types/rider.types';

interface RiderFilters {
  status?: string;
  minSpent?: number;
  maxSpent?: number;
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
        (initialFilters.minSpent !== undefined && initialFilters.minSpent > 0) ||
        (initialFilters.maxSpent !== undefined && initialFilters.maxSpent < 1000) ||
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

        if (initialFilters.minSpent !== undefined && initialFilters.minSpent > 0) {
          params.minSpent = initialFilters.minSpent;
        }
        if (initialFilters.maxSpent !== undefined && initialFilters.maxSpent < 1000) {
          params.maxSpent = initialFilters.maxSpent;
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
    initialFilters.minSpent,
    initialFilters.maxSpent,
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

// ── Use useTrips.ts for ride-related hooks ─────────────────────────
