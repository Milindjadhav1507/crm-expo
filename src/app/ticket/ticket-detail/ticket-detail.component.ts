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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<TicketDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket }
  ) {
    this.isDialog = !!dialogRef;
    if (this.data?.ticket) {
      this.ticket = this.data.ticket;
    }
  }

  ngOnInit(): void {
    if (!this.isDialog) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        // TODO: Fetch ticket details from API
        // this.ticket = {
          // id: parseInt(id),
          // title: 'Sample Ticket',
          // description: 'Sample Description',
          // status: 'pending',
          // priority: 'medium',
          // category: 'general',
          // createdAt: new Date(),
          // communicationHistory: []
        // };
      }
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      open: 'accent',
      'in-progress': 'primary',
      resolved: 'primary',
      closed: 'warn',
      pending: 'accent'
    };
    return colors[status] || 'primary';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      high: 'warn',
      medium: 'accent',
      low: 'primary'
    };
    return colors[priority] || 'primary';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  onEdit(): void {
    if (this.ticket) {
      if (this.isDialog) {
        this.dialogRef.close();
      }
      this.router.navigate(['/ticket/', this.ticket.id, "/edit"]);
    }
  }

  onClose(): void {
    if (!this.ticket) return;

    if (confirm('Are you sure you want to close this ticket?')) {
      // TODO: API call to close ticket
      // this.ticket.status = 'closed';
      this.snackBar.open('Ticket closed successfully', 'Close', {
        duration: 3000
      });
      if (this.isDialog) {
        this.dialogRef.close(this.ticket);
      }
    }
  }

  onAcceptChanges(): void {
    if (!this.ticket) return;

    if (confirm('Are you sure you want to accept the changes?')) {
      // TODO: API call to accept changes
      // this.ticket.status = 'in-progress';
      
      // Add a system comment about accepting changes
      // this.ticket.communicationHistory.push({
      //   id: this.ticket.communicationHistory.length + 1,
      //   message: 'Changes accepted by user',
      //   author: 'System',
      //   timestamp: new Date(),
      //   type: 'system'
      // });

      this.snackBar.open('Changes accepted successfully', 'Close', { duration: 3000 });
      
      if (this.isDialog) {
        this.dialogRef.close(this.ticket);
      }
    }
  }

  onAddComment(): void {
    if (this.ticket) {
      if (this.isDialog) {
        this.dialogRef.close();
      }
      this.router.navigate(['/ticket', this.ticket.id, 'comment'], {
        queryParams: { ticketId: this.ticket.id }
      });
    }
  }

  onBack(): void {
    if (this.isDialog) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/ticket']);
    }
  }
}
