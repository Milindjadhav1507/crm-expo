export interface Ticket {
    id?: number;
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    attachments: string; // Array of files
    // attachments: File[]; // Array of files
    // Array of files
    contact_email?: string;
    contact_phone?: string;
    expected_resolution_date?: Date;
    additional_notes?: string;
    // status: TicketStatus;
    // createdAt: Date;
    // communicationHistory: any[]; // Adjust this type based on actual data
  }
export interface Communication {
    message: string;
    timestamp: Date;
    author: string;
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}
