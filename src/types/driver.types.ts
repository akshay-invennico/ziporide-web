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
export interface DriverSubscription {
  currentSubscription: {
    id: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: string;
    amount: number;
    currency: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    subscribedOn: string;
  } | null;
  subscriptionHistory: {
    results: Array<{
      id: string;
      status: string;
      amount: number;
      currency: string;
      createdAt: string;
    }>;
  };
  billingHistory: Array<{
    id: string;
    invoiceNumber: string;
    description: string;
    amount: number;
    currency: string;
    status: string;
    invoiceUrl: string;
    pdfUrl: string;
    createdAt: string;
    periodStart: string;
    periodEnd: string;
  }>;
  paymentMethod: {
    id: string;
    type: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: string;
    country: string;
    holderName: string;
  } | null;
  summary: {
    isSubscribed: boolean;
    subscriptionStatus: string;
    stripeCustomerId: string;
  };
}

export interface BackendEarningReport {
  label: string;
  amount: number;
  totalEarnings: number;
  tripCount: number;
  startDate: string;
}

export interface BackendEarningStats {
  summary: {
    totalTrips: number;
    totalEarnings: number;
    averageTripValue: number;
    acceptanceRate: number;
  };
  period: string;
  periodSummary: {
    totalEarnings: number;
    totalTrips: number;
  };
  report: BackendEarningReport[];
}

export interface FrontendEarningData {
  totalTrips: number;
  totalEarnings: number;
  avgTripValue: number;
  acceptanceRate: number;
  chartData: DriverEarningData[];
}

export interface DriverEarningData {
  month: string;
  earnings: number;
  rides: number;
}

export interface DriverEarningsResponse {
  success: boolean;
  message: string;
  data: BackendEarningStats;
}

export interface DriverSubscriptionsResponse {
  success: boolean;
  message: string;
  data: DriverSubscription;
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface RawRideData {
  id: string;
  rideNumber?: string;
  status: string;
  paymentStatus: string;
  tipAmount: number;
  rider: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    initials?: string;
    rating?: number;
  } | null;
  driver: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    profilePhotoUrl?: string;
    rating?: number;
    avgRating?: number;
    vehicle?: {
      make: string;
      model: string;
      registrationNumber: string;
      photo?: string;
    };
  } | null;
  pickup: {
    address: string;
    coordinates: [number, number];
  };
  stops: Array<{
    address: string;
    coordinates: [number, number];
  }>;
  destination: {
    address: string;
    coordinates: [number, number];
  };
  paymentMethod?: {
    card?: {
      last4: string;
      brand: string;
      expiryMonth?: number;
      expiryYear?: number;
    };
    type: string;
  };
  fare: {
    baseFare?: number;
    distanceFare?: number;
    timeFare?: number;
    surgeMultiplier?: number;
    totalFare: number;
    cancellationFee?: number;
    waitingCharge?: number;
    waitingMinutes?: number;
    discount?: number;
  };
  rideTimestamps: {
    bookedAt: string;
  };
  distanceKm?: number;
  durationMinutes?: number;
  cancellation?: {
    cancelledBy: 'rider' | 'driver';
    reason: string;
  };
}

export interface TripRecord {
  id: string;
  rideId?: string;
  rider: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    initials: string;
    rating: number;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    initials: string;
    rating: number;
    vehicle: {
      name: string;
      color: string;
      registrationNumber: string;
      photo?: string;
    };
  };
  route: {
    pickupLocation: string;
    stop1Location?: string;
    destination: string;
  };
  distance: number;
  estimatedTime: number;
  totalFare: number;
  baseFare: number;
  distanceFare: number;
  waitingCharge: number;
  amount: number;
  date: string;
  time: string;
  status: string;
  payment?: {
    method: string;
    last4: string;
  };
  riderFeedback?: {
    rating: number;
    note: string;
  };
  driverFeedback?: {
    rating: number;
    note: string;
  };
  cancellationDetails?: {
    cancelledBy: 'rider' | 'driver';
    tripStage: string;
    reason: string;
    fee: number;
    waitingCharge: number;
  };
}

export interface RidesResponse {
  success: boolean;
  message: string;
  data: {
    results: RawRideData[];
    totalPages: number;
    totalResults: number;
  };
}
