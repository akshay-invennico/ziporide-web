export interface ApiVehicleCategory {
  id: string;
  name: string;
  isActive: boolean;
  baseFare: number;
  pricePerMile: number;
  pricePerMinute: number;
  vehicleType: string;
  seatCapacity: number;
  categoryIcon: string;
}

export interface VehicleCategory {
  id: string;
  name: string;
  seats: number;
  basePrice: number;
  image: string;
  pricePerMile: number;
  pricePerMinute: number;
  vehicleType: string;
}

export interface VehicleCategoryResponse {
  success: boolean;
  message: string;
  data: {
    results: ApiVehicleCategory[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}
