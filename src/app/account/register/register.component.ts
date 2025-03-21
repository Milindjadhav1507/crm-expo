import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {  CommonModule, NgFor, NgIf } from '@angular/common';
import { User } from '../../interfaces/user';
import { AuthService } from '../../auth/auth.service';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    
  CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] 
})
export class RegisterComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      workEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['user', Validators.required], // Default role is user
      terms: [false, Validators.requiredTrue],
    });
  }

  // ngOninIt(){
  //   const container = document.getElementById('container') as HTMLElement;
  //   const registerBtn = document.getElementById('register') as HTMLButtonElement;
  //   const loginBtn = document.getElementById('login') as HTMLButtonElement;
    
  //   // Ensure the elements exist before adding event listeners
  //   if (container && registerBtn && loginBtn) {
  //       registerBtn.addEventListener('click', () => {
  //           container.classList.add("active");
  //       });
    
  //       loginBtn.addEventListener('click', () => {
  //           container.classList.remove("active");
  //       });
  //   } else {
  //       console.error('Required elements are missing from the DOM.');
  //   }
    
  // }
  isActive = false;

  toggleActive(state: boolean): void {
    this.isActive = state;
  }
  onSubmit(): void {
    if (this.signupForm.valid) {
      const user: User = this.signupForm.value;
      console.log('User data:', user); // Check if data is correct here
      this.authService.registerUser(user); // Save user data dynamically
    } else {
      console.log('Form is not valid');
    }
  }
  
}