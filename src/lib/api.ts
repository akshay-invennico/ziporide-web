export const API = {
  LOGIN: '/v1/auth/login',
  FORGOT_PASSWORD: '/v1/auth/forgot/password',
  VERIFY_OTP: '/v1/auth/verify/otp/email',
  RESET_PASSWORD: '/v1/auth/reset/password',

  DASHBOARD_STATS: '/v1/dashboard/stats',

  RIDERS: '/v1/riders',
  RIDER_DETAILS: (id: string) => `/v1/riders/${id}`,

  DRIVERS: '/v1/drivers',
  DRIVER_DETAILS: (id: string) => `/v1/drivers/${id}`,

  VERIFICATIONS: '/v1/verifications',
  VERIFICATION_DETAILS: (id: string) => `/v1/verifications/${id}`,

  TRIPS: '/v1/trips',
  TRIP_DETAILS: (id: string) => `/v1/trips/${id}`,

  VEHICLE_CATEGORIES: '/v1/inventory/categories',
  CREATE_CATEGORY: '/v1/inventory/categories',
  UPDATE_CATEGORY: (id: string) => `/v1/inventory/categories/${id}`,
  REMOVE_CATEGORY: (id: string) => `/v1/inventory/categories/${id}`,

  UPLOAD_IMAGE: '/v1/files/upload',
  ADMIN_ME: '/v1/users/me',
  UPDATE_PROFILE: '/v1/users',
  UPDATE_PASSWORD: '/v1/users/password',
} as const;
