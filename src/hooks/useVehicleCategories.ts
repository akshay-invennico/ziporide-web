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
          categoryIcon: item.categoryIcon,
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
        const apiPayload = {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.basePrice !== undefined && { baseFare: payload.basePrice }),
          ...(payload.pricePerMile !== undefined && { pricePerMile: payload.pricePerMile }),
          ...(payload.pricePerMinute !== undefined && { pricePerMinute: payload.pricePerMinute }),
          ...(payload.seats !== undefined && { seatCapacity: payload.seats }),
          ...(payload.categoryIcon !== undefined && { categoryIcon: payload.categoryIcon }),
          ...(payload.vehicleType !== undefined && { vehicleType: payload.vehicleType }),
        };
        await apiClient.patch(API.UPDATE_CATEGORY(id), apiPayload);
        fetchCategories();
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to update category');
      }
    },
    [fetchCategories],
  );

  const createCategory = useCallback(
    async (payload: Partial<VehicleCategory>) => {
      try {
        const apiPayload = {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.basePrice !== undefined && { baseFare: payload.basePrice }),
          ...(payload.pricePerMile !== undefined && { pricePerMile: payload.pricePerMile }),
          ...(payload.pricePerMinute !== undefined && { pricePerMinute: payload.pricePerMinute }),
          ...(payload.seats !== undefined && { seatCapacity: payload.seats }),
          ...(payload.categoryIcon !== undefined && { categoryIcon: payload.categoryIcon }),
          ...(payload.vehicleType !== undefined && { vehicleType: payload.vehicleType }),
        };
        await apiClient.post(API.CREATE_CATEGORY, apiPayload);
        fetchCategories();
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to create category');
        throw error;
      }
    },
    [fetchCategories],
  );

  const removeCategory = useCallback(
    async (id: string) => {
      try {
        await apiClient.delete(API.REMOVE_CATEGORY(id));
        fetchCategories();
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to remove category');
        throw error;
      }
    },
    [fetchCategories],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    updateCategory,
    createCategory,
    removeCategory,
  };
};
