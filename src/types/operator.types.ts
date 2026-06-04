export type OperatorRole = 'admin' | 'manager' | 'operator';
export type ModuleAccessLevel = 'view' | 'edit' | 'hide';

export type OperatorModuleKey =
  | 'dashboard'
  | 'riders'
  | 'drivers'
  | 'verification'
  | 'trips'
  | 'inventory'
  | 'support'
  | 'pricing'
  | 'notifications'
  | 'operators';

export type ModuleAccess = Record<OperatorModuleKey, ModuleAccessLevel>;

export interface Operator {
  id: string;
  operatorId: string;
  name: string;
  email: string;
  role: OperatorRole;
  moduleAccess: ModuleAccess;
  permissions?: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  profile?: string | null;
}

export interface OperatorListResponse {
  success: boolean;
  message: string;
  data: {
    results: Operator[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface OperatorDetailResponse {
  success: boolean;
  message: string;
  data: {
    operator: Operator;
  };
}

export interface OperatorMutationResponse {
  success: boolean;
  message: string;
  data: {
    operator: Operator;
  };
}

export interface CreateOperatorPayload {
  name: string;
  email: string;
  password: string;
  role: OperatorRole;
  status: Operator['status'];
  moduleAccess: ModuleAccess;
}

export interface UpdateOperatorPayload {
  name?: string;
  email?: string;
  role?: OperatorRole;
  status?: Operator['status'];
  moduleAccess?: ModuleAccess;
}

export interface OperatorLoginResponse {
  success: boolean;
  message: string;
  data: {
    operator: Operator;
    tokens: {
      access: { token: string; expires: string };
      refresh: { token: string; expires: string };
    };
  };
}

export interface PermissionsResponse {
  success: boolean;
  message: string;
  data: {
    accessLevels: ModuleAccessLevel[];
    modules: Array<{
      key: OperatorModuleKey;
      label: string;
      accessLevels: ModuleAccessLevel[];
      defaultAccess: ModuleAccessLevel;
    }>;
    roles: OperatorRole[];
    roleDefaults: Record<OperatorRole, Partial<ModuleAccess>>;
  };
}
