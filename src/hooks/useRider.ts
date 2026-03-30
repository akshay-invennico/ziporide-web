import { useState, useEffect, useCallback, useMemo } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { RawRideData, TripRecord, RidesResponse } from '@/types/driver.types';
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

// ── Mapping Helper (Rider specific but consistent) ─────────────────────────

/**
 * Maps the backend ride response to the simplified TripRecord structure
 * used by the UI components (Modal, Tables, etc.)
 */
export const mapBackendRideToTripRecord = (t: RawRideData): TripRecord => {
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

export const useRiderTrips = (
  riderId: string | undefined,
  dateFilter: string = 'Year',
  page: number = 1,
  limit: number = 10,
) => {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchRiderTrips = useCallback(async () => {
    if (!riderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        riderId,
        page,
        limit,
      };

      if (dateFilter && dateFilter !== 'Year') {
        params.dateFilter =
          dateFilter === 'This Month'
            ? 'currentMonth'
            : dateFilter === 'This Week'
              ? 'currentWeek'
              : dateFilter.toLowerCase() === 'month'
                ? 'currentMonth'
                : dateFilter.toLowerCase() === 'week'
                  ? 'currentWeek'
                  : dateFilter;
      }

      const response = await apiClient.get<RidesResponse>(API.ADMIN_TRIPS, { params });

      if (response.data && response.data.success) {
        const mappedTrips = (response.data.data.results || []).map(mapBackendRideToTripRecord);
        setTrips(mappedTrips);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalResults(response.data.data.totalResults || 0);
      } else {
        setError(response.data?.message || 'Failed to fetch rider trips.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch rider trips');
    } finally {
      setLoading(false);
    }
  }, [riderId, dateFilter, page, limit]);

  useEffect(() => {
    fetchRiderTrips();
  }, [fetchRiderTrips]);

  return {
    trips,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchRiderTrips,
  };
};

export const useRideDetails = (rideId: string | undefined) => {
  const [ride, setRide] = useState<TripRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRideDetails = useCallback(async () => {
    if (!rideId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { ride: RawRideData };
        message?: string;
      }>(API.ADMIN_TRIP_DETAILS(rideId));

      if (response.data?.success && response.data?.data?.ride) {
        const mapped = mapBackendRideToTripRecord(response.data.data.ride);
        setRide(mapped);
      } else {
        setError(response.data?.message || 'Failed to fetch ride details.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch ride details');
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRideDetails();
  }, [fetchRideDetails]);

  return { ride, loading, error, refetch: fetchRideDetails };
};

export const useCancelRide = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelRide = async (rideId: string, cancelReason: string) => {
    setIsCancelling(true);
    setError(null);
    try {
      const response = await apiClient.post(API.CANCEL_RIDE(rideId), {
        cancelReason,
      });

      if (response.data?.success) {
        return true;
      } else {
        setError(response.data?.message || 'Failed to cancel the ride.');
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Failed to cancel ride';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return { cancelRide, isCancelling, error };
};
