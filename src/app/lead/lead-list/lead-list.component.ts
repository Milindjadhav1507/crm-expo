import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-lead-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatLabel,
        MatInputModule,
        MatDialogModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatMenuModule,
        MatChipsModule
    ],
    templateUrl: './lead-list.component.html',
    styleUrls: ['./lead-list.component.scss'],
})
export class LeadListComponent implements OnInit {
    @ViewChild('leadDetailsDialog') leadDetailsDialog!: TemplateRef<any>;
    @ViewChild('createLeadDialog') createLeadDialog!: TemplateRef<any>;
    @ViewChild('followUpDialog') followUpDialog!: TemplateRef<any>;

    leads: any[] = [];
    filteredLeads: any[] = [];
    paginatedLeads: any[] = [];
    displayMode: 'list' | 'grid' = 'list';
    searchQuery: string = '';
    loading: boolean = true;
    selectedFilter: string = 'all';
    leadForm: FormGroup;
    selectedLead: any = null;
    pageSize: number = 10;
    currentPage: number = 1;
    totalPages: number = 1;

    followUpData = {
        leadName: '',
        status: '',
        nextFollowUpDate: '',
        comments: '',
        isMeetingScheduled: false,
        meetingPlatform: '',
        meetingLink: '',
        assignedTo: '',
        leadType: ''
    };

    users = [
        'John Doe',
        'Jane Smith',
        'Robert Johnson',
        'Emily Davis',
        'Michael Wilson'
    ];

    leadTypes = ['Hot', 'Warm', 'Cold'];

    constructor(
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.leadForm = this.fb.group({
            name: ['', Validators.required],
            number: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            assignedTo: [''],
            leadType: [''],
            leadSource: [''],
            company: [''],
            notes: ['']
        });
    }

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
                assignedTo: 'John Doe'
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

    viewDetails(lead: any): void {
        this.selectedLead = lead;
        const dialogRef = this.dialog.open(this.leadDetailsDialog, {
            width: '400px'
        });

        dialogRef.afterClosed().subscribe(() => {
            this.selectedLead = null;
        });
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

    onFileSelect(event: any): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            // Handle file upload logic here
            console.log('File selected:', file);
        }
    }

    openCreateLeadDialog(): void {
        const dialogRef = this.dialog.open(this.createLeadDialog, {
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createLead();
            }
        });
    }

    openFollowUpDialog(lead: any): void {
        this.followUpData = {
            leadName: lead.name,
            status: '',
            nextFollowUpDate: '',
            comments: '',
            isMeetingScheduled: false,
            meetingPlatform: '',
            meetingLink: '',
            assignedTo: lead.assignedTo,
            leadType: lead.leadType
        };

        const dialogRef = this.dialog.open(this.followUpDialog, {
            width: '500px',
            disableClose: false
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.saveFollowUp();
            }
        });
    }

    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.applyPagination();
    }

    createLead(): void {
        if (this.leadForm.valid) {
            const newLead = {
                ...this.leadForm.value,
                id: `L${String(this.leads.length + 1).padStart(3, '0')}`,
                status: 'New',
                createdDate: new Date().toISOString().split('T')[0],
                imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${this.leadForm.value.name}`
            };

            this.leads.push(newLead);
            this.filterLeads();
            this.dialog.closeAll();
            this.leadForm.reset();
        }
    }

    deleteLead(leadId: string): void {
        if (confirm('Are you sure you want to delete this lead?')) {
            this.leads = this.leads.filter(lead => lead.id !== leadId);
            this.filterLeads();
        }
    }

    onStatusChange(): void {
        if (this.followUpData.status !== 'Meeting') {
            this.followUpData.isMeetingScheduled = false;
            this.followUpData.meetingPlatform = '';
            this.followUpData.meetingLink = '';
        }
    }

    saveFollowUp(): void {
        // Implement your follow-up saving logic here
        console.log('Saving follow-up:', this.followUpData);
        this.dialog.closeAll();
    }
}