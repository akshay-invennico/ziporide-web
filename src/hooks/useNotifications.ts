import type { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  GetNotificationsResponse,
  NotificationRecord,
  SendNotificationPayload,
  SendNotificationResponse,
} from '@/types/notification.types';

interface ApiError {
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();

  const getNotifications = useCallback(
    async (pageNum = 1, limit = 10) => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<GetNotificationsResponse>(API.NOTIFICATIONS, {
          params: { page: pageNum, limit, sortBy: 'createdAt:desc' },
        });
        setNotifications(data.data.results);
        setPage(data.data.page);
        setTotalPages(data.data.totalPages);
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const message = error.response?.data?.message || 'Failed to fetch notifications.';
        showToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  const sendNotification = async (payload: SendNotificationPayload) => {
    setIsSending(true);
    try {
      const { data } = await apiClient.post<SendNotificationResponse>(
        API.SEND_NOTIFICATION,
        payload,
      );
      showToast(data.message, 'success');
      await getNotifications(1);
      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to send notification.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    notifications,
    page,
    totalPages,
    isLoading,
    isSending,
    getNotifications,
    sendNotification,
  };
};
