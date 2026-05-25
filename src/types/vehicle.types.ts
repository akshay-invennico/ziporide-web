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
  order: number;
}

export interface VehicleDatabaseRow {
  id: string;
  name: string;
  year: number;
  color: string;
  image: string;
  category: 'Electric' | 'Standard' | 'XL' | 'Executive (Premium)' | 'Executive XL (Premium)';
  licencePlate: string;
  driver: {
    name: string;
    phone: string;
    image: string;
    countryCode: string;
  };
  status: 'Active' | 'Suspended';
}

export interface VehicleCategory {
  id: string;
  name: string;
  seats: number;
  basePrice: number;
  categoryIcon: string;
  pricePerMile: number;
  pricePerMinute: number;
  vehicleType: string;
  order: number;
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

export interface ApiVehicle {
  _id: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    color?: string;
    licensePlate: string;
    type: string;
    category: string | null;
  };
  driver: {
    _id: string;
    name: string;
    phone: string;
    countryCode: string;
    profilePhotoUrl?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclesResponse {
  success: boolean;
  message: string;
  data: {
    results: ApiVehicle[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}
