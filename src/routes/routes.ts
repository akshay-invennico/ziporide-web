export const routes = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot/password',
  VERIFY_OTP: '/verify/otp/email',
  RESET_PASSWORD: '/reset/password',

  DASHBOARD: '/dashboard',
  RIDER: '/rider',
  RIDER_DETAILS: '/rider/details/:id',
  DRIVER: '/driver',
  DRIVER_DETAILS: '/driver/details/:id',
  VERIFICATION: '/verification',
  VERIFICATION_DETAILS: '/verification/details/:id',
  TRIPS: '/trips',
  INVENTORY: '/inventory',
  TRANSACTIONS: '/transactions',
  SUPPORT: '/support',
  SETTINGS: '/settings',
} as const;
