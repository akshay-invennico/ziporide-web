export interface Transaction {
  id: string; // Internal API ID (e.g., "in_...")
  transactionId: string; // Display ID (e.g., "TXN-000001")
  type: string; // API uses snake_case, e.g., "subscription_payment"
  status: string; // API uses "completed", etc.
  amount: number;
  currency: string;
  source: string;
  gateway: string;
  receiptUrl?: string;
  filterType?: string;
  createdAt: string;
  updatedAt: string;
  date?: string; // Mapped for UI
  time?: string; // Mapped for UI
  paymentMethod?: string;
  externalId?: string;
  tripId?: string;
  driver?: {
    name: string;
    id: string;
    profile?: string;
    email?: string;
    phone?: string;
  };
}

export interface TransactionResponse {
  success: boolean; // Changed from status
  message: string;
  data: {
    results: Transaction[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface TransactionDetailsResponse {
  success: boolean;
  message: string;
  data: Transaction;
}
