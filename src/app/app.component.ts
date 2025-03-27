import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { CrmApiService } from './crm-api.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TopbarComponent,CommonModule,HttpClientModule],
  providers: [CrmApiService,DatePipe,AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'erpCRM';
  isLoginPage: boolean = false;
  

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes and check if the route is '/login'
    this.router.events.pipe(
      filter((event:any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);

      this.isLoginPage = (event.url === '/login'  || event.url === '/'); // Set isLoginPage based on the route
    });
    console.log(this.isLoginPage,);
  }
}
