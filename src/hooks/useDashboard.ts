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
  DashboardChartFilters,
  DashboardChartFilterType,
} from '@/types/dashboard.types';

const apiTypeMap: Record<'Daily' | 'Weekly' | 'Month' | 'Year', string> = {
  Daily: 'daily',
  Weekly: 'weekly',
  Month: 'month',
  Year: 'year',
};

const getDashboardChartParams = (filters: DashboardChartFilters) => ({
  type: filters.type,
});

const getExpectedLabels = (type: DashboardChartFilterType) => {
  if (type === 'daily') {
    return Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, '0')}:00`);
  }

  if (type === 'week') {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  if (type === 'month') {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, day) => String(day + 1));
  }

  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
};

const normalizeChartData = <T extends { label: string }>(
  type: DashboardChartFilterType,
  data: T[],
  emptyItem: Omit<T, 'label'>,
) => {
  const dataByLabel = new Map(data.map((item) => [item.label, item]));

  return getExpectedLabels(type).map(
    (label) => dataByLabel.get(label) ?? ({ label, ...emptyItem } as T),
  );
};

export const useDashboardSummary = (type: DashboardChartFilterType = 'week') => {
  const [data, setData] = useState<DashboardSummary['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<DashboardSummary>(API.DASHBOARD_SUMMARY, {
        params: { type },
      });
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
  }, [type]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { data, loading, error, refetch: fetchSummary };
};

export const useRevenueAnalytics = (type: 'Daily' | 'Weekly' | 'Month' | 'Year') => {
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

export const useRiderDriverReport = (filters: DashboardChartFilters) => {
  const [data, setData] = useState<RiderDriverReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RiderDriverReportResponse>(API.RIDER_DRIVER_REPORT, {
        params: getDashboardChartParams(filters),
      });
      if (response.data.success) {
        setData(normalizeChartData(filters.type, response.data.data, { riders: 0, drivers: 0 }));
      } else {
        setError(response.data.message || 'Failed to fetch rider driver report');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
};

export const useTripsOverTime = (filters: DashboardChartFilters) => {
  const [data, setData] = useState<TripsOverTimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<TripsOverTimeResponse>(API.TRIPS_OVER_TIME, {
        params: getDashboardChartParams(filters),
      });
      if (response.data.success) {
        setData(normalizeChartData(filters.type, response.data.data, { trips: 0 }));
      } else {
        setError(response.data.message || 'Failed to fetch trips over time');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { data, loading, error, refetch: fetchTrips };
};
