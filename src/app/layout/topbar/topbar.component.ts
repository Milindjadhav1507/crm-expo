import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CrmApiService } from '../../crm-api.service';
import { filter } from 'rxjs/operators';

interface UserData {
  name: string;
  username: string;
  mobile: string;
  image?: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  showComponent = true; // Default to true
  currentUrl: string = '';
  isUserInfoVisible = false;
  userImage: string = '';
  userData: UserData | null = null;
  thisIsMyData: any;

  constructor(private router: Router, private api: CrmApiService) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide topbar only on login page
      this.showComponent = !event.url.includes('/login');
      this.currentUrl = event.url;
    });
  }

  ngOnInit() {
    // Check current route on component initialization
    this.showComponent = !this.router.url.includes('/login');
  }

  showUserInfo() {
    this.isUserInfoVisible = true;
    this.api.get(`auth/employee_permissions/`, null).subscribe((res: any) => {
      console.log(res.data[0])
      this.thisIsMyData = res.data[0];
    })
  }

  hideUserInfo() {
    this.isUserInfoVisible = false;
  }

  viewProfile() {
    // Navigate to profile page
    this.router.navigate(['/profile']);
  }

  openSettings() {
    // Navigate to settings page
    this.router.navigate(['/settings']);
  }

  logout() {
    localStorage.clear(); // Clear any stored tokens/data
    this.router.navigate(['/login']);
  }
}
