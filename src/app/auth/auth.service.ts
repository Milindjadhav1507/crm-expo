import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  // Save user data dynamically with a unique key
  registerUser(user: User): void {
    const uniqueKey = `user_${new Date().getTime()}`;
    const userData = JSON.stringify(user);
    localStorage.setItem(uniqueKey, userData);
  }

  // Retrieve user data dynamically based on the key
  getUserData(key: string): User | null {
    const userData = localStorage.getItem(key);
    return userData ? JSON.parse(userData) : null;
  }

  // Clear all user data from local storage
  clearAllUserData(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('user_')) {
        localStorage.removeItem(key);
      }
    }
  }

  // Check if user is authenticated based on token presence and validity
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;

      const expirationTime = payload.exp * 1000; // Convert from seconds to milliseconds
      return Date.now() > expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Decode JWT token to extract the payload
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Login and set access token
  login(credentials: { email: any, password: any }): Observable<any> {
    return this.http.post('https://apicrm.esarwa.com/auth/login/', credentials, {
      withCredentials: true, // This is important for cookies
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      tap((response:any) => {
        console.log('Login response:', response);
        if (response.token) {
          this.saveAccessToken(response.token);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  // Refresh the access token
  refreshToken(): Observable<any> {
    console.log('Starting token refresh');
    const currentToken = this.getAccessToken();
    
    if (!currentToken) {
      console.error('No token available for refresh');
      return throwError(() => new Error('No token to refresh'));
    }

    return this.http.post('https://apicrm.esarwa.com/auth/refresh_token/', {}, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      })
    }).pipe(
      tap((response: any) => {
        console.log('Refresh response:', response);
        if (response && response.access_token) {
          this.saveAccessToken(response.access_token);
        }
      }),
      catchError(error => {
        console.error('Refresh request failed:', error);
        if (error.status === 401 || error.status === 403) {
          this.clearAccessToken();
        }
        throw error;
      })
    );
  }

  saveAccessToken(token: any) {
    if (!token) {
      console.error('Attempted to save null/empty token');
      return;
    }
    console.log('Saving new access token:', token);
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  getAccessToken(): string | null {
    // if (!this.accessToken) {
      this.accessToken = localStorage.getItem('access_token');
    // }
    return this.accessToken;
  }

  clearAccessToken() {
    console.log('Clearing access token');
    this.accessToken = null;
    localStorage.removeItem('access_token');
  }

  // Log out and clear stored tokens
  logout(): void {
    console.log('Starting logout process');
    this.http.post('https://apicrm.esarwa.com/auth/logout/', {}, {
      withCredentials: true // This is important for cookies
    }).pipe(
      tap(() => {
        console.log('Logout successful, clearing tokens');
        this.clearAccessToken();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout failed:', error);
        // Clear tokens anyway and redirect
        this.clearAccessToken();
        this.router.navigate(['/login']);
        throw error;
      })
    ).subscribe({
      next: () => console.log('Logout completed'),
      error: (error) => {
        console.error('Error during logout:', error);
        // Make sure we redirect even if there's an error
        this.router.navigate(['/login']);
      }
    });
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
