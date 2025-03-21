import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-createcompany',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './createcompany.component.html',
  styleUrl: './createcompany.component.scss'
})
export class CreatecompanyComponent {
  companyForm: FormGroup;
 constructor(private fb:FormBuilder){
  this.companyForm = this.fb.group({
    companyName: ['', Validators.required],
    companyEmail: ['', [Validators.required, Validators.email]],
    companyPhone: ['', Validators.required],
    companyAddress: ['', Validators.required],
  });
 }


// Handle form submission
onSubmit() {
  if (this.companyForm.valid) {
    // Handle the form submission, e.g., send data to the backend
    console.log(this.companyForm.value);
    // Optionally reset the form after submission
    this.companyForm.reset();
  }
}
}
