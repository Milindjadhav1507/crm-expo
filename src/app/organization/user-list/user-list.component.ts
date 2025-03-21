import { Component, ViewChild } from '@angular/core';
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
import { UserformComponent } from '../userform/userform.component';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    UserformComponent,
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
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @ViewChild(MatSort) set matSort(sort: MatSort) { this.dataSource.sort = sort; }

  userData: any = [];
  filterText: any;
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource(this.userData);

  displayedColumns: string[] = ['srNo', 'full_name', 'role_name', 'mobile_no', 'email', 'branch_name', 'department_name', 'designation_name', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredUsers: any;
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

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.initializeDummyData();
  }

  private initializeDummyData() {
    const dummyResponse = {
      data: [
        {
          id: 1,
          email: "john.doe@example.com",
          mobile_no: "9988776655",
          first_name: "John",
          last_name: "Doe",
          department_id: null,
          role_id: null,
          branch_id: null,
          designation_id: null,
          user_id: 2,
          superior_id: null,
          deleted: false,
          full_name: "John Doe",
          role_name: null,
          department_name: null,
          branch_name: null,
          superior_name: " ",
          designation_name: null
        },
        {
          id: 2,
          email: "newemail@example.com",
          mobile_no: "9988776655",
          first_name: "John",
          last_name: "Doe",
          department_id: 2,
          role_id: 2,
          branch_id: 1,
          designation_id: 2,
          user_id: 1,
          superior_id: null,
          deleted: false,
          full_name: "John Doe",
          role_name: "admin",
          department_name: "ACCOUNTING",
          branch_name: "MAINy",
          superior_name: " ",
          designation_name: "rtt"
        },
        {
          id: 4,
          email: "pachi@gmail.com",
          mobile_no: "+8928281452",
          first_name: "John",
          last_name: "Doe",
          department_id: 1,
          role_id: 4,
          branch_id: 3,
          designation_id: 3,
          user_id: 7,
          superior_id: 1,
          deleted: false,
          full_name: "John Doe",
          role_name: "sales manager",
          department_name: "Sales",
          branch_name: "Mumbai Main Branch",
          superior_name: "John Doe",
          designation_name: "junior sales person"
        }
      ],
      status: 200
    };

    this.userData = dummyResponse.data;
    this.filteredUsers = this.userData;
    this.totalData = this.userData.length;
    this.dataSource = new MatTableDataSource(this.userData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userData = this.userData.filter((user: any) => user.id !== id);
      this.dataSource = new MatTableDataSource(this.userData);
    }
  }

  editUser(userId: any): void {
    const dialogRef = this.dialog.open(UserformComponent, {
      width: '800px',
      data: { userId: userId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.userData.findIndex((u: any) => u.id === userId);
        if (index !== -1) {
          this.userData[index] = result;
          this.dataSource = new MatTableDataSource(this.userData);
        }
      }
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.applyPagination();
  }

  applyPagination() {
    const startIndex = (this.pageNumber - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.dataSource = new MatTableDataSource(this.userData.slice(startIndex, endIndex));
    this.dataSource.paginator = this.paginator;
  }

  filter(filterText: string) {
    if (!filterText) {
      this.dataSource = new MatTableDataSource(this.userData);
      return;
    }

    const filteredData = this.userData.filter((user: any) =>
      user.full_name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.mobile_no.includes(filterText) ||
      (user.role_name && user.role_name.toLowerCase().includes(filterText.toLowerCase()))
    );

    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
  }

  clearFilter() {
    this.filterText = '';
    this.dataSource = new MatTableDataSource(this.userData);
    this.dataSource.paginator = this.paginator;
  }
}
