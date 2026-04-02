import type { AxiosError } from 'axios';
import { useState } from 'react';

import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  SendNotificationPayload,
  SendNotificationResponse,
} from '@/types/notification.types';

interface ApiError {
  message: string;
}

export const useNotifications = () => {
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();


  const sendNotification = async (payload: SendNotificationPayload) => {
    setIsSending(true);
    try {
      const { data } = await apiClient.post<SendNotificationResponse>(
        API.SEND_NOTIFICATION,
        payload,
      );
      showToast(data.message, 'success');
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
    isSending,
    sendNotification,
  };
};
