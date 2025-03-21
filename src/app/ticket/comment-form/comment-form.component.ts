import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent implements OnInit {
  commentForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
      ticket: ['', [Validators.required]],
      commented_by: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Initialize with hardcoded data if needed
  }

  onSubmit(): void {
    if (this.commentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        const formData = this.commentForm.value;

        // Simulate API call with setTimeout
        setTimeout(() => {
          console.log('Comment submitted:', formData);
          this.snackBar.open('Comment submitted successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/tickets']);
        }, 1000);
      } catch (error) {
        console.error('Error submitting comment:', error);
        this.snackBar.open('Error submitting comment. Please try again.', 'Close', {
          duration: 3000
        });
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched(this.commentForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
