import { useCallback } from 'react';

import { useAuth } from '@/context/useAuth';

export const usePermissions = () => {
  const { user } = useAuth();
  const permissions = user?.permissions || [];

  const hasPermission = useCallback(
    (permission: string) => {
      return permissions.includes(permission);
    },
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (...perms: string[]) => {
      return perms.some((p) => permissions.includes(p));
    },
    [permissions],
  );

  const hasAllPermissions = useCallback(
    (...perms: string[]) => {
      return perms.every((p) => permissions.includes(p));
    },
    [permissions],
  );

  return { permissions, hasPermission, hasAnyPermission, hasAllPermissions };
};
