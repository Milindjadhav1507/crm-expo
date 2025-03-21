import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CrmApiService } from '../crm-api.service';
import { NotificationService } from '../notification.service';

interface Permission {
  page_name: string;
  actions: { view: boolean; };
}

interface UserPermissions {
  Permission: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private api: CrmApiService, private notificationService: NotificationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const token = this.authService.getAccessToken();
    
    // No token at all, redirect to login
    if (!token) {
      console.log('No token found, redirecting to login');
      return of(this.router.createUrlTree(['/login']));
    }

    const pageName = route.data['pageName']; // Get the page name from route data
    console.log('Page Name:', pageName);
    
    return this.getUserPermissions().pipe(
      map((permissions: UserPermissions[]) => {
        const permission = permissions.find((p: UserPermissions) => p.Permission.some((perm: Permission) => perm.page_name === pageName));

        if (permission) {
          const actionsAllowed = permission ? permission.Permission.find((perm: Permission) => perm.page_name === pageName)?.actions : null;
          // Check if the user is allowed to perform the action
          if (actionsAllowed?.view) {
            return true;
          } else {
            this.notificationService.showError('You do not have permission to access this page.');
            return false;
          }
        }else{
          this.notificationService.showError('You do not have permission to access this page.');
          return false;
        }

        // this.notificationService.showError('You do not have permission to access this page.');
        return false; // Redirect to unauthorized page if access is denied
      })
    );
  }

  getUserPermissions(): Observable<UserPermissions[]> {
    return this.api.get(`auth/employee_permissions/`, null).pipe(
      map((res: any) => {
        console.log('API Response:', res);
        // Check if the response is an array
        if (!Array.isArray(res.data)) {
          console.error('Expected an array but got:', res);
          return []; // Return an empty array if the response is not an array
        }
        // Map the response to UserPermissions
        return res.data.map((user: any) => ({
          Permission: user.Permission
        }));
      })
    );
  }
}
