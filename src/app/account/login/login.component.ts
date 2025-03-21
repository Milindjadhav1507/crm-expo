import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmApiService } from '../../crm-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: any | null = null;
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private api: CrmApiService
  ) {
    console.log('LoginComponent initialized'); // Debug log
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    console.log('Login attempt with:', this.loginForm.value); // Debug log
    
    if (this.loginForm.valid) {
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          
          if (response && response.token) {
            console.log('Saving token and redirecting');
            this.authService.saveAccessToken(response.token);
            this.router.navigate(['/dashboard']);
          } else {
            console.error('No token in response');
            this.errorMessage = 'Invalid login response';
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Login failed';
        }
      });
    } else {
      console.log('Form invalid:', this.loginForm.errors); // Debug log
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }
}
