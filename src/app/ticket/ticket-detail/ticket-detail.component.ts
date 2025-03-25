import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
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
  @Input() ticket: Ticket | null = null;

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

  constructor() {}

  ngOnInit(): void {}

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
    // This will be handled by the parent component
    window.history.back();
  }

  onEdit(): void {
    // This will be handled by the parent component
    console.log('Edit ticket:', this.ticket?.id);
  }

  onAddComment(): void {
    // This will be handled by the parent component
    console.log('Add comment to ticket:', this.ticket?.id);
  }
}
