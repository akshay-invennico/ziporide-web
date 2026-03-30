export interface SupportTicket {
  id: string;
  ticketId: string;
  cause: string;
  description: string;
  status: 'open' | 'checking' | 'resolved';
  ride: {
    id: string;
    rideNumber: string;
    status: string;
    paymentStatus: string;
  } | null;
  driver: {
    id: string;
    name: string;
    phone: string;
  } | null;
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
