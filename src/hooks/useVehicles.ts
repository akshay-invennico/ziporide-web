import { useState, useEffect, useCallback, useMemo } from 'react';

import type { VehicleDatabaseRow } from '@/data/VehicleDatabaseData';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { VehiclesResponse, ApiVehicle } from '@/types/vehicle.types';

export const useVehicles = (
  page: number = 1,
  limit: number = 20,
  searchQuery: string = '',
  enabled: boolean = true,
) => {
  const [vehicles, setVehicles] = useState<VehicleDatabaseRow[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchVehicles = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      const response = await apiClient.get<VehiclesResponse>(API.VEHICLES, { params });
      const data = response.data;

      if (data && data.success) {
        const mapped: VehicleDatabaseRow[] = (data.data.results || []).map((item: ApiVehicle) => ({
          id: item._id,
          name: `${item.vehicle.make} ${item.vehicle.model}`.trim() || 'Unknown Vehicle',
          year: item.vehicle.year,
          color: item.vehicle.color || 'N/A',
          image: item.vehicle.category || '/icons/vehicle/no_car.png', // Using category icon as vehicle image if available
          category: mapTypeToCategory(item.vehicle.type),
          licencePlate: item.vehicle.licensePlate,
          driver: {
            name: item.driver.name,
            phone: item.driver.phone,
            image: item.driver.profilePhotoUrl || 'https://i.pravatar.cc/150',
          },
          status: item.status === 'approved' ? 'Active' : 'Suspended',
        }));
        setVehicles(mapped);
        setTotalPages(data.data.totalPages || 0);
        setTotalResults(data.data.totalResults || 0);
      } else {
        setError(data?.message || 'Failed to fetch vehicles.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [page, limit, enabled]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return vehicles;
    const q = searchQuery.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.licencePlate.toLowerCase().includes(q) ||
        v.driver.name.toLowerCase().includes(q),
    );
  }, [vehicles, searchQuery]);

  return {
    vehicles: filteredVehicles,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchVehicles,
  };
};

const mapTypeToCategory = (type: string): VehicleDatabaseRow['category'] => {
  const t = type.toLowerCase();
  if (t === 'electric') return 'Electric';
  if (t === 'car') return 'Standard';
  if (t === 'xl') return 'XL';
  // Fallback to Standard if no match, as VehicleDatabaseRow['category'] is a union
  return 'Standard';
};
