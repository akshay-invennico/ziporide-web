export type TargetAudience = 'riders' | 'drivers' | 'all';

export interface SendNotificationPayload {
  title: string;
  body: string;
  targetAudience: TargetAudience;
}

export interface SendNotificationResponse {
  success: boolean;
  message: string;
}

export type AdminNotificationType =
  | 'new_ride_requested'
  | 'ride_completed'
  | 'ride_cancelled'
  | 'ride_force_ended'
  | 'new_driver_registration'
  | 'driver_verification_submitted'
  | 'driver_approved'
  | 'new_rider_signup'
  | 'new_rating_received'
  | 'new_support_ticket'
  | 'payment_successful'
  | 'payment_failed'
  | 'pricing_updated';

export interface AdminNotificationMetadata {
  rideId?: string;
  rideNumber?: string;
  riderId?: string;
  driverId?: string;
  ticketId?: string;
  pricingId?: string;
  fare?: number;
  amount?: number;
  currency?: string;
  stars?: number;
  ratedBy?: string;
  cancelledBy?: string;
  cancelReason?: string;
  reason?: string;
  cause?: string;
  phone?: string;
  driverName?: string;
  [key: string]: unknown;
}

export interface AdminNotification {
  id: string;
  type: AdminNotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  metadata: AdminNotificationMetadata;
  createdAt: string;
}

export interface AdminNotificationsListResponse {
  success: boolean;
  data: {
    results: AdminNotification[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface AdminNotificationUnreadCountResponse {
  success: boolean;
  data: { unreadCount: number };
}

export interface AdminNotificationMarkReadResponse {
  success: boolean;
  data: { notification: AdminNotification };
}

export interface AdminNotificationBasicResponse {
  success: boolean;
  message: string;
}
