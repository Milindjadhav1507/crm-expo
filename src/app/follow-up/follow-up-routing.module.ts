import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFollowUpComponent } from './create-follow-up/create-follow-up.component';
import { CreateFollowupListComponent } from './create-followup-list/create-followup-list.component';

const routes: Routes = [
  {
    path: 'follow-up',
    component:CreateFollowUpComponent
  },
  {
    path: 'follow-up-list',
    component:CreateFollowupListComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowUpRoutingModule { }
