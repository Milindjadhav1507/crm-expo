import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { RolemanagementComponent } from '../rolemanagement/rolemanagement.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { CrmApiService } from '../../crm-api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DepartmentComponent } from '../department/department.component';
import { DesignationComponent } from '../designation/designation.component';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rolelist',
  standalone: true,
  imports: [
    RolemanagementComponent,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    NgIf,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './rolelist.component.html',
  styleUrl: './rolelist.component.scss'
})
export class RolelistComponent implements OnInit {
  @ViewChild(MatSort) set matSort(sort: MatSort) { this.dataSource.sort = sort; }

  roleData: any = [];
  filterText: any;
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource(this.roleData);

  displayedColumns: string[] = ['srNo', 'name', 'description', 'level', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredRoles: any;
  dialogRef: any;
  totalData: any;
  limit: any;
  totalPages: any;
  pageNumber: number = 1;
  nextPage: any;
  previousPage: any;
  pagination: any;
  selectedPageIndex: number = 1;
  selectedPageSize: number = 10;
  pageSizeOptions = 10;
  loading: boolean = false;
  searchQuery: string = '';

  constructor(
    private api: CrmApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadRoles();
  }

  private loadRoles() {
    this.loading = true;
    const params = {
      limit: this.selectedPageSize,
      pagination: true,
      page_number: this.pageNumber
    };

    this.api.post(`api/get_roles/s=${this.searchQuery}`, params).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.roleData = response.data;
          this.dataSource = new MatTableDataSource(this.roleData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.matSort;

          // Update pagination data
          this.pagination = response.pagination_data;
          this.totalData = response.pagination_data.total_data;
          this.limit = response.pagination_data.limit;
          this.totalPages = response.pagination_data.total_pages;
          this.pageNumber = response.pagination_data.page_number;
          this.nextPage = response.pagination_data.next_page;
          this.previousPage = response.pagination_data.previous_page;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.snackBar.open('Error loading roles', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.selectedPageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadRoles();
  }

  search(event: any) {
    this.searchQuery = event.target.value;
    this.pageNumber = 1; // Reset to first page when searching
    this.loadRoles();
  }

  clearFilter() {
    this.searchQuery = '';
    this.searchControl.setValue('');
    this.pageNumber = 1;
    this.loadRoles();
  }

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.api.post(`api/delete_roles/${id}/`, {}).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.snackBar.open('Role deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.loadRoles(); // Reload the list
          } else {
            this.snackBar.open(response.error || 'Error deleting role', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        },
        error: (error) => {
          console.error('Error deleting role:', error);
          this.snackBar.open('Error deleting role', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  editRole(roleId: any): void {
    const dialogRef = this.dialog.open(RolemanagementComponent, {
      width: '600px',
      data: { roleId: roleId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadRoles(); // Reload the list after successful edit
      }
    });
  }
}
