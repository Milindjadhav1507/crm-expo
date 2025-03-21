import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLeadComponent } from './create-lead/create-lead.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { AuthguardService } from '../auth/authguard.service';

const routes: Routes = [{
  path:'lead',
  component: CreateLeadComponent
  // ,canActivate: [AuthguardService]
},{
  path:'lead-list',
  component: LeadListComponent
  // ,canActivate: [AuthguardService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }
