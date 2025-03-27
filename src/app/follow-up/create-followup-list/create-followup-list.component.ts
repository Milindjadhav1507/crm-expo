import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-create-followup-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './create-followup-list.component.html',
  styleUrl: './create-followup-list.component.scss'
})
export class CreateFollowupListComponent {
  leads: any[] = []; // Array to store leads
  selectedLead: any = {
    activities: [],
    notes: [],
    meetings: []
  }; // Variable to store the selected lead
  filteredLeads: any[] = []; // Array to store filtered leads
  searchQuery: string = ''; // Search query for filtering
  statusFilter: string = 'All'; // Status filter (default: 'All')
  @ViewChild('editModal') editModal!: TemplateRef<any>; // Reference to the modal template
  editForm!: FormGroup;

  @ViewChild('followUpModal') followUpModal!: TemplateRef<any>; // Reference to the follow-up modal template
  followUpData: any = {
    leadName: '',
    status: '',
    nextFollowUpDate: '',
    comments: '',
    isMeetingScheduled: false,
    meetingPlatform: '',
    meetingLink: '',
  };
  newNote: any = {
    content: '',
    attachment: null as { name: string; url: string; } | null
  };
  selectedFile: File | null = null;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.loadHardcodedLeads(); 
    this.filterLeads(); // Apply initial filter// Load hardcoded data
    this.selectedLead = this.filteredLeads[0]; // Set the first lead as selected by default
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      company: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  

   // Open the edit modal
   openEditModal(lead: any): void {
    this.selectedLead = lead;
    this.editForm.patchValue({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
    });

    const dialogRef = this.dialog.open(this.editModal, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateLead(result);
      }
    });
  }

   // Cancel the edit
   onCancelEdit(): void {
    this.dialog.closeAll();
  }

  // Update the lead in the list
  updateLead(updatedData: any): void {
    const index = this.leads.findIndex((l) => l.id === this.selectedLead.id);
    if (index !== -1) {
      this.leads[index] = { ...this.leads[index], ...updatedData };
      this.filterLeads(); // Refresh the filtered list
      this.selectedLead = this.leads[index]; // Update the selected lead
    }
  }


  statusOptions: string[] = ['All', 'New', 'Contacted', 'Qualified'];

 

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
        statusHistory: [
          {
            date: '2024-02-01',
            from: 'New',
            to: 'Contacted',
            assignedTo: 'John Doe',
          },
          {
            date: '2024-02-02',
            from: 'Contacted',
            to: 'Qualified',
            assignedTo: 'Jane Smith',
          },
        ],
        documents: [
          {
            date: '2024-02-03',
            fileName: 'Proposal.pdf',
            uploadedBy: 'John Doe',
            fileUrl: 'https://example.com/proposal.pdf',
          },
        ],
        comments: [
          {
            date: '2024-02-04',
            by: 'Jane Smith',
            text: 'Lead seems very interested. Follow up in 2 days.',
          },
          {
            date: '2024-02-05',
            by: 'John Doe',
            text: 'Sent proposal document.',
          },
        ],
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-14T09:00:00'),
            description: 'Lead created from referral program',
            user: 'System',
            duration: null
          },
          {
            type: 'Meeting',
            date: new Date('2024-03-14T11:00:00'),
            description: 'Product demo scheduled',
            user: 'Alex Brown',
            duration: '1 hour'
          },
          {
            type: 'Document',
            date: new Date('2024-03-14T15:30:00'),
            description: 'Sent proposal document',
            user: 'Sarah Wilson',
            duration: '5 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-13T10:00:00'),
            description: 'Lead created from trade show booth',
            user: 'System',
            duration: null
          },
          {
            type: 'Task',
            date: new Date('2024-03-13T14:00:00'),
            description: 'Schedule technical assessment',
            user: 'Mike Johnson',
            duration: '15 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-14T10:00:00'),
            description: 'Technical requirements discussion',
            user: 'Alex Brown',
            duration: '45 min'
          },
          {
            type: 'Email',
            date: new Date('2024-03-14T16:00:00'),
            description: 'Sent technical specifications',
            user: 'Sarah Wilson',
            duration: '3 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
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
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
      },
      { 
        id: 'L011', 
        name: 'Riya Mehta', 
        email: 'riya.mehta@example.com', 
        phone: '9123456790', 
        leadSource: 'Website', 
        leadType: 'Cold Lead', 
        company: 'Company 11', 
        status: 'Contacted', 
        createdDate: '2024-02-11', 
        notes: 'Requested brochure', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Riya Mehta',
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-15T10:30:00'),
            description: 'Lead created from website contact form',
            user: 'System',
            duration: null
          },
          {
            type: 'Email',
            date: new Date('2024-03-15T14:20:00'),
            description: 'Sent welcome email with product brochure',
            user: 'Sarah Wilson',
            duration: '2 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-16T09:15:00'),
            description: 'Initial discovery call - discussed requirements',
            user: 'Mike Johnson',
            duration: '30 min'
          }
        ],
        meetings: []
      },
      { 
        id: 'L012', 
        name: 'Yash Verma', 
        email: 'yash.verma@example.com', 
        phone: '9123456791', 
        leadSource: 'Referral', 
        leadType: 'Warm Lead', 
        company: 'Company 12', 
        status: 'Qualified', 
        createdDate: '2024-02-12', 
        notes: 'Interested in partnership', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Yash Verma',
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-14T09:00:00'),
            description: 'Lead created from referral program',
            user: 'System',
            duration: null
          },
          {
            type: 'Meeting',
            date: new Date('2024-03-14T11:00:00'),
            description: 'Product demo scheduled',
            user: 'Alex Brown',
            duration: '1 hour'
          },
          {
            type: 'Document',
            date: new Date('2024-03-14T15:30:00'),
            description: 'Sent proposal document',
            user: 'Sarah Wilson',
            duration: '5 min'
          }
        ],
        meetings: []
      },
      { 
        id: 'L013', 
        name: 'Sanya Kapoor', 
        email: 'sanya.kapoor@example.com', 
        phone: '9123456792', 
        leadSource: 'Social Media', 
        leadType: 'Hot Lead', 
        company: 'Company 13', 
        status: 'New', 
        createdDate: '2024-02-13', 
        notes: 'Wants product demo', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Sanya Kapoor',
        activities: [
          {
            type: 'New Lead',
            date: new Date('2024-03-13T10:00:00'),
            description: 'Lead created from trade show booth',
            user: 'System',
            duration: null
          },
          {
            type: 'Task',
            date: new Date('2024-03-13T14:00:00'),
            description: 'Schedule technical assessment',
            user: 'Mike Johnson',
            duration: '15 min'
          },
          {
            type: 'Call',
            date: new Date('2024-03-14T10:00:00'),
            description: 'Technical requirements discussion',
            user: 'Alex Brown',
            duration: '45 min'
          },
          {
            type: 'Email',
            date: new Date('2024-03-14T16:00:00'),
            description: 'Sent technical specifications',
            user: 'Sarah Wilson',
            duration: '3 min'
          }
        ],
        meetings: []
      },
      { 
        id: 'L014', 
        name: 'Ayaan Malik', 
        email: 'ayaan.malik@example.com', 
        phone: '9123456793', 
        leadSource: 'Event', 
        leadType: 'Cold Lead', 
        company: 'Company 14', 
        status: 'Contacted', 
        createdDate: '2024-02-14', 
        notes: 'Asked for pricing details', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ayaan Malik',
        activities: [],
        meetings: []
      },
      { 
        id: 'L015', 
        name: 'Ishita Bansal', 
        email: 'ishita.bansal@example.com', 
        phone: '9123456794', 
        leadSource: 'Website', 
        leadType: 'Warm Lead', 
        company: 'Company 15', 
        status: 'Qualified', 
        createdDate: '2024-02-15', 
        notes: 'Looking for long-term contract', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ishita Bansal',
        activities: [],
        meetings: []
      },
      { 
        id: 'L016', 
        name: 'Kabir Sethi', 
        email: 'kabir.sethi@example.com', 
        phone: '9123456795', 
        leadSource: 'Referral', 
        leadType: 'Hot Lead', 
        company: 'Company 16', 
        status: 'New', 
        createdDate: '2024-02-16', 
        notes: 'Interested in bulk order', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Kabir Sethi',
        activities: [],
        meetings: []
      },
      { 
        id: 'L017', 
        name: 'Meera Nair', 
        email: 'meera.nair@example.com', 
        phone: '9123456796', 
        leadSource: 'Social Media', 
        leadType: 'Cold Lead', 
        company: 'Company 17', 
        status: 'Contacted', 
        createdDate: '2024-02-17', 
        notes: 'Requested price quote', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Meera Nair',
        activities: [],
        meetings: []
      },
      { 
        id: 'L018', 
        name: 'Rajesh Khanna', 
        email: 'rajesh.khanna@example.com', 
        phone: '9123456797', 
        leadSource: 'Website', 
        leadType: 'Warm Lead', 
        company: 'Company 18', 
        status: 'Qualified', 
        createdDate: '2024-02-18', 
        notes: 'Looking for demo session', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh Khanna',
        activities: [],
        meetings: []
      },
      { 
        id: 'L019', 
        name: 'Simran Chatterjee', 
        email: 'simran.chatterjee@example.com', 
        phone: '9123456798', 
        leadSource: 'Email Campaign', 
        leadType: 'Hot Lead', 
        company: 'Company 19', 
        status: 'New', 
        createdDate: '2024-02-19', 
        notes: 'Wants product samples', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Simran Chatterjee',
        activities: [],
        meetings: []
      },
      { 
        id: 'L020', 
        name: 'Devendra Yadav', 
        email: 'devendra.yadav@example.com', 
        phone: '9123456799', 
        leadSource: 'Event', 
        leadType: 'Cold Lead', 
        company: 'Company 20', 
        status: 'Contacted', 
        createdDate: '2024-02-20', 
        notes: 'Asked for company profile', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Devendra Yadav',
        activities: [],
        meetings: []
      },
      { 
        id: 'L021', 
        name: 'Neha Saxena', 
        email: 'neha.saxena@example.com', 
        phone: '9123456800', 
        leadSource: 'Website', 
        leadType: 'Warm Lead', 
        company: 'Company 21', 
        status: 'Qualified', 
        createdDate: '2024-02-21', 
        notes: 'Needs follow-up', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha Saxena',
        activities: [],
        meetings: []
      },
      { 
        id: 'L022', 
        name: 'Aryan Joshi', 
        email: 'aryan.joshi@example.com', 
        phone: '9123456801', 
        leadSource: 'Referral', 
        leadType: 'Hot Lead', 
        company: 'Company 22', 
        status: 'New', 
        createdDate: '2024-02-22', 
        notes: 'Interested in partnership', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Aryan Joshi',
        activities: [],
        meetings: []
      },
      { 
        id: 'L023', 
        name: 'Tara Iyer', 
        email: 'tara.iyer@example.com', 
        phone: '9123456802', 
        leadSource: 'Social Media', 
        leadType: 'Cold Lead', 
        company: 'Company 23', 
        status: 'Contacted', 
        createdDate: '2024-02-23', 
        notes: 'Requested free trial', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Tara Iyer',
        activities: [],
        meetings: []
      },
      { 
        id: 'L024', 
        name: 'Harsh Vardhan', 
        email: 'harsh.vardhan@example.com', 
        phone: '9123456803', 
        leadSource: 'Email Campaign', 
        leadType: 'Warm Lead', 
        company: 'Company 24', 
        status: 'Qualified', 
        createdDate: '2024-02-24', 
        notes: 'Looking for exclusive deal', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Harsh Vardhan',
        activities: [],
        meetings: []
      },
      { 
        id: 'L025', 
        name: 'Radhika Rao', 
        email: 'radhika.rao@example.com', 
        phone: '9123456804', 
        leadSource: 'Event', 
        leadType: 'Hot Lead', 
        company: 'Company 25', 
        status: 'New', 
        createdDate: '2024-02-25', 
        notes: 'Asked about warranty', 
        imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Radhika Rao',
        activities: [],
        meetings: []
      }
    ];
  
    
  }
  
  // Function to handle lead selection
  onSelectLead(lead: any): void {
    this.selectedLead = lead;
  }

  filterLeads(): void {
    this.filteredLeads = this.leads.filter((lead) => {
      const matchesSearch = lead.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'All' || lead.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterLeads();
  }

  // Function to handle status filter changes
  onStatusChange(): void {
    this.filterLeads();
  }

  openFollowUpModal(lead: any): void {
    this.followUpData.leadName = lead.name; // Auto-populate lead name
    const dialogRef = this.dialog.open(this.followUpModal, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveFollowUp();
      }
    });
  }

    // Save the follow-up data
    saveFollowUp(): void {
      console.log('Follow-Up Data:', this.followUpData);
      // Add your logic to save the follow-up data
    }
  
    // Cancel the follow-up
    onCancelFollowUp(): void {
      this.dialog.closeAll();
    }
  

  // Save the edited lead
  onSaveEdit(): void {
    if (this.editForm.valid) {
      this.dialog.closeAll();
      this.updateLead(this.editForm.value);
    }
  }

  // Add these methods for meeting actions
  joinMeeting(meeting: any): void {
    console.log('Joining meeting:', meeting);
    // Implement meeting join logic
  }

  editMeeting(meeting: any): void {
    console.log('Editing meeting:', meeting);
    // Implement meeting edit logic
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Remove selected file
  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  // Add new note
  addNote(): void {
    if (!this.newNote.content) return;

    const note: {
      content: string;
      author: string;
      date: Date;
      attachment: { name: string; url: string; } | null;
    } = {
      content: this.newNote.content,
      author: 'Current User', // Replace with actual user name
      date: new Date(),
      attachment: null
    };

    // Handle file upload if file is selected
    if (this.selectedFile) {
      // In a real application, you would upload the file to a server
      // For now, we'll create a mock URL
      note.attachment = {
        name: this.selectedFile.name,
        url: URL.createObjectURL(this.selectedFile)
      };
    }

    // Initialize notes array if it doesn't exist
    if (!this.selectedLead.notes) {
      this.selectedLead.notes = [];
    }

    // Add note to selected lead
    this.selectedLead.notes.unshift(note);

    // Initialize activities array if it doesn't exist
    if (!this.selectedLead.activities) {
      this.selectedLead.activities = [];
    }

    // Add activity entry
    const activity = {
      type: 'Note',
      date: new Date(),
      description: `Added note: ${this.newNote.content.substring(0, 50)}${this.newNote.content.length > 50 ? '...' : ''}`,
      user: 'Current User',
      duration: null
    };
    this.selectedLead.activities.unshift(activity);

    // Reset form
    this.newNote.content = '';
    this.selectedFile = null;

    // Force change detection
    this.selectedLead = { ...this.selectedLead };
  }
}
