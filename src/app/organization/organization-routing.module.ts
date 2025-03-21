import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { DesignationComponent } from './designation/designation.component';
import { BranchComponent } from './branch/branch.component';
import { RolemanagementComponent } from './rolemanagement/rolemanagement.component';
import { UserformComponent } from './userform/userform.component';

const routes: Routes = [
  {
   path:'department',
   component: DepartmentComponent
  },
  {
    path: 'designation',
    component: DesignationComponent,
   
  },{
    path:'branch',
    component: BranchComponent
  },
  {
    path: 'role',
    component: RolemanagementComponent
  },{
    path: 'userform',
    component: UserformComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
