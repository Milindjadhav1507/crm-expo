import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as bootstrap from 'bootstrap';
import { CrmApiService } from '../../crm-api.service';

interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
  Permission: any;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-role-list',
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
    MatTooltipModule
  ],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['name', 'description', 'level', 'created_at', 'actions'];
  loading: boolean = false;
  searchQuery: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;

  newRole: Role = {
    id: 0,
    name: '',
    description: '',
    level: 1,
    Permission: {}
  };

  constructor(private api: CrmApiService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.api.getRoles("").subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.roles = response.data;
          this.totalItems = response.total || this.roles.length;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadRoles();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadRoles();
  }

  openCreateModal(): void {
    this.newRole = {
      id: 0,
      name: '',
      description: '',
      level: 1,
      Permission: {}
    };
    const modalElement = document.getElementById('roleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openEditModal(role: Role): void {
    this.newRole = { ...role };
    const modalElement = document.getElementById('roleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveRole(): void {
    if (this.newRole.id) {
      this.api.updateRole(this.newRole.id, this.newRole).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.loadRoles();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error updating role:', error);
        }
      });
    } else {
      this.api.createRole(this.newRole).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.loadRoles();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error creating role:', error);
        }
      });
    }
  }

  deleteRole(id: number): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.api.deleteRole(id).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.loadRoles();
          }
        },
        error: (error) => {
          console.error('Error deleting role:', error);
        }
      });
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('roleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
} 