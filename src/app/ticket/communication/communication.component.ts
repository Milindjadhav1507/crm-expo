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
    // Get ticket ID from route parameter
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.ticketId) {
      this.snackBar.open('Invalid ticket ID', 'Close', { duration: 3000 });
      this.router.navigate(['/tickets']);
      return;
    }

    // Initialize with hardcoded communication history
    this.initializeHardcodedHistory();
  }

  private initializeHardcodedHistory(): void {
    // Hardcoded communication history
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
      },
      {
        id: 3,
        message: 'Initial assessment completed',
        author: 'John Doe',
        timestamp: new Date(Date.now() - 21600000),
        type: 'user'
      },
      {
        id: 4,
        message: 'Working on a solution',
        author: 'Support Agent',
        timestamp: new Date(Date.now() - 10800000),
        type: 'agent'
      }
    ];
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.ticketId) {
      const comment: Communication = {
        id: Date.now(), // Generate a unique ID
        message: this.commentForm.get('message')?.value,
        author: 'Current User', // Hardcoded user for demo
        timestamp: new Date(),
        type: 'user'
      };

      // Add to local history
      this.history.push(comment);

      // Emit the new communication
      this.onNewCommunication.emit(comment);

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
