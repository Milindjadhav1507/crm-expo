import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TicketDetailComponent } from '../ticket-detail/ticket-detail.component';
import { TicketGenerationFormComponent } from '../ticket-generation-form/ticket-generation-form.component';
import { CrmApiService } from '../../crm-api.service';

export interface Communication {
  id: number;
  message: string;
  author: string;
  timestamp: Date;
  type: 'system' | 'agent' | 'user';
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Ticket {
  id: number;
  title: string;
  category_id: number;
  priority_id: number;
  description: string;
  attachments: string | null;
  contact_email: string;
  contact_phone: string;
  expected_resolution_date: string;
  additional_notes: string;
  status_id: number;
  assigned_to_id: number | null;
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
  deleted: boolean;
  statusName: string;
  categoryName: string;
  priorityName: string;
  assignedToName: string | null;
  createdByName: string;
}

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  priorityFilter = new FormControl('');
  private searchSubject = new Subject<string>();

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private api: CrmApiService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngOnInit(): void {
    this.ticketlist();
    
    this.searchControl.valueChanges.subscribe(value => {
      this.searchSubject.next(value || '');
    });

    this.statusFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.priorityFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ticketlist() {
    this.api.post('ticket/list_tickets/',null).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.tickets = response.data;
          this.filteredTickets = [...this.tickets];
        }
      },
      error: (error) => {
        this.snackBar.open('Error fetching tickets', 'Close', {
          duration: 3000
        });
      }
    });
  }

  applyFilters() {
    let filtered = [...this.tickets];
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const statusFilter = this.statusFilter.value?.toLowerCase() || '';
    const priorityFilter = this.priorityFilter.value?.toLowerCase() || '';

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(ticket =>
        ticket.statusName.toLowerCase() === statusFilter
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter(ticket =>
        ticket.priorityName.toLowerCase() === priorityFilter
      );
    }

    this.filteredTickets = filtered;
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

  openTicketDetails(ticket: Ticket): void {
    const dialogRef = this.dialog.open(TicketDetailComponent, {
      width: '800px',
      height: '80vh',
      data: {
        ticket: { ...ticket } // Pass a copy of the ticket
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the ticket in the list with the returned result
        const index = this.tickets.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.tickets[index] = result;
          this.applyFilters();
        }
      }
    });
  }
  openTicketcreation(ticket: Ticket): void {
    const dialogRef = this.dialog.open(TicketGenerationFormComponent, {
      width: '800px',
      height: '80vh',
      data: {
        ticket: { ...ticket } // Pass a copy of the ticket
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the ticket in the list with the returned result
        const index = this.tickets.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.tickets[index] = result;
          this.applyFilters();
        }
      }
    });
  }

  deleteTicket(ticket: Ticket): void {
    if (confirm(`Are you sure you want to delete ticket #${ticket.id}?`)) {
      // TODO: Implement ticket deletion
      const index = this.tickets.findIndex(t => t.id === ticket.id);
      if (index !== -1) {
        this.tickets.splice(index, 1);
        this.applyFilters();
        this.snackBar.open('Ticket deleted successfully', 'Close', {
          duration: 3000
        });
      }
    }
  }
}
