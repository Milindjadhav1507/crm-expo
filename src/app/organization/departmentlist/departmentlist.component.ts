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
import { DepartmentComponent } from '../department/department.component';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-departmentlist',
  standalone: true,
  imports: [FormsModule,MatTabsModule,MatButtonModule,MatIcon,ReactiveFormsModule,
       MatTableModule, MatDialogModule,MatPaginatorModule,DepartmentComponent,NgIf,MatInputModule,
        MatCardModule,MatFormFieldModule],
  templateUrl: './departmentlist.component.html',
  styleUrl: './departmentlist.component.scss'
})
export class DepartmentlistComponent {
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

  constructor(private dialog: MatDialog) {
    this.initializeDummyData();
  }

  ngOnInit() {
    // No need to call API anymore
  }

  private initializeDummyData() {
    const dummyResponse = {
      data: [
        {
          id: 1,
          name: "Sales",
          description: "",
          branch: 1,
          branch_name: "MAINy"
        },
        {
          id: 2,
          name: "ACCOUNTING",
          description: "ACCOUNTING department",
          branch: 3,
          branch_name: "Mumbai Main Branch"
        },
        {
          id: 3,
          name: "Marketing",
          description: "Responsible for creating and executing campaigns to attract, engage, and retain customers, as well as analyzing customer behavior and market trends.",
          branch: 4,
          branch_name: "Ambivali"
        },
        {
          id: 4,
          name: "Executive/Management",
          description: "Leads and makes strategic decisions based on CRM data, ensuring alignment with business objectives and customer needs.",
          branch: 5,
          branch_name: "ssssssssss"
        },
        {
          id: 5,
          name: "IT/Technical Support",
          description: "Maintains the technical infrastructure of CRM systems, providing technical support and system integrations.",
          branch: 1,
          branch_name: "MAINy"
        },
        {
          id: 6,
          name: "Operations",
          description: "Handles the day-to-day operations that support customer interactions, ensuring efficient product/service delivery.",
          branch: 3,
          branch_name: "Mumbai Main Branch"
        },
        {
          id: 7,
          name: "Human Resources (HR)",
          description: "Manages employee performance, training, and internal processes, ensuring employees meet the needs of customers.",
          branch: 4,
          branch_name: "Ambivali"
        },
        {
          id: 8,
          name: "Finance and Accounting",
          description: "Manages billing, payments, and financial transactions for customer accounts, ensuring accuracy and compliance.",
          branch: 5,
          branch_name: "ssssssssss"
        },
        {
          id: 9,
          name: "Product Management",
          description: "Oversees the development and improvement of products based on customer feedback and market trends.",
          branch: 1,
          branch_name: "MAINy"
        },
        {
          id: 10,
          name: "Customer Support/Service",
          description: "Ensures customer satisfaction by resolving inquiries, managing service tickets, and providing ongoing support.",
          branch: 3,
          branch_name: "Mumbai Main Branch"
        }
      ],
      pagination_data: {
        total_data: 15,
        limit: 10,
        total_pages: 2,
        page_number: 1,
        next_page: true,
        previous_page: false
      },
      status: 200
    };

    this.departmentData = dummyResponse.data;
    this.filteredBranches = this.departmentData;
    this.totalData = dummyResponse.pagination_data.total_data;
    this.limit = dummyResponse.pagination_data.limit;
    this.totalPages = dummyResponse.pagination_data.total_pages;
    this.pageNumber = dummyResponse.pagination_data.page_number;
    this.nextPage = dummyResponse.pagination_data.next_page;
    this.previousPage = dummyResponse.pagination_data.previous_page;
    this.dataSource = new MatTableDataSource(this.departmentData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  deleteBranch(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentData = this.departmentData.filter((dept: any) => dept.id !== id);
      this.dataSource = new MatTableDataSource(this.departmentData);
    }
  }

  editBranch(departmentId: any): void {
   const dialogRef = this.dialog.open(DepartmentComponent, {
      width: '600px',
      data: { departmentId: departmentId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.departmentData.findIndex((d: any) => d.id === departmentId);
        if (index !== -1) {
          this.departmentData[index] = result;
          this.dataSource = new MatTableDataSource(this.departmentData);
        }
      }
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
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
