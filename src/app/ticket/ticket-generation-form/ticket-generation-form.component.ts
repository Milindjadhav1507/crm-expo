import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
// import { MatNativeDateModule } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Ticket, TicketStatus } from '../ticket.interface';
import { CrmApiService } from '../../crm-api.service';

@Component({
  selector: 'app-ticket-generation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule, // ✅ Ensure this is included
    // MatNativeDateModule,
    MatIconModule,NgFor,NgIf
  ],
  templateUrl: './ticket-generation-form.component.html',
  styleUrls: ['./ticket-generation-form.component.scss'],

})
export class TicketGenerationFormComponent implements OnInit {
  @Input() ticket: Ticket | null = null;
  @Output() ticketCreated = new EventEmitter<Ticket>();
  ticketForm!: FormGroup;
  isSubmitting = false;
  maxDate = new Date();

  // priorities = [
  //   { value: 'high', label: 'High' },
  //   { value: 'medium', label: 'Medium' },
  //   { value: 'low', label: 'Low' }
  // ];
  priorities:any
  // categories = [
  //   { value: 'technical', label: 'Technical Issue' },
  //   { value: 'billing', label: 'Billing Issue' },
  //   { value: 'feature', label: 'Feature Request' },
  //   { value: 'bug', label: 'Bug Report' },
  //   { value: 'other', label: 'Other' }
  // ];
categories:any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private api:CrmApiService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Any initialization logic
    this.ticketType()
    this.priority()
    console.log("milind ngOnIt ticket genreation component");

  }

  ticketType(){
    this.api.get('ticket/getall_tickettypes/').subscribe((res:any)=>{
      console.log(res);
      this.categories=res.data
    })
  }
  priority(){
    this.api.get('ticket/getall_priority/').subscribe((res:any)=>{
      console.log(res);
      this.priorities=res.data
    })
  }
  private initForm(): void {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      attachments: [],
      contact_email: ['', [Validators.email]],
      contact_phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      expected_resolution_date: [''],
      additional_notes: ['']
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      this.ticketForm.patchValue({
        attachments: fileList
      });
    }
  }

  removeAttachment(index: number) {
    const attachments = [...this.ticketForm.get('attachments')?.value];
    attachments.splice(index, 1);
    this.ticketForm.patchValue({
      attachments: attachments
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.ticketForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        if (controlName === 'contactPhone') {
          return 'Please enter a valid 10-digit phone number';
        }
        return 'Invalid format';
      }
    }
    return '';
  }

  async onSubmit() {
    if (this.ticketForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        const formData = this.ticketForm.value;

        const newTicket: Partial<Ticket> = {
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          description: formData.description,
          attachments: formData.attachments || '',
          contact_email: formData.contact_email || '',
          contact_phone: formData.contact_phone || '',
          expected_resolution_date: formData.expected_resolution_date || null,
          additional_notes: formData.additional_notes || '',
          // status: TicketStatus.OPEN,
          // createdAt: new Date(),
          // communicationHistory: []
        };

        // API call using async/await
        const response = await this.api.post('ticket/create_ticket/', newTicket).toPromise();

        if (response.status === 200) {
          console.log('Ticket created successfully:', response);
          this.snackBar.open('Ticket created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          this.ticketCreated.emit(response.data); // Emit the created ticket
          this.router.navigate(['/tickets']);
        } else {
          throw new Error('Unexpected response from server');
        }
      } catch (error) {
        console.error('Error creating ticket:', error);
        this.snackBar.open('Error creating ticket. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched(this.ticketForm);
    }
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel() {
    this.router.navigate(['/tickets']);
  }
  formatDate(date: any) {
    if (date) {
      const formattedDate = this.convertToYYYYMMDD(date);
      this.ticketForm.patchValue({ expected_resolution_date: formattedDate });
    }
  }

  // Convert Date to 'YYYY-MM-DD'
  private convertToYYYYMMDD(date: Date): string {
    const d = new Date(date);
    return d.getFullYear() + '-' + this.padZero(d.getMonth() + 1) + '-' + this.padZero(d.getDate());
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
