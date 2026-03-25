import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { VehicleCategory, VehicleCategoryResponse } from '@/types/vehicle.types';

export const useVehicleCategories = () => {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<VehicleCategoryResponse>(API.VEHICLE_CATEGORIES);
      const data = response.data;
      if (data && data.success && Array.isArray(data.data?.results)) {
        const mapped: VehicleCategory[] = data.data.results.map((item) => ({
          id: item.id,
          name: item.name,
          seats: item.seatCapacity,
          basePrice: item.baseFare,
          image: item.categoryIcon,
          pricePerMile: item.pricePerMile,
          pricePerMinute: item.pricePerMinute,
          vehicleType: item.vehicleType,
        }));
        setCategories(mapped);
      } else if (data && data.success && !Array.isArray(data.data?.results)) {
        setError(
          'API returned categories in an unexpected format (results missing or not an array).',
        );
      } else {
        setError(data?.message || 'Failed to fetch categories.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, payload: Partial<VehicleCategory>) => {
      try {
        await apiClient.patch(API.UPDATE_CATEGORY(id), payload);
        fetchCategories(); // Reload list after update
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to update category');
      }
    },
    [fetchCategories],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories, updateCategory };
};
