import { createContext } from 'react';

import type { AdminNotification } from '@/types/notification.types';

export interface AdminNotificationsContextValue {
  notifications: AdminNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export const AdminNotificationsContext = createContext<AdminNotificationsContextValue | null>(null);
