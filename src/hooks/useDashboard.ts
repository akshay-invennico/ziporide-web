import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  DashboardSummary,
  RevenueAnalyticsResponse,
  RiderDriverReportResponse,
  TripsOverTimeResponse,
  RevenueAnalyticsItem,
  RiderDriverReportItem,
  TripsOverTimeItem,
} from '@/types/dashboard.types';

const apiTypeMap: Record<'Year' | 'Month', string> = { Year: 'month', Month: 'daily' };

export const useDashboardSummary = () => {
  const [data, setData] = useState<DashboardSummary['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<DashboardSummary>(API.DASHBOARD_SUMMARY);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard summary');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { data, loading, error, refetch: fetchSummary };
};

export const useRevenueAnalytics = (type: 'Year' | 'Month') => {
  const [data, setData] = useState<RevenueAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<RevenueAnalyticsResponse>(API.REVENUE_ANALYTICS, {
        params: { type: apiTypeMap[type] },
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch revenue analytics');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return { data, loading, error, refetch: fetchRevenue };
};

export const useRiderDriverReport = (type: 'Year' | 'Month') => {
  const [data, setData] = useState<RiderDriverReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<RiderDriverReportResponse>(API.RIDER_DRIVER_REPORT, {
        params: { type: apiTypeMap[type] },
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch rider driver report');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
};

export const useTripsOverTime = (type: 'Year' | 'Month') => {
  const [data, setData] = useState<TripsOverTimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<TripsOverTimeResponse>(API.TRIPS_OVER_TIME, {
        params: { type: apiTypeMap[type] },
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch trips over time');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { data, loading, error, refetch: fetchTrips };
};
