export interface DashboardSummary {
  success: boolean;
  statusCode: number;
  message?: string;
  data: {
    dateRange?:
      | string
      | {
          startDate?: string;
          endDate?: string;
          previousStartDate?: string;
          previousEndDate?: string;
        };
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

export type DashboardChartFilterType = 'daily' | 'week' | 'month' | 'year';

export interface DashboardChartFilters {
  type: DashboardChartFilterType;
}

export interface RevenueAnalyticsItem {
  label: string;
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
  label: string;
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
  label: string;
  trips: number;
}

export interface TripsOverTimeResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data: TripsOverTimeItem[];
}
