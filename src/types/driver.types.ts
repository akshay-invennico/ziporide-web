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

  address?:
    | string
    | {
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
    [key: string]: unknown;
  };

  licence?: {
    isVerified?: boolean;
    number?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    documentUrl?: string; // New from API
    document?: {
      isVerified?: boolean;
      url?: string;
      verifiedAt?: string;
      rejectedReason?: string;
    };
  };

  // Add alias for spelling difference in UI components
  license?: {
    panNumber?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    documentName?: string;
  };

  vehicle?: {
    type?: string;
    registrationNumber?: string;
    make?: string;
    model?: string;
    year?: number;
    colour?: string;
    color?: string;
    vehicleType?: string; // some parts of UI use this
    insuranceCertificateUrl?: string; // New from API
    motCertificateUrl?: string; // New from API
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
  appliedOn?: string;
  actionDate?: string;
  driverName?: string;
  driverId?: string;
  initials?: string;

  legalAgreements?: {
    termsOfService?: boolean;
    privacyPolicy?: boolean;
    dataProcessingConsent?: boolean;
  };

  consents?: {
    termsOfService?: boolean;
    privacyPolicy?: boolean;
    dataProcessingConsent?: boolean;
    acceptedAt?: string;
    [key: string]: unknown;
  };

  // Verification specific
  reason?: string;
  rejectedReason?: string;

  // Example of other fields from backend
  userStatus?: string;
  userId?: string;
  isProfileCompleted?: boolean;
  isSubscribed?: boolean;
  subscriptionStatus?: string;
  isOnline?: boolean;
  socketId?: string | null;
  isBankLinked?: boolean;
  totalEarnings?: number;
  totalTrips?: number;
  avgRating?: number;
  totalRatings?: number;
  rating?: number;
  totalEarned?: number;
  onboardingStep?: number;
  isPhoneVerified?: boolean;
  [key: string]: unknown;
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
