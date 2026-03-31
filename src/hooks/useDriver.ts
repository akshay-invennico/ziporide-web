import { useState, useEffect, useCallback, useMemo } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  Driver,
  DriverResponse,
  DriverSubscriptionsResponse,
  DriverEarningsResponse,
  RidesResponse,
  TripRecord,
  RawRideData,
  FrontendEarningData,
  BackendEarningReport,
} from '@/types/driver.types';

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
        !!initialFilters.status || // Any status counts as a filter to use the specialized endpoint
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
          // Map 'All' to 'approvedDrivers' for the combined list
          if (s === 'all') {
            params.status = 'approvedDrivers';
          } else if (s === 'active' || s === 'approved') {
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
export const useDriverSubscriptions = (id: string | undefined) => {
  const [data, setData] = useState<DriverSubscriptionsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apiClient.get<DriverSubscriptionsResponse>(
        API.DRIVER_SUBSCRIPTIONS(id),
      );
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(response.data?.message || 'Failed to fetch subscriptions');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return { data, loading, error, refetch: fetchSubscriptions };
};

export const useDriverEarnings = (id: string | undefined, range: string = 'year') => {
  const [data, setData] = useState<FrontendEarningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apiClient.get<DriverEarningsResponse>(API.DRIVER_EARNINGS(id), {
        params: { range },
      });
      if (response.data?.success && response.data.data) {
        const backendData = response.data.data;
        // Map backend structure to frontend expectation
        const mappedData: FrontendEarningData = {
          totalTrips: backendData.summary.totalTrips,
          totalEarnings: backendData.summary.totalEarnings,
          avgTripValue: backendData.summary.averageTripValue,
          acceptanceRate: backendData.summary.acceptanceRate,
          chartData: (backendData.report || []).map((item: BackendEarningReport) => ({
            month: item.label,
            earnings: item.amount,
            rides: item.tripCount,
          })),
        };
        setData(mappedData);
      } else {
        setError(response.data?.message || 'Failed to fetch earnings');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  }, [id, range]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return { data, loading, error, refetch: fetchEarnings };
};

// ── Mapping Helper ────────────────────────────────────────────────────────────

/**
 * Maps the complex nested backend trip response to the simplified TripRecord structure
 * used by the UI components (Modal, Tables, etc.)
 */
export const mapBackendTripToFrontend = (t: RawRideData): TripRecord => {
  // Status mapping for legacy components and badges
  let statusLabel = 'Assigned';
  const s = (t.status || '').toLowerCase();
  if (s === 'completed') statusLabel = 'Completed';
  else if (s === 'cancelled') statusLabel = 'Cancelled';
  else if (['driver_arrived', 'started', 'arrived', 'in_progress', 'on_the_way'].includes(s)) {
    statusLabel = 'In Progress';
  }

  // Format Date and Time from rideTimestamps.bookedAt
  const bookedAt = t.rideTimestamps?.bookedAt;
  const dateStr = bookedAt
    ? new Date(bookedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';
  const timeStr = bookedAt
    ? new Date(bookedAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'N/A';

  return {
    ...t,
    id: t.rideNumber || t.id,
    rideId: t.id,
    status: statusLabel,
    date: dateStr,
    time: timeStr,
    distance: t.distanceKm || 0,
    estimatedTime: t.durationMinutes || 0,
    totalFare: t.fare?.totalFare || 0,
    baseFare: t.fare?.baseFare || 0,
    distanceFare: t.fare?.distanceFare || 0,
    waitingCharge: t.fare?.waitingCharge || 0,
    amount: t.fare?.totalFare || 0,
    route: {
      pickupLocation: t.pickup?.address || 'N/A',
      stop1Location: t.stops?.[0]?.address || '',
      destination: t.destination?.address || 'N/A',
    },
    rider: t.rider
      ? {
          id: t.rider.id || 'N/A',
          name: t.rider.name || 'Unknown Rider',
          phone: t.rider.phone || 'N/A',
          avatar: t.rider.avatar || '',
          initials: t.rider.initials || (t.rider.name ? t.rider.name.charAt(0) : 'U'),
          rating: typeof t.rider.rating === 'number' ? t.rider.rating : 5.0,
        }
      : {
          id: 'N/A',
          name: 'Unknown Rider',
          phone: 'N/A',
          avatar: '',
          initials: 'U',
          rating: 5.0,
        },
    driver: t.driver
      ? {
          id: t.driver.id || 'N/A',
          name: t.driver.name?.trim() || 'Unknown Driver',
          phone: t.driver.phone || 'N/A',
          avatar: t.driver.profilePhotoUrl || t.driver.avatar || '',
          initials: t.driver.name
            ? t.driver.name
                .split(' ')
                .map((w: string) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : 'D',
          rating:
            typeof t.driver.avgRating === 'number'
              ? t.driver.avgRating
              : typeof t.driver.rating === 'number'
                ? t.driver.rating
                : 0.0,
          vehicle: t.driver.vehicle
            ? {
                name:
                  `${t.driver.vehicle.make || ''} ${t.driver.vehicle.model || ''}`.trim() ||
                  'Standard',
                color: 'N/A',
                registrationNumber: t.driver.vehicle.registrationNumber || 'N/A',
                photo: t.driver.vehicle.photo || '',
              }
            : {
                name: 'Standard',
                color: 'N/A',
                registrationNumber: 'N/A',
                photo: '',
              },
        }
      : {
          id: 'N/A',
          name: 'No Driver Assigned',
          phone: 'N/A',
          avatar: '',
          initials: 'ND',
          rating: 0,
          vehicle: { name: 'Standard', color: 'N/A', registrationNumber: 'N/A', photo: '' },
        },
    cancellationDetails: t.cancellation
      ? {
          cancelledBy: t.cancellation.cancelledBy || 'rider',
          reason: t.cancellation.reason || 'N/A',
          tripStage: 'N/A',
          fee: t.fare?.cancellationFee || 0,
          waitingCharge: t.fare?.waitingCharge || 0,
        }
      : undefined,
    payment: {
      method: t.paymentMethod?.card?.brand || 'Visa',
      last4: t.paymentMethod?.card?.last4 || '4242',
    },
  };
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export const useDriverTrips = (
  driverId: string | undefined,
  dateFilter?: string,
  page: number = 1,
  limit: number = 12,
) => {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTrips = useCallback(async () => {
    if (!driverId) return;
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        driverId,
        page,
        limit,
      };
      if (dateFilter && dateFilter !== 'Year') {
        params.dateFilter =
          dateFilter === 'This Month'
            ? 'currentMonth'
            : dateFilter === 'This Week'
              ? 'currentWeek'
              : dateFilter;
      }

      const response = await apiClient.get<RidesResponse>(API.ADMIN_TRIPS, { params });
      if (response.data?.success) {
        // Transform real API data to the format expected by TripRecord/Components
        const mappedTrips = (response.data.data.results || []).map(mapBackendTripToFrontend);

        setTrips(mappedTrips);
        setTotalPages(response.data.data.totalPages || 0);
      } else {
        setError(response.data?.message || 'Failed to fetch trips');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, [driverId, dateFilter, page, limit]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, totalPages, refetch: fetchTrips };
};

export const useTripDetails = (tripId: string | undefined) => {
  const [trip, setTrip] = useState<TripRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(
    async (idOverride?: string) => {
      const id = idOverride || tripId;
      if (!id) return null;
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{
          success: boolean;
          data: { ride: RawRideData };
          message?: string;
        }>(API.ADMIN_TRIP_DETAILS(id));
        if (response.data?.success) {
          const mapped = mapBackendTripToFrontend(response.data.data.ride);
          setTrip(mapped);
          return mapped;
        } else {
          setError(response.data?.message || 'Failed to fetch trip details');
          return null;
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        setError(error.response?.data?.message || error.message || 'Failed to fetch trip details');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tripId],
  );

  useEffect(() => {
    if (tripId) fetchDetails();
  }, [tripId, fetchDetails]);

  return { trip, loading, error, fetchDetails };
};

export const useExportDriversCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(async (filters: DriverFilters = {}) => {
    setIsExporting(true);
    try {
      let allDrivers: Driver[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: 20,
        };

        const hasAppliedFilters =
          !!filters.status ||
          (filters.minEarnings !== undefined && filters.minEarnings > 0) ||
          (filters.maxEarnings !== undefined && filters.maxEarnings < 1000) ||
          (filters.minTrips !== undefined && filters.minTrips > 0) ||
          (filters.maxTrips !== undefined && filters.maxTrips < 500) ||
          (filters.rating && filters.rating !== 'All');

        if (hasAppliedFilters) {
          if (filters.status) {
            const s = filters.status.toLowerCase();
            if (s === 'all') params.status = 'approvedDrivers';
            else if (s === 'active' || s === 'approved') params.status = 'approved';
            else if (s === 'suspended') params.status = 'suspended';
          }
          if (filters.minEarnings !== undefined && filters.minEarnings > 0)
            params.minEarnings = filters.minEarnings;
          if (filters.maxEarnings !== undefined && filters.maxEarnings < 1000)
            params.maxEarnings = filters.maxEarnings;
          if (filters.minTrips !== undefined && filters.minTrips > 0)
            params.minTrips = filters.minTrips;
          if (filters.maxTrips !== undefined && filters.maxTrips < 500)
            params.maxTrips = filters.maxTrips;
          if (filters.rating && filters.rating !== 'All') {
            params.rating = String(filters.rating)
              .toLowerCase()
              .replace(/ & /g, '_')
              .replace(/ /g, '_');
          }
        } else {
          params.page = currentPage;
          params.limit = 20;
        }

        const response = await apiClient.get<DriverResponse>(API.DRIVER, { params });
        if (response.data && response.data.success) {
          const results = response.data.data.results || [];
          allDrivers = [...allDrivers, ...results];
          totalPages = response.data.data.totalPages || 1;
          currentPage++;
          if (hasAppliedFilters) break;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      if (allDrivers.length > 0) {
        const headers = [
          'Driver ID',
          'Name',
          'Email',
          'Phone',
          'Total Trips',
          'Total Earnings (£)',
          'Rating',
          'Status',
        ];
        const rows = allDrivers.map((driver) => [
          driver.id || driver._id,
          driver.name || driver.driverName,
          driver.email || '',
          driver.phone,
          driver.totalTrips || 0,
          (driver.totalEarnings || driver.totalEarned || 0).toFixed(2),
          (driver.avgRating || driver.rating || 0).toFixed(1),
          driver.status,
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Drivers_Export_${new Date().toISOString().split('T')[0]}.csv`,
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

export const useExportDriversPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllDrivers = useCallback(async (filters: DriverFilters = {}) => {
    setIsExporting(true);
    try {
      let allDrivers: Driver[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: 20,
        };

        const hasAppliedFilters =
          !!filters.status ||
          (filters.minEarnings !== undefined && filters.minEarnings > 0) ||
          (filters.maxEarnings !== undefined && filters.maxEarnings < 1000) ||
          (filters.minTrips !== undefined && filters.minTrips > 0) ||
          (filters.maxTrips !== undefined && filters.maxTrips < 500) ||
          (filters.rating && filters.rating !== 'All');

        if (hasAppliedFilters) {
          if (filters.status) {
            const s = filters.status.toLowerCase();
            if (s === 'all') params.status = 'approvedDrivers';
            else if (s === 'active' || s === 'approved') params.status = 'approved';
            else if (s === 'suspended') params.status = 'suspended';
          }
          if (filters.minEarnings !== undefined && filters.minEarnings > 0)
            params.minEarnings = filters.minEarnings;
          if (filters.maxEarnings !== undefined && filters.maxEarnings < 1000)
            params.maxEarnings = filters.maxEarnings;
          if (filters.minTrips !== undefined && filters.minTrips > 0)
            params.minTrips = filters.minTrips;
          if (filters.maxTrips !== undefined && filters.maxTrips < 500)
            params.maxTrips = filters.maxTrips;
          if (filters.rating && filters.rating !== 'All') {
            params.rating = String(filters.rating)
              .toLowerCase()
              .replace(/ & /g, '_')
              .replace(/ /g, '_');
          }
        } else {
          params.page = currentPage;
          params.limit = 20;
        }

        const response = await apiClient.get<DriverResponse>(API.DRIVER, { params });
        if (response.data && response.data.success) {
          const results = response.data.data.results || [];
          allDrivers = [...allDrivers, ...results];
          totalPages = response.data.data.totalPages || 1;
          currentPage++;
          if (hasAppliedFilters) break;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      return allDrivers;
    } catch (err) {
      console.error('Failed to fetch drivers for PDF:', err);
      return [];
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { fetchAllDrivers, isExporting, setIsExporting };
};
