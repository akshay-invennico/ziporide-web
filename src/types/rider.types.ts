export interface Address {
  home?: string;
  work?: string;
  other?: string;
}

export interface Rider {
  id: string;
  riderId?: string; // Some parts of mock used this
  name: string;
  email: string | null;
  phone: string;
  gender?: string;
  status: string;
  avatar?: string;
  profilePhotoUrl?: string; // Consistent with Driver
  joinedOn?: string;
  createdAt?: string;
  updatedAt?: string;
  totalTrips?: number;
  totalSpent?: number;
  rating?: number;
  avgRating?: number; // Consistent with Driver
  initials?: string;
  address?: Address | string;
  addresses?: Address; // Consistent with mock
}

export interface RiderResponse {
  success: boolean;
  message: string;
  data: {
    results: Rider[];
    page?: number;
    limit?: number;
    totalPages?: number;
    totalResults?: number;
  };
}

export interface RiderDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: Rider;
  };
}

export interface RiderSummary {
  totalTrips: number;
  totalSpent: number;
  averageTripValue: number;
  cancellationRate: number;
}

export interface RiderSummaryResponse {
  success: boolean;
  message: string;
  data: RiderSummary;
}

export interface SpendingTrendItem {
  month?: string;
  day?: string;
  spent: number;
  rides: number;
}

export interface RiderSpendingTrendResponse {
  success: boolean;
  message: string;
  data: SpendingTrendItem[];
}
