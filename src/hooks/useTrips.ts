import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { RawRideData, TripRecord, RidesResponse } from '@/types/driver.types';

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
  else if (s === 'driver_allocated') statusLabel = 'Assigned';
  else if (['driver_arrived', 'started', 'in_progress', 'on_the_way'].includes(s)) {
    statusLabel = 'In Progress';
  }

  // Format Date and Time from rideTimestamps.bookedAt
  const bookedAt = t.rideTimestamps?.bookedAt;
  const dateStr = bookedAt ? new Date(bookedAt).toISOString().split('T')[0] : 'N/A';
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
          countryCode: t.rider.countryCode || '',
          avatar: t.rider.avatar || '',
          initials: t.rider.initials || (t.rider.name ? t.rider.name.charAt(0) : 'U'),
          rating: typeof t.rider.rating === 'number' ? t.rider.rating : 0,
        }
      : {
          id: 'N|A',
          name: 'Unknown Rider',
          phone: 'N/A',
          avatar: '',
          initials: 'U',
          rating: 0,
        },
    driver: t.driver
      ? {
          id: t.driver.id || 'N/A',
          name: t.driver.name?.trim() || 'Unknown Driver',
          phone: t.driver.phone || 'N/A',
          countryCode: t.driver.countryCode || '',
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

export const useTrips = (status?: string, page: number = 1, limit: number = 10) => {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (status && status !== 'All') {
        params.status =
          status === 'Assigned' ? 'driver_allocated' : status.toLowerCase().replace(/ /g, '_');
      }

      const response = await apiClient.get<RidesResponse>(API.ADMIN_TRIPS, { params });

      if (response.data && response.data.success) {
        const mappedTrips = (response.data.data.results || []).map(mapBackendRideToTripRecord);
        setTrips(mappedTrips);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalResults(response.data.data.totalResults || 0);
      } else {
        setError(response.data?.message || 'Failed to fetch trips.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, [status, page, limit]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchTrips,
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

      if (dateFilter) {
        params.dateFilter =
          dateFilter === 'Year'
            ? 'currentYear'
            : dateFilter === 'This Month'
              ? 'currentMonth'
              : dateFilter === 'This Week'
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

export const useTripDetails = (rideId: string | undefined) => {
  const [trip, setTrip] = useState<TripRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTripDetails = useCallback(async () => {
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
        setTrip(mapped);
      } else {
        setError(response.data?.message || 'Failed to fetch trip details.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  return { trip, loading, error, refetch: fetchTripDetails };
};

export const useRideDetails = useTripDetails;

export const useCancelTrip = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelTrip = async (rideId: string, cancelReason: string) => {
    setIsCancelling(true);
    setError(null);
    try {
      const response = await apiClient.post(API.CANCEL_RIDE(rideId), {
        cancelReason,
      });

      if (response.data?.success) {
        return true;
      } else {
        setError(response.data?.message || 'Failed to cancel the trip.');
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Failed to cancel trip';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return { cancelTrip, isCancelling, error };
};

export const useCancelRide = useCancelTrip;

export const useExportTripsCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = async (status?: string) => {
    setIsExporting(true);
    try {
      let allMappedTrips: TripRecord[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: 20,
        };

        if (status && status !== 'All') {
          params.status =
            status === 'Assigned' ? 'driver_allocated' : status.toLowerCase().replace(/ /g, '_');
        }

        const response = await apiClient.get<RidesResponse>(API.ADMIN_TRIPS, { params });
        if (response.data?.success) {
          const results = response.data.data.results || [];
          const mapped = results.map(mapBackendRideToTripRecord);
          allMappedTrips = [...allMappedTrips, ...mapped];
          totalPages = response.data.data.totalPages || 0;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      if (allMappedTrips.length > 0) {
        // Define CSV Headers
        const headers = [
          'Trip ID',
          'Rider Name',
          'Rider Phone',
          'Driver Name',
          'Driver Phone',
          'Pickup Location',
          'Destination',
          'Amount (£)',
          'Date',
          'Time',
          'Status',
        ];

        // Map data to rows
        const rows = allMappedTrips.map((trip) => [
          trip.id,
          trip.rider.name,
          trip.rider.phone,
          trip.driver.name,
          trip.driver.phone,
          `"${trip.route.pickupLocation.replace(/"/g, '""')}"`,
          `"${trip.route.destination.replace(/"/g, '""')}"`,
          trip.amount.toFixed(2),
          trip.date,
          trip.time,
          trip.status,
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Trips_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
    } catch (err) {
      console.error('CSV Export failed:', err);
    } finally {
      setIsExporting(false);
    }
    return false;
  };

  return { exportCSV, isExporting };
};

export const useExportTripsPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllTrips = async (status?: string) => {
    try {
      let allMappedTrips: TripRecord[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: 20,
        };

        if (status && status !== 'All') {
          params.status =
            status === 'Assigned' ? 'driver_allocated' : status.toLowerCase().replace(/ /g, '_');
        }

        const response = await apiClient.get<RidesResponse>(API.ADMIN_TRIPS, { params });
        if (response.data?.success) {
          const results = response.data.data.results || [];
          const mapped = results.map(mapBackendRideToTripRecord);
          allMappedTrips = [...allMappedTrips, ...mapped];
          totalPages = response.data.data.totalPages || 0;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      return allMappedTrips;
    } catch (err) {
      console.error('Failed to fetch trips for PDF:', err);
    }
    return [];
  };

  return { fetchAllTrips, isExporting, setIsExporting };
};
