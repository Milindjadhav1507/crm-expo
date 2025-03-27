import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import * as bootstrap from 'bootstrap';

interface TimelineActivity {
    id: number;
    date: string;
    time: string;
    title: string;
    description: string;
    type: 'created' | 'status' | 'call' | 'email' | 'meeting' | 'note';
    icon: string;
    iconColor: string;
    user: {
        name: string;
        avatar: string;
    };
    metadata?: {
        duration?: string;
        outcome?: string;
        platform?: string;
        link?: string;
    };
}

@Component({
    selector: 'app-lead-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatLabel,
        MatInputModule,
    ],
    templateUrl: './lead-list.component.html',
    styleUrls: ['./lead-list.component.scss'], // Use styleUrls
})
export class LeadListComponent implements OnInit {
    leads: any[] = [];
    filteredLeads: any[] = [];
    paginatedLeads: any[] = [];
    displayMode: 'list' | 'grid' = 'list';
    searchQuery: string = '';
    loading: boolean = true;
    selectedFilter: string = 'all';

    newLead: any = {
        name: '',
        number: '',
        email: '',
        leadType: '',
        leadSource: '',
        notes: '',
        document: null,
        company: '',
        assignedTo: '',  // Store the username directly
    };

    users = [
        'John Doe',
        'Jane Smith',
        'Robert Johnson',
        'Emily Davis',
        'Michael Wilson'
    ];

    leadTypes = ['Hot', 'Warm', 'Cold']; // Available lead types

    followUpData = {
        leadName: '',
        status: '',
        nextFollowUpDate: '',
        comments: '',
        isMeetingScheduled: false,
        meetingPlatform: '',
        meetingLink: '',
        assignedTo: '',  // Store the username directly
        leadType: '' // Added Lead Type for Follow Up
    };

    pageSize: number = 10;
    currentPage: number = 1;
    totalPages: number = 1;
    selectedLead: any = null;

    timelineData: TimelineActivity[] = [
        {
            id: 1,
            date: 'Today',
            time: '10:30 AM',
            title: 'Lead Created',
            description: 'New lead was added to the system',
            type: 'created',
            icon: 'fa-user-plus',
            iconColor: 'primary',
            user: {
                name: 'John Doe',
                avatar: 'https://via.placeholder.com/20'
            }
        },
        {
            id: 2,
            date: 'Yesterday',
            time: '2:45 PM',
            title: 'Status Updated',
            description: 'Lead status changed to Qualified',
            type: 'status',
            icon: 'fa-check',
            iconColor: 'success',
            user: {
                name: 'Sarah Smith',
                avatar: 'https://via.placeholder.com/20'
            }
        },
        {
            id: 3,
            date: '2 Days Ago',
            time: '11:15 AM',
            title: 'Phone Call',
            description: 'Initial contact made with the lead',
            type: 'call',
            icon: 'fa-phone',
            iconColor: 'info',
            user: {
                name: 'Mike Johnson',
                avatar: 'https://via.placeholder.com/20'
            },
            metadata: {
                duration: '15 mins',
                outcome: 'Positive'
            }
        },
        {
            id: 4,
            date: '3 Days Ago',
            time: '3:30 PM',
            title: 'Email Sent',
            description: 'Proposal document sent to the lead',
            type: 'email',
            icon: 'fa-envelope',
            iconColor: 'warning',
            user: {
                name: 'Emily Brown',
                avatar: 'https://via.placeholder.com/20'
            }
        },
        {
            id: 5,
            date: '4 Days Ago',
            time: '10:00 AM',
            title: 'Meeting Scheduled',
            description: 'Project discussion meeting scheduled',
            type: 'meeting',
            icon: 'fa-calendar',
            iconColor: 'primary',
            user: {
                name: 'John Doe',
                avatar: 'https://via.placeholder.com/20'
            },
            metadata: {
                platform: 'Google Meet',
                link: 'https://meet.google.com/xxx'
            }
        },
        {
            id: 6,
            date: '5 Days Ago',
            time: '4:20 PM',
            title: 'Note Added',
            description: 'Added initial requirements note',
            type: 'note',
            icon: 'fa-sticky-note',
            iconColor: 'info',
            user: {
                name: 'Sarah Smith',
                avatar: 'https://via.placeholder.com/20'
            }
        }
    ];

    constructor() { }

    ngOnInit(): void {
        this.loadHardcodedLeads();
        this.filterLeads();
    }

    loadHardcodedLeads(): void {
        this.leads = [
            {
                id: 'L001',
                name: 'Aarav Patel',
                email: 'aarav.patel@example.com',
                phone: '9123456780',
                leadSource: 'Website',
                leadType: 'Hot Lead',
                company: 'Company 1',
                status: 'New',
                createdDate: '2024-02-01',
                notes: 'Interested in product demo',
                imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav Patel',
                assignedTo: 'John Doe'  // Example
            },
            {
                id: 'L002',
                name: 'Aanya Singh',
                email: 'aanya.singh@example.com',
                phone: '9123456781',
                leadSource: 'Referral',
                leadType: 'Cold Lead',
                company: 'Company 2',
                status: 'Contacted',
                createdDate: '2024-02-02',
                notes: 'Follow-up required',
                imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Aanya Singh',
                assignedTo: 'Jane Smith'
            },
            {
                id: 'L003',
                name: 'Advait Sharma',
                email: 'advait.sharma@example.com',
                phone: '9123456782',
                leadSource: 'Social Media',
                leadType: 'Warm Lead',
                company: 'Company 3',
                status: 'Qualified',
                createdDate: '2024-02-03',
                notes: 'Interested in product demo',
                imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Advait Sharma',
                 assignedTo: 'Robert Johnson'
            },
            {
                id: 'L004',
                name: 'Ananya Gupta',
                email: 'ananya.gupta@example.com',
                phone: '9123456783',
                leadSource: 'Email Campaign',
                leadType: 'Hot Lead',
                company: 'Company 4',
                status: 'New',
                createdDate: '2024-02-04',
                notes: 'Follow-up required',
                imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya Gupta',
                 assignedTo: 'Emily Davis'
            },
            {
                id: 'L005',
                name: 'Arjun Kumar',
                email: 'arjun.kumar@example.com',
                phone: '9123456784',
                leadSource: 'Event',
                leadType: 'Cold Lead',
                company: 'Company 5',
                status: 'Contacted',
                createdDate: '2024-02-05',
                notes: 'Interested in product demo',
                imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun Kumar',
                 assignedTo: 'Michael Wilson'
            },
            { id: 'L011', name: 'Riya Mehta', email: 'riya.mehta@example.com', phone: '9123456790', leadSource: 'Website', leadType: 'Cold Lead', company: 'Company 11', status: 'Contacted', createdDate: '2024-02-11', notes: 'Requested brochure', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Riya Mehta',  assignedTo: 'John Doe' },
            { id: 'L012', name: 'Yash Verma', email: 'yash.verma@example.com', phone: '9123456791', leadSource: 'Referral', leadType: 'Warm Lead', company: 'Company 12', status: 'Qualified', createdDate: '2024-02-12', notes: 'Interested in partnership', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Yash Verma',  assignedTo: 'Jane Smith' },
            { id: 'L013', name: 'Sanya Kapoor', email: 'sanya.kapoor@example.com', phone: '9123456792', leadSource: 'Social Media', leadType: 'Hot Lead', company: 'Company 13', status: 'New', createdDate: '2024-02-13', notes: 'Wants product demo', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Sanya Kapoor',  assignedTo: 'Robert Johnson' },
            { id: 'L014', name: 'Ayaan Malik', email: 'ayaan.malik@example.com', phone: '9123456793', leadSource: 'Event', leadType: 'Cold Lead', company: 'Company 14', status: 'Contacted', createdDate: '2024-02-14', notes: 'Asked for pricing details', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ayaan Malik',  assignedTo: 'Emily Davis' },
            { id: 'L015', name: 'Ishita Bansal', email: 'ishita.bansal@example.com', phone: '9123456794', leadSource: 'Website', leadType: 'Warm Lead', company: 'Company 15', status: 'Qualified', createdDate: '2024-02-15', notes: 'Looking for long-term contract', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ishita Bansal',  assignedTo: 'Michael Wilson' },

            // Add more leads as needed (up to 25)
        ];

        this.filterLeads();
        this.loading = false; // Stop skeleton loading
    }

    toggleView(mode: 'list' | 'grid'): void {
        this.displayMode = mode;
    }

    filterLeads(): void {
        let filtered = this.leads.filter(
            (lead) =>
                lead.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lead.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lead.phone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lead.leadSource.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lead.leadType.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        // Date Filtering
        if (this.selectedFilter !== 'all') {
            const today = new Date();
            let startDate: Date;

            switch (this.selectedFilter) {
                case 'today':
                    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    break;
                case 'last7days':
                    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    break;
                case 'last1month':
                    startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                    break;
                default:
                    startDate = new Date(0); // Epoch - effectively no filter
            }

            filtered = filtered.filter((lead) => {
                const createdDate = new Date(lead.createdDate);
                return createdDate >= startDate;
            });
        }

        this.filteredLeads = filtered;
        this.currentPage = 1;
        this.applyPagination();
    }

    viewDetails(lead: any) {
        this.selectedLead = lead;
    }

    closeDetails() {
        this.selectedLead = null;
    }

    applyPagination(): void {
        this.totalPages = Math.ceil(this.filteredLeads.length / this.pageSize) || 1;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedLeads = this.filteredLeads.slice(start, end);
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.applyPagination();
        }
    }

    onPageSizeChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.pageSize = Number(target.value) === 0 ? this.filteredLeads.length : Number(target.value);
        this.currentPage = 1;
        this.applyPagination();
    }

    onFileSelect(event: any) {
        if (event.target.files.length > 0) {
            this.newLead.document = event.target.files[0];
        }
    }

    createLead() {
        if (!this.newLead.name || !this.newLead.number || !this.newLead.email) {
            alert('Name, Number, and Email are required.');
            return;
        }

        console.log('Lead Created:', this.newLead);

        const modalElement = document.getElementById('createLeadModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                const newModal = new bootstrap.Modal(modalElement);
                newModal.hide();
            }
        }

        this.newLead = {
            name: '',
            number: '',
            email: '',
            leadType: '',
            leadSource: '',
            notes: '',
            document: null,
            company: '',
            assignedTo: '',  // Reset assignedTo (username)
        };
    }

    openFollowUpModal(lead: any, event: Event) {
        event.stopPropagation(); // Prevents triggering viewDetails
        this.followUpData = {
            leadName: lead.name,
            status: '',
            nextFollowUpDate: '',
            comments: '',
            isMeetingScheduled: false,
            meetingPlatform: '',
            meetingLink: '',
            assignedTo: lead.assignedTo,  // Get initial assignedTo (username)
            leadType: lead.leadType // Initialize leadType from lead
        };

        const modalElement = document.getElementById('followUpModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            console.error('Follow-Up Modal not found in the DOM.');
        }
    }

    onStatusChange() {
        if (this.followUpData.status !== 'Meeting') {
            this.followUpData.isMeetingScheduled = false;
            this.followUpData.meetingPlatform = '';
            this.followUpData.meetingLink = '';
        }
    }

    saveFollowUp() {
        console.log('Follow-up saved:', this.followUpData);
        // Add logic to save follow-up data
    }

        //Delete lead logic
    deleteLead(leadId: string, event: Event) {
        event.stopPropagation();
        this.leads = this.leads.filter(lead => lead.id !== leadId);
        this.filterLeads();
    }

    getTimelineActivitiesByDate(date: string): TimelineActivity[] {
        return this.timelineData.filter(activity => activity.date === date);
    }

    getUniqueDates(): string[] {
        return [...new Set(this.timelineData.map(activity => activity.date))];
    }

    getIconClass(activity: TimelineActivity): string {
        return `fa ${activity.icon} text-${activity.iconColor}`;
    }

    getIconBgClass(activity: TimelineActivity): string {
        return `bg-${activity.iconColor}`;
    }
}