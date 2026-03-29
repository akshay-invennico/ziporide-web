import { type AxiosError } from 'axios';
import { useState, useEffect, useCallback, useMemo } from 'react';

import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  Operator,
  OperatorListResponse,
  OperatorMutationResponse,
  CreateOperatorPayload,
  UpdateOperatorPayload,
  PermissionsResponse,
} from '@/types/operator.types';

interface ApiError {
  message: string;
}

export const useOperators = (page: number = 1, limit: number = 10, searchQuery: string = '') => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchOperators = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, limit };
      const response = await apiClient.get<OperatorListResponse>(API.OPERATORS, { params });
      if (response.data?.success) {
        setOperators(response.data.data.results || []);
        setTotalPages(response.data.data.totalPages || 0);
        setTotalResults(response.data.data.totalResults || 0);
      } else {
        setError(response.data?.message || 'Failed to fetch operators.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch operators');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchOperators();
  }, [fetchOperators]);

  const filteredOperators = useMemo(() => {
    if (!searchQuery) return operators;
    const query = searchQuery.toLowerCase();
    return operators.filter(
      (op) =>
        op.name?.toLowerCase().includes(query) ||
        op.email?.toLowerCase().includes(query) ||
        op.operatorId?.toLowerCase().includes(query),
    );
  }, [operators, searchQuery]);

  return {
    operators: filteredOperators,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchOperators,
  };
};

export const useCreateOperator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  const createOperator = async (payload: CreateOperatorPayload) => {
    setIsCreating(true);
    try {
      const response = await apiClient.post<OperatorMutationResponse>(API.OPERATORS, payload);
      if (response.data?.success) {
        showToast('Operator created successfully!', 'success');
        return response.data.data.operator;
      }
      throw new Error(response.data?.message || 'Failed to create operator');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to create operator';
      showToast(message, 'error');
      throw new Error(message);
    } finally {
      setIsCreating(false);
    }
  };

  return { createOperator, isCreating };
};

export const useUpdateOperator = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  const updateOperator = async (id: string, payload: UpdateOperatorPayload) => {
    setIsUpdating(true);
    try {
      const response = await apiClient.patch<OperatorMutationResponse>(
        API.OPERATOR_DETAILS(id),
        payload,
      );
      if (response.data?.success) {
        showToast('Operator updated successfully!', 'success');
        return response.data.data.operator;
      }
      throw new Error(response.data?.message || 'Failed to update operator');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to update operator';
      showToast(message, 'error');
      throw new Error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateOperator, isUpdating };
};

export const useDeleteOperator = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const deleteOperator = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await apiClient.delete(API.OPERATOR_DETAILS(id));
      if (response.data?.success) {
        showToast('Operator removed successfully!', 'success');
        return true;
      }
      throw new Error(response.data?.message || 'Failed to remove operator');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to remove operator';
      showToast(message, 'error');
      throw new Error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteOperator, isDeleting };
};

export const usePermissionConfig = () => {
  const [config, setConfig] = useState<PermissionsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<PermissionsResponse>(API.OPERATOR_PERMISSIONS);
      if (response.data?.success) {
        setConfig(response.data.data);
      }
    } catch {
      // Silently fail — fall back to hardcoded permissions
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, refetch: fetchConfig };
};
