export const routes = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot/password',
  VERIFY_PASSWORD: '/verify/password',
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
  SUPPORT: '/support',
  SETTINGS: '/settings',
} as const;
