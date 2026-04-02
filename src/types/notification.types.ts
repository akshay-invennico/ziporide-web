export type TargetAudience = 'riders' | 'drivers' | 'all';

export interface SendNotificationPayload {
  title: string;
  body: string;
  targetAudience: TargetAudience;
}

export interface NotificationRecord {
  _id: string;
  title: string;
  body: string;
  targetAudience: TargetAudience;
  sentBy: {
    _id: string;
    name: string;
    email: string;
  };
  totalSent: number;
  totalFailed: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendNotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification: NotificationRecord;
    totalSent: number;
    totalFailed: number;
  };
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    results: NotificationRecord[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}
