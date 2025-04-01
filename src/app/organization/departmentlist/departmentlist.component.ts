import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DepartmentComponent } from '../department/department.component';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { CrmApiService } from '../../crm-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-departmentlist',
  standalone: true,
  imports: [FormsModule,MatTabsModule,MatButtonModule,MatIcon,ReactiveFormsModule,
       MatTableModule, MatDialogModule,MatPaginatorModule,DepartmentComponent,NgIf,MatInputModule,
        MatCardModule,MatFormFieldModule],
  templateUrl: './departmentlist.component.html',
  styleUrl: './departmentlist.component.scss'
})
export class DepartmentlistComponent implements OnInit {
    @ViewChild(MatSort) set matSort(sort: MatSort){ this.dataSource.sort=sort;}
  departmentData: any = [];
  filterText: string = '';
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource(this.departmentData);
  displayedColumns: string[] = ['srNo', 'name', 'branch_name', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredBranches: any;
  dialogRef: any;
  totalData: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  pageNumber: number = 1;
  nextPage: boolean = false;
  previousPage: boolean = false;
  loading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private api: CrmApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  private loadDepartments() {
    this.loading = true;
    this.api.post('api/get_departments/s=', null).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.departmentData = response.data.map((dept: any, index: number) => ({
            ...dept,
            srNo: index + 1
          }));
          this.filteredBranches = this.departmentData;
          this.totalData = response.pagination_data?.total_data || 0;
          this.limit = response.pagination_data?.limit || 10;
          this.totalPages = response.pagination_data?.total_pages || 0;
          this.pageNumber = response.pagination_data?.page_number || 1;
          this.nextPage = response.pagination_data?.next_page || false;
          this.previousPage = response.pagination_data?.previous_page || false;
          this.dataSource = new MatTableDataSource(this.departmentData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.matSort;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.snackBar.open('Error loading departments', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteBranch(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.loading = true;
      this.api.deleteDepartment(id).subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.snackBar.open('Department deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadDepartments(); // Reload the list
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting department:', error);
          this.snackBar.open('Error deleting department', 'Close', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }

  editBranch(departmentId: any): void {
   const dialogRef = this.dialog.open(DepartmentComponent, {
      width: '600px',
      data: { departmentId: departmentId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadDepartments(); // Reload the list after edit
      }
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadDepartments(); // Reload with new page
  }

  searchChange(event: any) {
    const val = event.target.value;
    if (val === '') {
      this.filter('');
    } else {
      this.filter(val);
      this.loading = true;
    }
  }

  filter(searchText: string) {
    if (searchText === '') {
      this.dataSource = new MatTableDataSource(this.departmentData);
      this.loading = false;
    } else {
      const filteredData = this.departmentData.filter((dept: any) =>
        dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
        dept.branch_name.toLowerCase().includes(searchText.toLowerCase())
      );
      this.dataSource = new MatTableDataSource(filteredData);
      this.loading = false;
    }
  }

  clearFilter() {
    this.filterText = '';
    this.filter('');
  }
}
