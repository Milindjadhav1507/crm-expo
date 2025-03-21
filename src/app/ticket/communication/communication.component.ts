import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Communication } from '../ticket-list/ticket-list.component';
import { EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {
  commentForm: FormGroup;
  ticketId: number | null = null;
  @Input() history: Communication[] = [];
  @Output() onNewCommunication = new EventEmitter<Communication>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(3)]],
      attachments: [[]]
    });
  }

  ngOnInit(): void {
    // Get ticket ID from route parameter instead of query param
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.ticketId) {
      this.snackBar.open('Invalid ticket ID', 'Close', { duration: 3000 });
      this.router.navigate(['/tickets']);
      return;
    }

    // TODO: Fetch communication history from service
    this.history = [
      {
        id: 1,
        message: 'Ticket created',
        author: 'System',
        timestamp: new Date(Date.now() - 86400000),
        type: 'system'
      },
      {
        id: 2,
        message: 'Investigating the issue',
        author: 'Support Agent',
        timestamp: new Date(Date.now() - 43200000),
        type: 'agent'
      }
    ];
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.ticketId) {
      const comment: Communication = {
        id: Date.now(), // Temporary ID generation
        message: this.commentForm.get('message')?.value,
        author: 'Current User', // TODO: Get from auth service
        timestamp: new Date(),
        type: 'user'
      };

      this.onNewCommunication.emit(comment);

      // Add to local history for demo
      this.history.push(comment);

      // TODO: Implement actual API call
      console.log('Adding comment:', comment);
      
      this.snackBar.open('Comment added successfully', 'Close', {
        duration: 3000
      });

      // Clear form
      this.commentForm.reset({
        message: '',
        attachments: []
      });
    }
  }

  onCancel(): void {
    if (this.ticketId) {
      this.router.navigate(['/tickets', this.ticketId]);
    } else {
      this.router.navigate(['/tickets']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const files = Array.from(input.files);
      this.commentForm.patchValue({
        attachments: files
      });
    }
  }

  removeAttachment(index: number): void {
    const attachments = [...(this.commentForm.get('attachments')?.value || [])];
    attachments.splice(index, 1);
    this.commentForm.patchValue({
      attachments
    });
  }
}
