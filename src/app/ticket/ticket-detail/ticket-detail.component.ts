import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../ticket-list/ticket-list.component';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  isDialog = false;

  statusColors: { [key: string]: string } = {
    'Open': 'accent',
    'In Progress': 'primary',
    'Resolved': 'primary',
    'Closed': 'warn',
    'Pending': 'accent'
  };

  priorityColors: { [key: string]: string } = {
    'High': 'warn',
    'Medium': 'accent',
    'Low': 'primary'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<TicketDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket }
  ) {
    this.isDialog = !!dialogRef;
  }

  ngOnInit(): void {
    if (this.isDialog && this.data?.ticket) {
      this.ticket = { ...this.data.ticket };
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        // Use hardcoded data instead of API call
        this.ticket = this.getHardcodedTicket(parseInt(id));
      }
    }
  }

  private getHardcodedTicket(id: number): Ticket | null {
    // Hardcoded ticket data
    const tickets: Ticket[] = [
      {
        id: 1,
        title: 'System Login Issue',
        category_id: 1,
        priority_id: 1,
        description: 'Users unable to login to the system',
        attachments: null,
        contact_email: 'user1@example.com',
        contact_phone: '123-456-7890',
        expected_resolution_date: '2024-03-25',
        additional_notes: 'Affecting multiple users',
        status_id: 1,
        assigned_to_id: 1,
        created_by_id: 2,
        created_at: '2024-03-20T10:00:00',
        updated_at: null,
        deleted: false,
        statusName: 'Open',
        categoryName: 'Technical',
        priorityName: 'High',
        assignedToName: 'John Doe',
        createdByName: 'Admin'
      },
      {
        id: 2,
        title: 'Payment Processing Error',
        category_id: 2,
        priority_id: 2,
        description: 'Payment gateway integration issues',
        attachments: null,
        contact_email: 'user2@example.com',
        contact_phone: '098-765-4321',
        expected_resolution_date: '2024-03-26',
        additional_notes: 'Affecting checkout process',
        status_id: 2,
        assigned_to_id: 2,
        created_by_id: 1,
        created_at: '2024-03-19T15:30:00',
        updated_at: '2024-03-20T09:00:00',
        deleted: false,
        statusName: 'In Progress',
        categoryName: 'Billing',
        priorityName: 'Medium',
        assignedToName: 'Jane Smith',
        createdByName: 'Support'
      },
      {
        id: 3,
        title: 'Feature Request: Dark Mode',
        category_id: 3,
        priority_id: 3,
        description: 'Add dark mode support to the application',
        attachments: null,
        contact_email: 'user3@example.com',
        contact_phone: '555-555-5555',
        expected_resolution_date: '2024-04-01',
        additional_notes: 'User preference enhancement',
        status_id: 3,
        assigned_to_id: null,
        created_by_id: 3,
        created_at: '2024-03-18T11:20:00',
        updated_at: null,
        deleted: false,
        statusName: 'Pending',
        categoryName: 'Feature',
        priorityName: 'Low',
        assignedToName: null,
        createdByName: 'User'
      }
    ];

    return tickets.find(t => t.id === id) || null;
  }

  getStatusColor(status: string): string {
    return this.statusColors[status] || 'primary';
  }

  getPriorityColor(priority: string): string {
    return this.priorityColors[priority] || 'primary';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  onBack(): void {
    if (this.isDialog) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/tickets']);
    }
  }

  onEdit(): void {
    if (this.ticket) {
      // Navigate to edit page or open edit dialog
      this.router.navigate(['/tickets', this.ticket.id, 'edit']);
    }
  }

  onClose(): void {
    if (this.ticket) {
      const updatedTicket = { ...this.ticket };
      updatedTicket.statusName = 'Closed';
      this.snackBar.open('Ticket closed successfully', 'Close', {
        duration: 3000
      });
      if (this.isDialog) {
        this.dialogRef.close(updatedTicket);
      }
    }
  }

  onAddComment(): void {
    if (this.ticket) {
      this.router.navigate(['/tickets', this.ticket.id, 'comment']);
    }
  }
}
