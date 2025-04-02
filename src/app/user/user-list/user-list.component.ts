import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as bootstrap from 'bootstrap';
import { CrmApiService } from '../../crm-api.service';

interface User {
  id: number;
  full_name: string;
  email: string;
  mobile_no: string;
  role_id: number;
  role_name: string;
  department_name: string;
  branch_name: string;
  designation_name: string;
  created_at?: string;
  updated_at?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  displayedColumns: string[] = ['full_name', 'email', 'mobile_no', 'role_name', 'department_name', 'branch_name', 'designation_name', 'actions'];
  loading: boolean = false;
  searchQuery: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;

  newUser: User = {
    id: 0,
    full_name: '',
    email: '',
    mobile_no: '',
    role_id: 0,
    role_name: '',
    department_name: '',
    branch_name: '',
    designation_name: ''
  };

  constructor(private api: CrmApiService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.loading = true;
    this.api.getEmployeeList().subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.users = response.data;
          this.totalItems = response.total || this.users.length;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.api.getRoles('', 1, 100).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.roles = response.data.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            level: role.level
          }));
          console.log('Roles loaded:', this.roles);
        }
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  openCreateModal(): void {
    this.newUser = {
      id: 0,
      full_name: '',
      email: '',
      mobile_no: '',
      role_id: 0,
      role_name: '',
      department_name: '',
      branch_name: '',
      designation_name: ''
    };
    this.loadRoles();
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openEditModal(user: User): void {
    this.newUser = { ...user };
    this.loadRoles();
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveUser(): void {
    const payload = {
      full_name: this.newUser.full_name,
      email: this.newUser.email,
      mobile_no: this.newUser.mobile_no,
      role: this.newUser.role_id,
      department_name: this.newUser.department_name,
      branch_name: this.newUser.branch_name,
      designation_name: this.newUser.designation_name
    };

    if (this.newUser.id) {
      this.api.updateEmployee(this.newUser.id, payload).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.loadUsers();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.api.createEmployee(payload).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.loadUsers();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteEmployee(id).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  onRoleChange(roleId: number): void {
    const selectedRole = this.roles.find(role => role.id === roleId);
    if (selectedRole) {
      this.newUser.role_id = selectedRole.id;
      this.newUser.role_name = selectedRole.name;
    }
  }
} 