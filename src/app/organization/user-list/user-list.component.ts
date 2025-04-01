import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CrmApiService } from '../../crm-api.service';
import { FormsModule } from '@angular/forms';
import { UserformComponent } from '../userform/userform.component';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { MatTableDataSource } from '@angular/material/table';

interface User {
  id: number;
  srNo: number;
  full_name: string;
  first_name: string;
  last_name: string;
  role_name: string;
  role_id: number;
  mobile_no: string;
  email: string;
  branch_name: string;
  branch_id: number;
  department_name: string;
  department_id: number;
  designation_name: string;
  designation_id: number;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  role_id: number;
  branch_id: number;
  department_id: number;
  designation_id: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    UserformComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  filterText = '';
  dataSource: { data: User[] } = { data: [] };
  selectedUser: User | null = null;
  userForm: UserFormData = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    role_id: 0,
    branch_id: 0,
    department_id: 0,
    designation_id: 0
  };

  roles: any[] = [];
  branches: any[] = [];
  departments: any[] = [];
  designations: any[] = [];

  constructor(
    private modalService: NgbModal,
    private crmApiService: CrmApiService
  ) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit(): void {
    this.getUsers();
    this.loadFormData();
  }

  getUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.crmApiService.getEmployeeList().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.users = response.data.map((user: any, index: number) => ({
            ...user,
            srNo: index + 1,
            full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            role_name: user.role_name || 'N/A',
            branch_name: user.branch_name || 'N/A',
            department_name: user.department_name || 'N/A',
            designation_name: user.designation_name || 'N/A'
          }));
          this.dataSource = { data: [...this.users] };
        } else {
          this.error = 'No data received from API';
        }
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error fetching users:', error);
        this.error = 'Failed to fetch users. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteUser(userId: number): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.title = 'Delete User';
    modalRef.componentInstance.message = 'Are you sure you want to delete this user?';

    modalRef.result.then((result: boolean) => {
      if (result) {
        this.loading = true;
        this.crmApiService.deleteEmployee(userId).subscribe({
          next: () => {
            this.getUsers();
          },
          error: (error: Error) => {
            console.error('Error deleting user:', error);
            this.loading = false;
          }
        });
      }
    }).catch(() => {});
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userForm = {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      mobile_no: user.mobile_no || '',
      role_id: user.role_id || 0,
      branch_id: user.branch_id || 0,
      department_id: user.department_id || 0,
      designation_id: user.designation_id || 0
    };
    const modal = document.getElementById('createUserModal');
    if (modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  filter(filterText: string): void {
    if (!filterText) {
      this.dataSource = { data: [...this.users] };
      return;
    }

    const filteredData = this.users.filter((user: User) =>
      user.full_name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.mobile_no.includes(filterText) ||
      (user.role_name && user.role_name.toLowerCase().includes(filterText.toLowerCase()))
    );

    this.dataSource = { data: filteredData };
  }

  clearFilter(): void {
    this.filterText = '';
    this.dataSource = { data: [...this.users] };
  }

  openUserForm(): void {
    this.selectedUser = null;
    const modalElement = document.getElementById('createUserModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }

    // Update modal title
    const modalTitle = document.getElementById('createUserModalLabel');
    if (modalTitle) {
      modalTitle.textContent = 'Create New User';
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('createUserModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.selectedUser = null;
    this.userForm = {
      first_name: '',
      last_name: '',
      email: '',
      mobile_no: '',
      role_id: 0,
      branch_id: 0,
      department_id: 0,
      designation_id: 0
    };
  }

  loadFormData() {
    // Load roles
    this.crmApiService.getRoles('').subscribe({
      next: (response: any) => {
        console.log('Raw roles response:', response);
        if (response && response.data) {
          this.roles = response.data.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            level: role.level,
            role_name: role.name,
            role_id: role.id
          }));
          console.log('Roles loaded in list:', this.roles);
        } else {
          console.warn('No roles data received from API');
        }
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });

    // Load branches
    this.crmApiService.post('api/allbranch/s=', null).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.branches = response.data.map((branch: any) => ({
            id: branch.id,
            branchName: branch.branch_name,
            name: branch.branch_name,
            branch_id: branch.id
          }));
        }
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      }
    });

    // Load departments
    this.crmApiService.post('api/get_departments/s=', null).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.departments = response.data.map((dept: any) => ({
            id: dept.id,
            name: dept.department_name,
            department_id: dept.id
          }));
        }
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });

    // Load designations
    this.crmApiService.post('api/designation_level/', null).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.designations = response.data.map((designation: any) => ({
            id: designation.id,
            designation_name: designation.designation_name,
            name: designation.designation_name,
            designation_id: designation.id
          }));
        }
      },
      error: (error) => {
        console.error('Error loading designations:', error);
      }
    });
  }

  saveUser() {
    const userData = {
      ...this.userForm,
      full_name: `${this.userForm.first_name} ${this.userForm.last_name}`,
      role_id: this.userForm.role_id,
      branch_id: this.userForm.branch_id,
      department_id: this.userForm.department_id,
      designation_id: this.userForm.designation_id
    };

    if (this.selectedUser) {
      // Update existing user
      this.crmApiService.updateEmployee(this.selectedUser.id, userData).subscribe({
        next: (response) => {
          this.showToast('User updated successfully', 'success');
          this.getUsers();
          this.closeModal();
        },
        error: (error) => {
          this.showToast('Error updating user', 'error');
        }
      });
    } else {
      // Create new user
      this.crmApiService.createEmployee(userData).subscribe({
        next: (response) => {
          this.showToast('User created successfully', 'success');
          this.getUsers();
          this.closeModal();
        },
        error: (error) => {
          this.showToast('Error creating user', 'error');
        }
      });
    }
  }

  showToast(message: string, type: string) {
    // Implement the showToast method to display a toast notification
  }
}