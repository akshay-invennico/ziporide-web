import { useState, useEffect, useCallback, useMemo } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { Driver, DriverResponse } from '@/types/driver.types';

interface DriverFilters {
  minEarnings?: number;
  maxEarnings?: number;
  minTrips?: number;
  maxTrips?: number;
  rating?: string;
  status?: string;
}

interface DriverDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    driver: Driver;
  };
}

export const useDrivers = (
  initialFilters: DriverFilters = {},
  page: number = 1,
  limit: number = 10,
  searchQuery: string = '',
) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if any filters are actually applied (not default)
      const hasAppliedFilters =
        (initialFilters.status && initialFilters.status !== 'All') ||
        (initialFilters.minEarnings && initialFilters.minEarnings > 0) ||
        (initialFilters.maxEarnings && initialFilters.maxEarnings < 1000) ||
        (initialFilters.minTrips && initialFilters.minTrips > 0) ||
        (initialFilters.maxTrips && initialFilters.maxTrips < 500) ||
        (initialFilters.rating && initialFilters.rating !== 'All');

      const params: Record<string, string | number> = {};

      if (!hasAppliedFilters) {
        params.page = page;
        params.limit = limit;
      }

      const endpoint: string = API.DRIVER;

      if (hasAppliedFilters) {
        if (initialFilters.status) {
          const s = initialFilters.status.toLowerCase();
          // Map 'Active' or 'All' UI filters to 'approvedDrivers' API status
          if (s === 'active' || s === 'all') {
            // params.status = 'approvedDrivers';
            params.status = 'approved';
          } else if (s === 'suspended') {
            params.status = 'suspended';
          }
        }
        if (initialFilters.minEarnings && initialFilters.minEarnings > 0) {
          params.minEarnings = initialFilters.minEarnings;
        }
        if (initialFilters.maxEarnings && initialFilters.maxEarnings < 1000) {
          params.maxEarnings = initialFilters.maxEarnings;
        }
        if (initialFilters.minTrips && initialFilters.minTrips > 0) {
          params.minTrips = initialFilters.minTrips;
        }
        if (initialFilters.maxTrips && initialFilters.maxTrips < 500) {
          params.maxTrips = initialFilters.maxTrips;
        }
        if (initialFilters.rating && initialFilters.rating !== 'All') {
          params.rating = String(initialFilters.rating)
            .toLowerCase()
            .replace(/ & /g, '_')
            .replace(/ /g, '_');
        }
      }

      const response = await apiClient.get<DriverResponse>(endpoint, { params });
      const data = response.data;

      if (data && data.success) {
        setDrivers(data.data.results || []);
        setTotalPages(data.data.totalPages || 0);
        setTotalResults(data.data.totalResults || 0);
      } else {
        setError(data?.message || 'Failed to fetch drivers.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  }, [page, limit, initialFilters]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Client-side search logic
  const filteredDrivers = useMemo(() => {
    if (!searchQuery) return drivers;
    const query = searchQuery.toLowerCase();
    return drivers.filter(
      (driver) =>
        driver.name?.toLowerCase().includes(query) ||
        driver.email?.toLowerCase().includes(query) ||
        driver.phone?.includes(query),
    );
  }, [drivers, searchQuery]);

  return {
    drivers: filteredDrivers,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchDrivers,
  };
};

export const useDriverDetails = (id: string | undefined) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverDetails = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<DriverDetailsResponse>(API.DRIVER_DETAILS(id));
      if (response.data?.success && response.data?.data?.driver) {
        setDriver(response.data.data.driver);
      } else {
        setError(response.data?.message || 'Failed to fetch driver details.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch driver details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDriverDetails();
  }, [fetchDriverDetails]);

  return { driver, loading, error, refetch: fetchDriverDetails };
};

export const useUpdateDriverStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (driverIds: string[], status: string, suspendReason?: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const payload: Record<string, string | string[]> = {
        driverIds,
        // Map 'active' UI status to 'approved' API status
        status: status.toLowerCase() === 'active' ? 'approved' : status.toLowerCase(),
      };

      if (status.toLowerCase() === 'suspended' && suspendReason) {
        payload.suspendReason = suspendReason;
      }

      const response = await apiClient.patch(API.DRIVER_BULK_STATUS, payload);
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
