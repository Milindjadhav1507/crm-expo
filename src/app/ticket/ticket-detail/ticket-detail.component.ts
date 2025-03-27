import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '../ticket-list/ticket-list.component';
import { CommunicationComponent } from "../communication/communication.component";
import { TicketService, Comment } from '../ticket.service';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    // CommunicationComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  @Input() ticket: Ticket | null = null;

  commentForm: FormGroup;
  comments$: Observable<Comment[]> = of([]);
  recentComments: Comment[] = [];
  recentAttachments: string[] = [];
  selectedFile: File | null = null;
  editingComment: Comment | null = null;
  private destroy$ = new Subject<void>();

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
    private fb: FormBuilder,
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.commentForm = this.fb.group({
      message: ['', [Validators.required]],
      attachments: [[]]
    });
  }

  ngOnInit(): void {
    if (this.ticket) {
      this.comments$ = this.ticketService.getCommentsForTicket(this.ticket.id);
      this.recentAttachments = this.ticketService.getRecentAttachments(this.ticket.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const fakeUrl = URL.createObjectURL(this.selectedFile);
      this.recentAttachments.push(fakeUrl);
    }
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.ticket) {
      const newComment: Comment = {
        id: Date.now(),
        ticketId: this.ticket.id,
        message: this.commentForm.get('message')?.value,
        attachments: this.recentAttachments,
        userId: 1,
        userName: 'Current User',
        timestamp: new Date()
      };

      this.ticketService.addComment(newComment);

      // Add to recent comments
      this.recentComments.unshift(newComment);

      // Show success message
      this.snackBar.open('Your comment has been saved successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      // Reset form
      this.commentForm.reset();
      this.recentAttachments = [];
      this.selectedFile = null;
    }
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

  editComment(comment: Comment): void {
    this.editingComment = comment;
    this.commentForm.patchValue({
      message: comment.message
    });
    this.recentAttachments = [...comment.attachments];
  }

  cancelEdit(): void {
    this.editingComment = null;
    this.commentForm.reset();
    this.recentAttachments = [];
  }

  updateComment(): void {
    if (this.commentForm.valid && this.editingComment && this.ticket) {
      const updatedComment: Comment = {
        ...this.editingComment,
        message: this.commentForm.get('message')?.value,
        attachments: this.recentAttachments,
        timestamp: new Date()
      };

      this.ticketService.updateComment(updatedComment);

      // Show success message
      this.snackBar.open('Comment updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      // Reset form and editing state
      this.editingComment = null;
      this.commentForm.reset();
      this.recentAttachments = [];
    }
  }

  deleteComment(comment: Comment): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.ticketService.deleteComment(comment.id);

      // Show success message
      this.snackBar.open('Comment deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}
