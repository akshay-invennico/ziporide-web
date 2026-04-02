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


