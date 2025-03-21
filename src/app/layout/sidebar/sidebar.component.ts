import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BranchComponent } from "../../organization/branch/branch.component";
import { DepartmentComponent } from "../../organization/department/department.component";
import { DesignationComponent } from "../../organization/designation/designation.component";
import { MatIconModule } from '@angular/material/icon';
import { RolemanagementComponent } from '../../organization/rolemanagement/rolemanagement.component';
import { Router } from '@angular/router';
import { UserformComponent } from '../../organization/userform/userform.component';
import { BranchlistComponent } from '../../organization/branchlist/branchlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DepartmentlistComponent } from '../../organization/departmentlist/departmentlist.component';
import { DesignationlistComponent } from '../../organization/designationlist/designationlist.component';
import { RolelistComponent } from '../../organization/rolelist/rolelist.component';
import { UserListComponent } from '../../organization/user-list/user-list.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BranchlistComponent, NgIf, NgFor, MatCardModule, DepartmentlistComponent, DesignationlistComponent
    ,MatIconModule,UserListComponent,RolelistComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { icon: 'search', label: 'Search' },
    { icon: 'home', label: 'Home' },
    { icon: 'people', label: 'Contacts' },
    { icon: 'calendar_month', label: 'My day' },
    { icon: 'chat_bubble', label: 'Comms' },
    { icon: 'attach_money', label: 'Sales' },
    { icon: 'campaign', label: 'Marketing' },
    { icon: 'bolt', label: 'Automation' },
    { icon: 'bar_chart', label: 'Reports' },
    { icon: 'help', label: '' },
    { icon: 'volume_up', label: '' },
  ];
  isSidebarToggled = false;

  listData = [{
    id: '1',
    name: 'Branch'
  },
  {
    id: '2',
    name: 'Department'
  },
  {
    id: '3',
    name: 'Designation'
  },
  {
    id: '4',
    name: 'Role Management'
  },
  {
    id: '5',
    name: 'User Management'
  }];

  selected = '1';

  getIconClass(name: string): string {
    switch (name) {
      case 'Branch':
        return 'fa fa-code-branch'; 
      case 'Department':
        return 'fa fa-building';   
      case 'Designation':
        return 'fa fa-id-card';   
      case 'Role Management':
        return 'fa fa-user-lock';   
      case 'User Management':
        return 'fa fa-user';   
      default:
        return 'fas fa-cog';      
    }
  }

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarToggled = !this.isSidebarToggled;
    if (this.isSidebarToggled) {
      document.body.style.overflow = 'hidden';
    }
  }

  select(id: string){
    this.selected = id;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
