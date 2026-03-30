export interface SupportTicket {
    id: string;
    ticketId: string;
    cause: string;
    description: string;
    raisedOn: string;
    tripId: string;
    status: 'open' | 'checking' | 'resolved';
    driver: {
        name: string;
        phone: string;
        image: string;
        initials: string;
    }
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
    }
}


export interface UpdateTicketStatusResponse {
    status: boolean;
    message: string;
    data: SupportTicket;
}