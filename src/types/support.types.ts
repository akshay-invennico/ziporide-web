export interface SupportTicket {
  id: string;
  ticketId: string;
  reporterType?: 'rider' | 'driver';
  cause: string;
  description: string;
  status: 'open' | 'checking' | 'resolved';
  ride: {
    id: string;
    rideNumber: string;
    status: string;
    paymentStatus: string;
  } | null;
  rider: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    countryCode?: string;
    profile?: string | null;
  } | null;
  driver: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    countryCode?: string;
    profile?: string | null;
  } | null;
  createdAt: string;
}

export interface SupportTicketResponse {
  status: boolean;
  message: string;
  data: SupportTicket[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface UpdateTicketStatusResponse {
  status: boolean;
  message: string;
  data: SupportTicket;
}
