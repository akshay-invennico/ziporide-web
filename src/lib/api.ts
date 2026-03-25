export const API = {
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot/password',
  VERIFY_OTP: '/auth/verify/otp/email',
  RESET_PASSWORD: '/auth/reset/password',

  DASHBOARD_STATS: '/dashboard/stats',

  RIDERS: '/riders',
  RIDER_DETAILS: (id: string) => `/riders/${id}`,

  DRIVERS: '/drivers',
  DRIVER_DETAILS: (id: string) => `/drivers/${id}`,

  VERIFICATIONS: '/verifications',
  VERIFICATION_DETAILS: (id: string) => `/verifications/${id}`,

  TRIPS: '/trips',
  TRIP_DETAILS: (id: string) => `/trips/${id}`,

  VEHICLE_CATEGORIES: '/inventory/categories',
  UPDATE_CATEGORY: (id: string) => `/inventory/categories/${id}`,
} as const;
