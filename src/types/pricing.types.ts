export interface SurgePricing {
  enabled: boolean;
  multiplier: number | null;
}

export interface PricingData {
  id?: string;
  minimumFare: number | null;
  cancellationFee: number | null;
  airportParkingCharge: number | null;
  waitingCharge: number | null;
  freeWaitingTime: number | null;
  maxPaidWaitingTime: number | null;
  surgePricing: SurgePricing;
}

export interface PricingResponse {
  success: boolean;
  message: string;
  data: {
    pricing: PricingData;
  };
}
