import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatecompanyComponent } from './createcompany/createcompany.component';

const routes: Routes = [
  {path: 'company', component:CreatecompanyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
