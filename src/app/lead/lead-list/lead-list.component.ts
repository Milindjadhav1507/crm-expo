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
import { CrmApiService } from '../../crm-api.service';

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
    statusMap: { [key: number]: string } = {}; // Map to store status ID to name mapping
    leadSourceOptions: any[] = [];
    leadTypeOptions: any[] = [];
    statusOptions: any[] = [];
    users: any[] = []; // Array to store user list

    newLead: any = {
        name: '',
        number: '',
        email: '',
        leadType: '',
        leadSource: '',
        notes: '',
        document: null,
        company: '',
        assignedTo: '',  // Store the user ID
        country: '',
        state: 1,
        city: '',
        status: 1,
        attachment: '',
        deleted: false
    };

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

    constructor(private api: CrmApiService) { }

    ngOnInit(): void {
        this.getLeads();
        this.loadStatuses();
        this.loadLeadSources();
        this.loadLeadTypes();
        this.getLeadById(1);
        this.getUsers();
    }

    loadStatuses() {
        this.api.getAllStatus().subscribe({
            next: (response: any) => {
                if (response.data) {
                    // Create a map of status ID to status name
                    this.statusMap = response.data.reduce((acc: any, status: any) => {
                        acc[status.id] = status.name;
                        return acc;
                    }, {});
                }
            },
            error: (error) => {
                console.error('Error loading statuses:', error);
            }
        });
    }

    loadLeadSources() {
        this.api.get('api/GetAllLeadSource/').subscribe({
            next: (response: any) => {
                if (response.data) {
                    this.leadSourceOptions = response.data;
                }
            },
            error: (error) => {
                console.error('Error loading lead sources:', error);
            }
        });
    }

    loadLeadTypes() {
        this.api.get('api/GetAllLeadType/').subscribe({
            next: (response: any) => {
                if (response.data) {
                    this.leadTypeOptions = response.data;
                }
            },
            error: (error) => {
                console.error('Error loading lead types:', error);
            }
        });
    }

    getLeads() {
        this.loading = true;
        this.api.post('api/GetAllLead/s=', null).subscribe((res: any) => {
            this.leads = res.data.map((lead: any) => ({
                id: lead.id,
                name: lead.leadName,
                email: lead.email,
                phone: lead.phone,
                leadSource: lead.leadSourceName,
                leadType: lead.leadTypeName,
                company: lead.country || 'N/A',
                status: this.statusMap[lead.status_id] || lead.statusName,
                createdDate: lead.created_at,
                notes: lead.notes || '',
                imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${lead.leadName}`,
                assignedTo: lead.assignedtoName || 'Unassigned',
                assignedTo_id: lead.assignedTo_id,
                country: lead.country,
                city: lead.city,
                state_id: lead.state_id,
                leadSource_id: lead.leadSource_id,
                leadType_id: lead.leadType_id,
                status_id: lead.status_id,
                attachment: lead.attachment
            }));
            this.filterLeads();
            this.loading = false;
        });
    }

    toggleView(mode: 'list' | 'grid'): void {
        this.displayMode = mode;
    }

    getLeadById(id: number): void {
        this.api.getLeadById(id).subscribe((res: any) => {
            console.log(res);
        });
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

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Store the file object
            this.newLead.attachment = file;
        }
    }

    createLead() {
        if (!this.validateLeadForm()) {
            return;
        }

        // Create base lead data without attachment
        const leadData: any = {
            leadName: this.newLead.name,
            email: this.newLead.email,
            phone: this.newLead.number,
            country: this.newLead.country,
            state: this.newLead.state,
            city: this.newLead.city,
            leadSource: this.newLead.leadSource,
            leadType: this.newLead.leadType,
            notes: this.newLead.notes,
            status: this.newLead.status,
            assignedTo: this.newLead.assignedTo, // This will be the user ID
            deleted: false
        };

        // Only add attachment if it exists
        if (this.newLead.attachment) {
            leadData.attachment = this.newLead.attachment;
        }

        if (this.selectedLead) {
            // Update existing lead
            this.api.updateLead(this.selectedLead.id, leadData).subscribe({
                next: (response) => {
                    if (response.success) {
                        alert('Lead updated successfully!');
                        this.resetLeadForm();
                        this.getLeads();
                        const modalElement = document.getElementById('createLeadModal');
                        if (modalElement) {
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            if (modal) {
                                modal.hide();
                            }
                        }
                    } else {
                        alert('Failed to update lead. Please try again.');
                    }
                },
                error: (error) => {
                    console.error('Error updating lead:', error);
                    alert('Error updating lead. Please try again.');
                }
            });
        } else {
            // Create new lead
            this.api.createLead(leadData).subscribe({
                next: (response) => {
                    if (response.success) {
                        alert('Lead created successfully!');
                        this.resetLeadForm();
                        this.getLeads();
                        const modalElement = document.getElementById('createLeadModal');
                        if (modalElement) {
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            if (modal) {
                                modal.hide();
                            }
                        }
                    } else {
                        alert('Failed to create lead. Please try again.');
                    }
                },
                error: (error) => {
                    console.error('Error creating lead:', error);
                    alert('Error creating lead. Please try again.');
                }
            });
        }
    }

    resetLeadForm() {
        this.newLead = {
            name: '',
            number: '',
            email: '',
            leadType: '',
            leadSource: '',
            notes: '',
            document: null,
            company: '',
            assignedTo: '',
            country: '',
            state: 1,
            city: '',
            status: 1,
            attachment: '',
            deleted: false
        };
        this.selectedLead = null;

        // Reset modal title
        const modalTitle = document.getElementById('createLeadModalLabel');
        if (modalTitle) {
            modalTitle.textContent = 'Create New Lead';
        }
    }

    validateLeadForm(): boolean {
        if (!this.newLead.name || !this.newLead.email || !this.newLead.number) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
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

    deleteLead(leadId: string, event: Event) {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this lead?')) {
            this.api.get(`api/DeleteLead/${leadId}`, null).subscribe((res: any) => {
                if (res.status == 200) {
                    this.getLeads();
                }
            });
        }
    }

    editLead(lead: any) {
        // Get lead details first
        this.api.getLeadById(lead.id).subscribe({
            next: (response: any) => {
                if (response.data) {
                    // Populate the form with lead data
                    this.newLead = {
                        name: response.data.leadName,
                        number: response.data.phone,
                        email: response.data.email,
                        company: response.data.company,
                        country: response.data.country,
                        state: response.data.state,
                        city: response.data.city,
                        leadSource: response.data.leadSource_id,
                        leadType: response.data.leadType_id,
                        notes: response.data.notes,
                        status: response.data.status_id,
                        assignedTo: response.data.assignedTo_id, // This will be the user ID
                        attachment: response.data.attachment,
                        deleted: response.data.deleted
                    };

                    // Store the lead ID for update
                    this.selectedLead = lead;

                    // Open the modal
                    const modalElement = document.getElementById('createLeadModal');
                    if (modalElement) {
                        const modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    }

                    // Update modal title
                    const modalTitle = document.getElementById('createLeadModalLabel');
                    if (modalTitle) {
                        modalTitle.textContent = 'Edit Lead';
                    }
                }
            },
            error: (error) => {
                console.error('Error fetching lead details:', error);
                alert('Error fetching lead details. Please try again.');
            }
        });
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

    getUsers() {
        this.api.get('api/GetAllEmployee/', null).subscribe((res: any) => {
            if (res.data) {
                this.users = res.data.map((user: any) => ({
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    mobile_no: user.mobile_no,
                    role_name: user.role_name,
                    department_name: user.department_name,
                    branch_name: user.branch_name,
                    designation_name: user.designation_name
                }));
                console.log('Users loaded:', this.users);
            }
        });
    }

    getUserDetails(userId: number): any {
        return this.users.find(user => user.id === userId);
    }
}