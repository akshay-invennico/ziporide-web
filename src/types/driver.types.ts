export interface Driver {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  status: string;
  avatar?: string;
  profilePhotoUrl?: string;
  gender?: string;
  dateOfBirth?: string;

  address?: {
    line1?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };

  backgroundCheck?: {
    isVerified?: boolean;
    verifiedAt?: string;
    url?: string;
    rejectedReason?: string;
  };

  licence?: {
    number?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    document?: {
      isVerified?: boolean;
      url?: string;
      verifiedAt?: string;
      rejectedReason?: string;
    };
  };

  vehicle?: {
    type?: string;
    registrationNumber?: string;
    make?: string;
    model?: string;
    year?: number;
    colour?: string;
    color?: string;
    insurance?: {
      isVerified?: boolean;
      url?: string;
      verifiedAt?: string;
      rejectedReason?: string;
    };
    mot?: {
      isVerified?: boolean;
      url?: string;
      verifiedAt?: string;
      rejectedReason?: string;
    };
  };

  // Possible date fields for "Applied On" and "Approved/Rejected On"
  createdAt?: string;
  updatedAt?: string;
  consents?: {
    acceptedAt?: string;
    [key: string]: any;
  };

  // Verification specific
  reason?: string;

  // Example of other fields from backend
  userStatus?: string;
  userId?: string;
  isProfileCompleted?: boolean;
  totalEarnings?: number;
  totalTrips?: number;
  avgRating?: number;
  [key: string]: any;
}

export interface DriverResponse {
  success: boolean;
  message: string;
  data: {
    results: Driver[];
    page?: number;
    limit?: number;
    totalPages?: number;
    totalResults?: number;
  };
}
