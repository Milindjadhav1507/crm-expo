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

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,MatListModule,MatButtonModule,MatCardModule,MatIconModule,MatFormFieldModule,MatSelectModule,MatLabel,MatInputModule],
  templateUrl: './lead-list.component.html',
  styleUrl: './lead-list.component.scss',
})
export class LeadListComponent implements OnInit {
  leads: any[] = [];
  filteredLeads: any[] = [];
  paginatedLeads: any[] = [];
  displayMode: 'list' | 'grid' = 'list';
  searchQuery: string = '';
  loading: boolean = true; // Skeleton loader state
  selectedFilter: string = 'all';
  newLead: any = {
    name: '',
    number: '',
    email: '',
    leadType: '',
    leadSource: '',
    notes: '',
    document: null,
    company: ''
  };

  followUpData = {
    leadName: '', // Auto-populated lead name
    status: '', // Follow-up status
    nextFollowUpDate: '', // Next follow-up date
    comments: '', // Comments
    isMeetingScheduled: false, // Toggle for meeting fields
    meetingPlatform: '', // Meeting platform
    meetingLink: '' // Meeting link
  };


  openFollowUpModal(lead: any, event: Event) {
    event.stopPropagation(); // Prevents triggering viewDetails when clicking Follow Up
    this.followUpData = {
      leadName: lead.name, // Auto-populate the lead name
      status: '',
      nextFollowUpDate: '',
      comments: '',
      isMeetingScheduled: false,
      meetingPlatform: '',
      meetingLink: ''
    }; // Reset modal fields

    // Get the modal element safely
    const modalElement = document.getElementById('followUpModal');
    
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("Follow-Up Modal not found in the DOM.");
    }
  }
  onStatusChange() {
    // Reset meeting fields if status is not "Meeting"
    if (this.followUpData.status !== 'Meeting') {
      this.followUpData.isMeetingScheduled = false;
      this.followUpData.meetingPlatform = '';
      this.followUpData.meetingLink = '';
    }
  }

  saveFollowUp() {
    console.log("Follow-up saved:", this.followUpData);
    // Add logic to save follow-up data
  }
  
onFileSelect(event: any) {
  if (event.target.files.length > 0) {
    this.newLead.document = event.target.files[0];
  }
}

createLead() {
  if (!this.newLead.name || !this.newLead.number || !this.newLead.email) {
    alert("Name, Number, and Email are required.");
    return;
  }

  // Save lead logic (push to array or API call)
  console.log('Lead Created:', this.newLead);

  // Close modal after saving
  const modalElement = document.getElementById('createLeadModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    } else {
      // If no instance exists, create one and hide it
      const newModal = new bootstrap.Modal(modalElement);
      newModal.hide();
    }
  }

  

  // Reset Form
  this.newLead = {
    name: '',
    number: '',
    email: '',
    leadType: '',
    leadSource: '',
    notes: '',
    document: null,
    company: ''
  };
}
  // Pagination variables
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  selectedLead: any = null;

  constructor() {}

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
      },
      {
        id: 'L006',
        name: 'Ishaan Reddy',
        email: 'ishaan.reddy@example.com',
        phone: '9123456785',
        leadSource: 'Website',
        leadType: 'Warm Lead',
        company: 'Company 6',
        status: 'Qualified',
        createdDate: '2024-02-06',
        notes: 'Follow-up required',
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ishaan Reddy',
      },
      {
        id: 'L007',
        name: 'Kavya Joshi',
        email: 'kavya.joshi@example.com',
        phone: '9123456786',
        leadSource: 'Referral',
        leadType: 'Hot Lead',
        company: 'Company 7',
        status: 'New',
        createdDate: '2024-02-07',
        notes: 'Interested in product demo',
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavya Joshi',
      },
      {
        id: 'L008',
        name: 'Reyansh Mishra',
        email: 'reyansh.mishra@example.com',
        phone: '9123456787',
        leadSource: 'Social Media',
        leadType: 'Cold Lead',
        company: 'Company 8',
        status: 'Contacted',
        createdDate: '2024-02-08',
        notes: 'Follow-up required',
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Reyansh Mishra',
      },
      {
        id: 'L009',
        name: 'Saanvi Desai',
        email: 'saanvi.desai@example.com',
        phone: '9123456788',
        leadSource: 'Email Campaign',
        leadType: 'Warm Lead',
        company: 'Company 9',
        status: 'Qualified',
        createdDate: '2024-02-09',
        notes: 'Interested in product demo',
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Saanvi Desai',
      },
      {
        id: 'L010',
        name: 'Vihaan Choudhary',
        email: 'vihaan.choudhary@example.com',
        phone: '9123456789',
        leadSource: 'Event',
        leadType: 'Hot Lead',
        company: 'Company 10',
        status: 'New',
        createdDate: '2024-02-10',
        notes: 'Follow-up required',
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Vihaan Choudhary',
      },
      { id: 'L011', name: 'Riya Mehta', email: 'riya.mehta@example.com', phone: '9123456790', leadSource: 'Website', leadType: 'Cold Lead', company: 'Company 11', status: 'Contacted', createdDate: '2024-02-11', notes: 'Requested brochure', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Riya Mehta' },
      { id: 'L012', name: 'Yash Verma', email: 'yash.verma@example.com', phone: '9123456791', leadSource: 'Referral', leadType: 'Warm Lead', company: 'Company 12', status: 'Qualified', createdDate: '2024-02-12', notes: 'Interested in partnership', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Yash Verma' },
      { id: 'L013', name: 'Sanya Kapoor', email: 'sanya.kapoor@example.com', phone: '9123456792', leadSource: 'Social Media', leadType: 'Hot Lead', company: 'Company 13', status: 'New', createdDate: '2024-02-13', notes: 'Wants product demo', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Sanya Kapoor' },
      { id: 'L014', name: 'Ayaan Malik', email: 'ayaan.malik@example.com', phone: '9123456793', leadSource: 'Event', leadType: 'Cold Lead', company: 'Company 14', status: 'Contacted', createdDate: '2024-02-14', notes: 'Asked for pricing details', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ayaan Malik' },
      { id: 'L015', name: 'Ishita Bansal', email: 'ishita.bansal@example.com', phone: '9123456794', leadSource: 'Website', leadType: 'Warm Lead', company: 'Company 15', status: 'Qualified', createdDate: '2024-02-15', notes: 'Looking for long-term contract', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ishita Bansal' },
      { id: 'L016', name: 'Kabir Sethi', email: 'kabir.sethi@example.com', phone: '9123456795', leadSource: 'Referral', leadType: 'Hot Lead', company: 'Company 16', status: 'New', createdDate: '2024-02-16', notes: 'Interested in bulk order', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Kabir Sethi' },
      { id: 'L017', name: 'Meera Nair', email: 'meera.nair@example.com', phone: '9123456796', leadSource: 'Social Media', leadType: 'Cold Lead', company: 'Company 17', status: 'Contacted', createdDate: '2024-02-17', notes: 'Requested price quote', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Meera Nair' },
      { id: 'L018', name: 'Rajesh Khanna', email: 'rajesh.khanna@example.com', phone: '9123456797', leadSource: 'Website', leadType: 'Warm Lead', company: 'Company 18', status: 'Qualified', createdDate: '2024-02-18', notes: 'Looking for demo session', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh Khanna' },
      { id: 'L019', name: 'Simran Chatterjee', email: 'simran.chatterjee@example.com', phone: '9123456798', leadSource: 'Email Campaign', leadType: 'Hot Lead', company: 'Company 19', status: 'New', createdDate: '2024-02-19', notes: 'Wants product samples', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Simran Chatterjee' },
      { id: 'L020', name: 'Devendra Yadav', email: 'devendra.yadav@example.com', phone: '9123456799', leadSource: 'Event', leadType: 'Cold Lead', company: 'Company 20', status: 'Contacted', createdDate: '2024-02-20', notes: 'Asked for company profile', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Devendra Yadav' },
      { id: 'L021', name: 'Neha Saxena', email: 'neha.saxena@example.com', phone: '9123456800', leadSource: 'Website', leadType: 'Warm Lead', company: 'Company 21', status: 'Qualified', createdDate: '2024-02-21', notes: 'Needs follow-up', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha Saxena' },
      { id: 'L022', name: 'Aryan Joshi', email: 'aryan.joshi@example.com', phone: '9123456801', leadSource: 'Referral', leadType: 'Hot Lead', company: 'Company 22', status: 'New', createdDate: '2024-02-22', notes: 'Interested in partnership', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Aryan Joshi' },
      { id: 'L023', name: 'Tara Iyer', email: 'tara.iyer@example.com', phone: '9123456802', leadSource: 'Social Media', leadType: 'Cold Lead', company: 'Company 23', status: 'Contacted', createdDate: '2024-02-23', notes: 'Requested free trial', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Tara Iyer' },
      { id: 'L024', name: 'Harsh Vardhan', email: 'harsh.vardhan@example.com', phone: '9123456803', leadSource: 'Email Campaign', leadType: 'Warm Lead', company: 'Company 24', status: 'Qualified', createdDate: '2024-02-24', notes: 'Looking for exclusive deal', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Harsh Vardhan' },
      { id: 'L025', name: 'Radhika Rao', email: 'radhika.rao@example.com', phone: '9123456804', leadSource: 'Event', leadType: 'Hot Lead', company: 'Company 25', status: 'New', createdDate: '2024-02-25', notes: 'Asked about warranty', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Radhika Rao' }
      // Add more leads as needed (up to 25)
    ];
  
    this.filterLeads();
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
    const modalElement = document.getElementById('leadModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Pagination logic
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

  followUp(lead: any, event: Event) {
    event.stopPropagation(); // Prevents triggering viewDetails when clicking Follow Up
    console.log("Follow-up initiated for:", lead.name);
    // Add your follow-up logic here
  }
  
}