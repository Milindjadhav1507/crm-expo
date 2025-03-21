import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarComponent } from './topbar/topbar.component';
import { AuthguardService } from '../auth/authguard.service';

const routes: Routes = [
  {path: '', component:TopbarComponent,
      canActivate: [AuthguardService],
      children: [
   {
          path:'topbar',
          component:TopbarComponent      
        }]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
