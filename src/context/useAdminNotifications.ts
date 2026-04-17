import { useContext } from 'react';

import {
  AdminNotificationsContext,
  type AdminNotificationsContextValue,
} from './adminNotificationsContextDef';

export const useAdminNotifications = (): AdminNotificationsContextValue => {
  const context = useContext(AdminNotificationsContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationsProvider');
  }
  return context;
};
