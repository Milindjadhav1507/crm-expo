import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent  {
  showComponent = false;
  currentUrl: string = '';
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
      console.log('Current URL:', this.currentUrl);
      this.showComponent = this.router.url.includes('/login');
      console.log('kk', this.showComponent);
    if (this.showComponent) {
        this.showComponent = false;
      } else {
        this.showComponent = true;
      }
    });
  }

}
