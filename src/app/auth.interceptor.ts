import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AuthInterceptor initialized');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request:', request.url);

    // Skip token for auth endpoints
    if (request.url.includes('/auth/login/')) {
      console.log('Skipping auth for login request');
      return next.handle(request);
    }

    const accessToken = this.authService.getAccessToken();
    console.log('Current token:', accessToken ? 'Present' : 'Not present');

    // Clone request with credentials and token
    let clonedRequest = request.clone({
      withCredentials: true,
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      }
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Interceptor caught error:', {
          status: error.status,
          url: request.url,
          message: error.message,
          error: error.error
        });
        
        if (error.status === 401) {
          console.log('401 error detected, attempting refresh...');

          // Don't try to refresh if we're already refreshing
          if (request.url.includes('/auth/refresh_token/')) {
            console.log('Already on refresh token request, not retrying');
            return throwError(() => error);
          }

          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              console.log('Refresh successful:', response);
              
              if (!response || !response.access_token) {
                console.error('No access_token in response:', response);
                this.router.navigate(['/login']);
                throw new Error('No access_token in refresh response');
              }

              if (response.status !== 200) {
                console.error('Invalid status in response:', response.status);
                this.router.navigate(['/login']);
                throw new Error('Invalid status in refresh response');
              }

              // Only save token if status is 200
              if (response.status === 200) {
                console.log('Status 200, saving token');
                this.authService.saveAccessToken(response.access_token);

                // Clone original request with new token
                const retryRequest = request.clone({
                  withCredentials: true,
                  setHeaders: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${response.access_token}`
                  }
                });

                // Retry the original request
                return next.handle(retryRequest);
              } else {
                console.log('Status not 200, redirecting to login');
                this.router.navigate(['/login']);
                throw new Error('Invalid status in response');
              }
            }),
            catchError(refreshError => {
              console.error('Refresh failed:', refreshError);
              
              if (refreshError.status === 401 || refreshError.status === 403) {
                console.log('Refresh token invalid, redirecting to login');
                // this.authService.clearAccessToken();
                // this.router.navigate(['/login']);
              }
              
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
