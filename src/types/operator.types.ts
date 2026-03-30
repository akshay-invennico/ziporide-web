export interface Operator {
  id: string;
  operatorId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
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
  role: 'admin' | 'manager' | 'operator';
  permissions?: string[];
}

export interface UpdateOperatorPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'manager' | 'operator';
  permissions?: string[];
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
    modules: Record<
      string,
      {
        label: string;
        permissions: string[];
      }
    >;
    roles: string[];
    roleDefaults: Record<string, string[]>;
  };
}
