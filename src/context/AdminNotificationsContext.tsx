import type { AxiosError } from 'axios';
import { useCallback, useState, type ReactNode } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  AdminNotification,
  AdminNotificationBasicResponse,
  AdminNotificationMarkReadResponse,
  AdminNotificationUnreadCountResponse,
  AdminNotificationsListResponse,
} from '@/types/notification.types';

import { AdminNotificationsContext } from './adminNotificationsContextDef';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

interface ApiError {
  message: string;
}

export const AdminNotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<AdminNotificationsListResponse>(
        `${API.ADMIN_NOTIFICATIONS}?page=1&limit=20`,
      );
      setNotifications(data.data.results);
    } catch {
      // silent on background fetch
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await apiClient.get<AdminNotificationUnreadCountResponse>(
        API.ADMIN_NOTIFICATIONS_UNREAD_COUNT,
      );
      setUnreadCount(data.data.unreadCount);
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const { data } = await apiClient.patch<AdminNotificationMarkReadResponse>(
          API.ADMIN_NOTIFICATION_MARK_READ(id),
        );
        const updated = data.data.notification;
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, ...updated, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        showToast(error.response?.data?.message || 'Failed to mark as read.', 'error');
      }
    },
    [showToast],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.patch<AdminNotificationBasicResponse>(API.ADMIN_NOTIFICATIONS_MARK_ALL_READ);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      showToast(error.response?.data?.message || 'Failed to mark all as read.', 'error');
    }
  }, [showToast]);

  const clearAll = useCallback(async () => {
    try {
      await apiClient.delete<AdminNotificationBasicResponse>(API.ADMIN_NOTIFICATIONS);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      showToast(error.response?.data?.message || 'Failed to clear notifications.', 'error');
    }
  }, [showToast]);

  return (
    <AdminNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </AdminNotificationsContext.Provider>
  );
};
