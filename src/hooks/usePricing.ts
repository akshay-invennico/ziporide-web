import type { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type { PricingData, PricingResponse } from '@/types/pricing.types';

interface ApiError {
  message: string;
}

export const usePricing = () => {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const getPricing = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<PricingResponse>(API.PRICING);
      setPricing(data.data.pricing);
      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to fetch pricing.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const updatePricing = async (payload: PricingData) => {
    setIsLoading(true);
    try {
      const { id: _id, ...dataToUpdate } = payload;
      await apiClient.put(API.PRICING, dataToUpdate);
      showToast('Pricing updated successfully!', 'success');
      await getPricing(); // Refresh data
      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to update pricing.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pricing,
    isLoading,
    getPricing,
    updatePricing,
    setPricing,
  };
};
