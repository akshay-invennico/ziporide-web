export const API = {
  LOGIN: '/v1/auth/login',
  FORGOT_PASSWORD: '/v1/auth/forgot/password',
  VERIFY_OTP: '/v1/auth/verify/otp/email',
  RESET_PASSWORD: '/v1/auth/reset/password',

  DASHBOARD_STATS: '/v1/dashboard/stats',

  RIDERS: '/v1/riders',
  RIDER_DETAILS: (id: string) => `/v1/riders/${id}`,
  RIDER_BULK_STATUS: '/v1/riders/status',
  RIDER_SUMMARY: '/v1/riders/summary',
  RIDER_SPENDING_TREND: '/v1/riders/spending-trend',

  DRIVER: '/v1/driver',
  DRIVER_DETAILS: (id: string) => `/v1/driver/${id}`,
  DRIVER_STATUS: (id: string) => `/v1/driver/${id}/status`,
  DRIVER_BULK_STATUS: '/v1/driver/status',
  VERIFY_DOCUMENT: (id: string, docType: string) => `/v1/driver/${id}/verify/${docType}`,
  DRIVER_SUBSCRIPTIONS: (id: string) => `/v1/driver/${id}/subscriptions`,
  DRIVER_EARNINGS: (id: string) => `/v1/driver/${id}/earnings`,

  VERIFICATIONS: '/v1/verifications',
  VERIFICATION_DETAILS: (id: string) => `/v1/verifications/${id}`,

  TRIPS: '/v1/trips',
  TRIP_DETAILS: (id: string) => `/v1/trips/${id}`,
  ADMIN_TRIPS: '/v1/ride/admin/all',
  ADMIN_TRIP_DETAILS: (id: string) => `/v1/ride/admin/${id}`,
  CANCEL_RIDE: (id: string) => `/v1/ride/admin/${id}/cancel`,

  VEHICLE_CATEGORIES: '/v1/inventory/categories',
  CREATE_CATEGORY: '/v1/inventory/categories',
  UPDATE_CATEGORY: (id: string) => `/v1/inventory/categories/${id}`,
  REMOVE_CATEGORY: (id: string) => `/v1/inventory/categories/${id}`,

  SUPPORT_TICKETS: '/v1/support/ticket',
  UPDATE_TICKET_STATUS: (id: string) => `/v1/support/ticket/${id}`,

  UPLOAD_IMAGE: '/v1/image/upload',
  ADMIN_ME: '/v1/users/me',
  UPDATE_PROFILE: '/v1/users',
  UPDATE_PASSWORD: '/v1/users/password',
  PRICING: '/v1/pricing',

  TRANSACTIONS: '/v1/transactions',
  TRANSACTION_DETAILS: (id: string) => `/v1/transactions/${id}`,

  OPERATOR_LOGIN: '/v1/operators/login',
  OPERATOR_ME: '/v1/operators/me',
  OPERATOR_PERMISSIONS: '/v1/operators/permissions',
  OPERATORS: '/v1/operators',
  OPERATOR_DETAILS: (id: string) => `/v1/operators/${id}`,
  OPERATOR_UPDATE_PERMISSIONS: (id: string) => `/v1/operators/${id}/permissions`,
  OPERATOR_UPDATE_STATUS: (id: string) => `/v1/operators/${id}/status`,
} as const;
