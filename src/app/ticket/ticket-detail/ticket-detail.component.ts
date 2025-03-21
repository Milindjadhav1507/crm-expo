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
  ticket:any = {
    id: 12345,
    title: 'Sample Ticket Title',
    status: 'open',
    priority: 'high',
    category: 'Bug',
    createdBy: 'John Doe',
    assignedTo: 'Jane Smith',
    createdAt: new Date('2025-03-01T10:00:00'),
    updatedAt: new Date('2025-03-20T15:30:00'),
    description: 'This is a sample description for the ticket.',
    attachments: [
      { name: 'Document.pdf', url: 'https://example.com/document.pdf' },
      { name: 'Screenshot.png', url: 'https://example.com/screenshot.png' }
    ],
    communicationHistory: [
      {
        author: 'John Doe',
        timestamp: new Date('2025-03-01T11:00:00'),
        message: 'Initial ticket creation.',
        type: 'comment'
      },
      {
        author: 'Jane Smith',
        timestamp: new Date('2025-03-02T14:00:00'),
        message: 'Assigned to me for resolution.',
        type: 'update'
      }
    ]
  };
  isDialog = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<TicketDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket }
  ) {
    this.isDialog = !!dialogRef;

    // Use the provided ticket data if it exists, otherwise keep the hardcoded ticket
    if (this.data?.ticket) {
      // Merge the provided ticket data with the hardcoded ticket
      this.ticket = { ...this.ticket, ...this.data.ticket };
    } else {
      console.warn('No ticket data provided via dialog. Using hardcoded ticket.');
    }
  }

  ngOnInit(): void {
    if (!this.isDialog) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        // TODO: Fetch ticket details from API
        // this.ticket = {
        //   id: parseInt(id),
        //   title: 'Sample Ticket',
        //   description: 'Sample Description',
        //   status: 'pending',
        //   priority: 'medium',
        //   category: 'general',
        //   createdAt: new Date(),
        //   communicationHistory: []
        // };
      }
    }
  }

  getStatusColor(status: string): string {
    return status === 'open' ? 'primary' : 'warn';
  }

  getPriorityColor(priority: string): string {
    return priority === 'high' ? 'warn' : 'accent';
  }

  formatDate(date: Date): string {
    return date.toLocaleString();
  }

  onEdit(): void {
    console.log('Edit Ticket');
  }

  onClose(): void {
    console.log('Close Ticket');
  }

  onAddComment(): void {
    console.log('Add Comment');
  }

  onBack(): void {
    console.log('Back to Tickets');
  }
}
