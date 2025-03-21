import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketGenerationFormComponent } from './ticket-generation-form/ticket-generation-form.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommunicationComponent } from './communication/communication.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: TicketListComponent
  },
  {
    path: 'ticket',
    component: TicketGenerationFormComponent
  },
  {
    path: ':id',
    component: TicketDetailComponent
  },
  {
    path: ':id/edit',
    component: TicketGenerationFormComponent
  },
  {
    path: ':id/comment',
    component: CommunicationComponent
  },
  {
    path: 'comment-form',
    component: CommentFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
