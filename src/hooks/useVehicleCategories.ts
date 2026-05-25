import axios, { type AxiosError } from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { VehicleCategory, VehicleCategoryResponse } from '@/types/vehicle.types';

interface ApiErrorResponse {
  message?: string;
}

const getCategoryErrorMessage = (err: unknown, fallback: string) => {
  const error = err as AxiosError<ApiErrorResponse>;
  const message = axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : err instanceof Error
      ? err.message
      : '';
  const normalized = message.toLowerCase();

  if (normalized.includes('order') && normalized.includes('duplicate')) {
    return 'This display order is already used by another category.';
  }

  if (
    normalized.includes('order') &&
    (normalized.includes('already') || normalized.includes('unique') || normalized.includes('used'))
  ) {
    return 'This display order is already used by another category.';
  }

  if (
    normalized.includes('7') &&
    (normalized.includes('max') ||
      normalized.includes('maximum') ||
      normalized.includes('limit') ||
      normalized.includes('allowed'))
  ) {
    return 'Only 7 vehicle categories are allowed.';
  }

  return message || fallback;
};

export const useVehicleCategories = () => {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
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
          order: item.order,
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
      setError(getCategoryErrorMessage(err, 'Failed to fetch categories'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, payload: Partial<VehicleCategory>) => {
      setIsUpdating(true);
      try {
        const apiPayload = {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.basePrice !== undefined && { baseFare: payload.basePrice }),
          ...(payload.pricePerMile !== undefined && { pricePerMile: payload.pricePerMile }),
          ...(payload.pricePerMinute !== undefined && { pricePerMinute: payload.pricePerMinute }),
          ...(payload.seats !== undefined && { seatCapacity: payload.seats }),
          ...(payload.categoryIcon !== undefined && { categoryIcon: payload.categoryIcon }),
          ...(payload.vehicleType !== undefined && { vehicleType: payload.vehicleType }),
          ...(payload.order !== undefined && { order: payload.order }),
        };
        await apiClient.patch(API.UPDATE_CATEGORY(id), apiPayload);
        fetchCategories();
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(err, 'Failed to update category');
        setError(message);
        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchCategories],
  );

  const createCategory = useCallback(
    async (payload: Partial<VehicleCategory>) => {
      setIsCreating(true);
      try {
        const apiPayload = {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.basePrice !== undefined && { baseFare: payload.basePrice }),
          ...(payload.pricePerMile !== undefined && { pricePerMile: payload.pricePerMile }),
          ...(payload.pricePerMinute !== undefined && { pricePerMinute: payload.pricePerMinute }),
          ...(payload.seats !== undefined && { seatCapacity: payload.seats }),
          ...(payload.categoryIcon !== undefined && { categoryIcon: payload.categoryIcon }),
          ...(payload.vehicleType !== undefined && { vehicleType: payload.vehicleType }),
          ...(payload.order !== undefined && { order: payload.order }),
        };
        await apiClient.post(API.CREATE_CATEGORY, apiPayload);
        fetchCategories();
      } catch (err: unknown) {
        const message = getCategoryErrorMessage(err, 'Failed to create category');
        setError(message);
        throw new Error(message);
      } finally {
        setIsCreating(false);
      }
    },
    [fetchCategories],
  );

  const removeCategory = useCallback(
    async (id: string) => {
      setIsRemoving(true);
      try {
        await apiClient.delete(API.REMOVE_CATEGORY(id));
        fetchCategories();
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to remove category');
        throw error;
      } finally {
        setIsRemoving(false);
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
    isCreating,
    isUpdating,
    isRemoving,
    error,
    refetch: fetchCategories,
    updateCategory,
    createCategory,
    removeCategory,
  };
};
