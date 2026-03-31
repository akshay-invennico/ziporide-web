export interface DashboardSummary {
  success: boolean;
  statusCode: number;
  message?: string;
  data: {
    totalRiders: {
      value: number;
      change: number;
      trend: 'up' | 'down';
    };
    activeDrivers: {
      value: number;
      change: number;
      trend: 'up' | 'down';
    };
    totalTrips: {
      value: number;
      change: number;
      trend: 'up' | 'down';
    };
    revenue: {
      value: number;
      change: number;
      trend: 'up' | 'down';
    };
  };
}

export interface RevenueAnalyticsItem {
  month?: string;
  day?: string;
  revenue: number;
  rides: number;
}

export interface RevenueAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data: RevenueAnalyticsItem[];
}

export interface RiderDriverReportItem {
  month?: string;
  day?: string;
  riders: number;
  drivers: number;
}

export interface RiderDriverReportResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data: RiderDriverReportItem[];
}

export interface TripsOverTimeItem {
  month?: string;
  day?: string;
  trips: number;
}

export interface TripsOverTimeResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data: TripsOverTimeItem[];
}
