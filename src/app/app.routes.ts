import { mapToCanActivate, Routes } from '@angular/router';
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthguardService } from './auth/authguard.service';
import { KanbanComponent } from './layout/kanban/kanban.component';
import { CalenderComponent } from './layout/calender/calender.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
  },
  {
    path: 'organization',
    loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
    canActivate: [AuthguardService]
  },
  {
    path: 'layout',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthguardService]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthguardService],
    // data: { pageName: 'Dashboard' }
  },
  {
    path: 'lead',
    loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule),
    canActivate: [AuthguardService],
    data: { pageName: 'Lead' }
  },
  {
    path: 'followup',
    loadChildren: () => import('./follow-up/follow-up.module').then(m => m.FollowUpModule),
    // canActivate: [AuthguardService],
    // data: { pageName: 'Followup' }
  },
  {
    path: 'ticket',
    loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule),
    canActivate: [AuthguardService],
    data: { pageName: 'Ticket' }
  },
  {
    path: 'app-sidebar',
    component: SidebarComponent,
  },
  {
    path: 'kanbanb',
    component: KanbanComponent
  },

  {
    path: 'cal',
    component: CalenderComponent
  }
];
