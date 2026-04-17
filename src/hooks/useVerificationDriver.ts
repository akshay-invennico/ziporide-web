import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '@/context/useAuth';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import { connectAdminSocket } from '@/lib/socket';
import type { Driver, DriverResponse } from '@/types/driver.types';
import type { AdminNotification } from '@/types/notification.types';

interface DriverDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    driver: Driver;
  };
}

// Hook for fetching all drivers for the verification list
export const useDrivers = (
  statusFilter?: string,
  initialPage: number = 1,
  initialLimit: number = 12,
  searchQuery: string = '',
) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchDrivers = useCallback(
    async (status?: string, page: number = 1, limit: number = 12, search: string = '') => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = {
          page,
          limit,
          sortBy: 'createdAt',
        };
        if (status && status !== 'All') {
          params.status = status.toLowerCase();
        }
        if (search) {
          params.search = search;
        }

        const response = await apiClient.get<DriverResponse>(API.DRIVER, { params });
        const data = response.data;

        if (data && data.success) {
          const results = data.data?.results || data.data || [];
          setDrivers(Array.isArray(results) ? results : []);
          setTotalPages(data.data?.totalPages || 0);
          setTotalResults(data.data?.totalResults || 0);
        } else {
          setError(data?.message || 'Failed to fetch drivers.');
        }
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to fetch drivers');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchDrivers(statusFilter, initialPage, initialLimit, searchQuery);
  }, [fetchDrivers, statusFilter, initialPage, initialLimit, searchQuery]);

  return {
    drivers,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchDrivers,
  };
};

// Hook for fetching a single driver's details
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
      const responseData = response.data;

      if (responseData && responseData.success && responseData.data?.driver) {
        setDriver(responseData.data.driver);
      } else {
        setError(responseData?.message || 'Failed to fetch driver details.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch driver details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDriverDetails();
  }, [fetchDriverDetails]);

  return {
    driver,
    loading,
    error,
    refetch: fetchDriverDetails,
  };
};

// Hook for approving/rejecting driver documents
export const useVerifyDriverDocument = (driverId: string | undefined) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyDocument = async (docType: string, isApproved: boolean, reason?: string) => {
    if (!driverId) return;

    setIsVerifying(true);
    setError(null);
    try {
      const payload = isApproved ? {} : { rejectedReason: reason };
      const response = await apiClient.patch(API.VERIFY_DOCUMENT(driverId, docType), payload);

      if (response.data?.success) {
        return true;
      }
      return false;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update verification status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const updateDriverStatus = async (action: 'approve' | 'reject', reason?: string) => {
    if (!driverId) return;

    setIsVerifying(true);
    setError(null);
    try {
      const payload = action === 'approve' ? { action: 'approve' } : { action: 'reject', reason };
      const response = await apiClient.patch(API.DRIVER_STATUS(driverId), payload);

      if (response.data?.success) {
        return true;
      }
      return false;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update driver status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyDocument,
    updateDriverStatus,
    isVerifying,
    error,
  };
};

const LIVE_COUNT_TRIGGER_TYPES = new Set([
  'driver_verification_submitted',
  'driver_approved',
  'new_driver_registration',
]);

export const usePendingDriverCount = () => {
  const { isAuthenticated, token } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCount = useCallback(async () => {
    try {
      const response = await apiClient.get<DriverResponse>(API.DRIVER, {
        params: { status: 'pending' },
      });
      if (response.data?.success) {
        const drivers = response.data.data?.results || response.data.data || [];
        setCount(Array.isArray(drivers) ? drivers.length : 0);
      }
    } catch (err) {
      console.error('Failed to fetch pending driver count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = connectAdminSocket(token);
    const handleNotification = ({ notification }: { notification: AdminNotification }) => {
      if (LIVE_COUNT_TRIGGER_TYPES.has(notification.type)) {
        fetchCount();
      }
    };
    socket.on('admin:notification', handleNotification);
    return () => {
      socket.off('admin:notification', handleNotification);
    };
  }, [isAuthenticated, token, fetchCount]);

  return { count, loading, refetch: fetchCount };
};

export const useExportVerificationCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useCallback(async (statusFilter?: string) => {
    setIsExporting(true);
    try {
      let allDrivers: Driver[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: 20,
        };
        if (statusFilter && statusFilter !== 'All') {
          params.status = statusFilter.toLowerCase();
        }

        const response = await apiClient.get<DriverResponse>(API.DRIVER, { params });
        if (response.data && response.data.success) {
          const results = response.data.data?.results || response.data.data || [];
          allDrivers = [...allDrivers, ...(Array.isArray(results) ? results : [])];
          totalPages = response.data.data?.totalPages || 1;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      if (allDrivers.length > 0) {
        const headers = ['Driver ID', 'Name', 'Email', 'Phone', 'Applied On', 'Status', 'Reason'];
        const rows = allDrivers.map((driver) => [
          driver.id || driver._id,
          driver.driverName || driver.name || 'Unknown',
          driver.email || '',
          driver.phone,
          driver.appliedOn || driver.createdAt
            ? new Date(driver.appliedOn || driver.createdAt!).toLocaleDateString('en-CA')
            : '-',
          driver.status,
          driver.reason || driver.rejectedReason || '',
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `Verification_Export_${new Date().toISOString().split('T')[0]}.csv`,
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

export const useExportVerificationPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const fetchAllDrivers = useCallback(async (statusFilter?: string) => {
    setIsExporting(true);
    try {
      let allDrivers: Driver[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params: Record<string, string | number> = {
          page: currentPage,
          limit: 20,
        };
        if (statusFilter && statusFilter !== 'All') {
          params.status = statusFilter.toLowerCase();
        }

        const response = await apiClient.get<DriverResponse>(API.DRIVER, { params });
        if (response.data && response.data.success) {
          const results = response.data.data?.results || response.data.data || [];
          allDrivers = [...allDrivers, ...(Array.isArray(results) ? results : [])];
          totalPages = response.data.data?.totalPages || 1;
          currentPage++;
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
