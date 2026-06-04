import { useCallback, useMemo } from 'react';

import { useAuth } from '@/context/useAuth';
import type { ModuleAccessLevel } from '@/types/operator.types';

const EDIT_PERMISSION_SUFFIXES = new Set([
  'approve_reject',
  'cancel_ride',
  'close',
  'create',
  'delete',
  'edit',
  'force_end_ride',
  'manage',
  'remove',
  'respond',
  'review_documents',
  'send',
  'suspend',
]);

const hasRequiredAccess = (actual: ModuleAccessLevel | undefined, required: ModuleAccessLevel) => {
  if (!actual || actual === 'hide') return false;
  if (required === 'view') return actual === 'view' || actual === 'edit';
  return actual === 'edit';
};

const getRequiredAccess = (permission: string): ModuleAccessLevel => {
  const action = permission.split('.').slice(1).join('.');
  return EDIT_PERMISSION_SUFFIXES.has(action) ? 'edit' : 'view';
};

export const usePermissions = () => {
  const { user } = useAuth();
  const permissions = useMemo(() => user?.permissions || [], [user?.permissions]);
  const moduleAccess = user?.moduleAccess;

  const hasPermission = useCallback(
    (permission: string) => {
      if (moduleAccess) {
        const moduleKey = permission.split('.')[0] as keyof typeof moduleAccess;
        return hasRequiredAccess(moduleAccess[moduleKey], getRequiredAccess(permission));
      }
      return permissions.includes(permission);
    },
    [moduleAccess, permissions],
  );

  const hasAnyPermission = useCallback(
    (...perms: string[]) => {
      return perms.some((p) => hasPermission(p));
    },
    [hasPermission],
  );

  const hasAllPermissions = useCallback(
    (...perms: string[]) => {
      return perms.every((p) => hasPermission(p));
    },
    [hasPermission],
  );

  return { permissions, moduleAccess, hasPermission, hasAnyPermission, hasAllPermissions };
};
