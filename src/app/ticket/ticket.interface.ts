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
    status: string;
    status_id?: number;
    category_id?: number;
    priority_id?: number;
    assigned_to_id?: number | null;
    created_by_id?: number;
    created_at?: string;
    updated_at?: string | null;
    deleted?: boolean;
    statusName?: string;
    categoryName?: string;
    priorityName?: string;
    assignedToName?: string | null;
    createdByName?: string;
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
