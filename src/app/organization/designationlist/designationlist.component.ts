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
import { DesignationComponent } from '../designation/designation.component';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-designationlist',
  standalone: true,
  imports: [FormsModule,MatTabsModule,MatButtonModule,MatIcon,ReactiveFormsModule,
       MatTableModule, MatDialogModule,MatPaginatorModule,DesignationComponent,NgIf,MatInputModule,
        MatCardModule,MatFormFieldModule],
  templateUrl: './designationlist.component.html',
  styleUrl: './designationlist.component.scss'
})
export class DesignationlistComponent {
  @ViewChild(MatSort) set matSort(sort: MatSort){ this.dataSource.sort=sort;}
  designationData: any = [];
  filterText: string = '';
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource(this.designationData);
  displayedColumns: string[] = ['srNo', 'designation_name', 'department_name', 'level', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredDesignations: any;
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
          designation_name: "SENIOR manager",
          description: "Manages the team and operations",
          level: 5,
          department: 2,
          department_name: "ACCOUNTING"
        },
        {
          id: 2,
          designation_name: "rtt",
          description: "bnbnmkj",
          level: 4,
          department: 1,
          department_name: "Sales"
        },
        {
          id: 3,
          designation_name: "junior sales person",
          description: "Manages the team and operations",
          level: 6,
          department: 3,
          department_name: "Marketing"
        },
        {
          id: 4,
          designation_name: "hammer",
          description: "jkrnfk",
          level: 2,
          department: 1,
          department_name: "Sales"
        },
        {
          id: 5,
          designation_name: "sales execitive",
          description: "field work",
          level: 5,
          department: 1,
          department_name: "Sales"
        }
      ],
      pagination_data: {
        total_data: 5,
        limit: 10,
        total_pages: 1,
        page_number: 1,
        next_page: false,
        previous_page: false
      },
      status: 200
    };

    this.designationData = dummyResponse.data;
    this.filteredDesignations = this.designationData;
    this.totalData = dummyResponse.pagination_data.total_data;
    this.limit = dummyResponse.pagination_data.limit;
    this.totalPages = dummyResponse.pagination_data.total_pages;
    this.pageNumber = dummyResponse.pagination_data.page_number;
    this.nextPage = dummyResponse.pagination_data.next_page;
    this.previousPage = dummyResponse.pagination_data.previous_page;
    this.dataSource = new MatTableDataSource(this.designationData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  deleteDesignation(id: number) {
    if (confirm('Are you sure you want to delete this designation?')) {
      this.designationData = this.designationData.filter((desig: any) => desig.id !== id);
      this.dataSource = new MatTableDataSource(this.designationData);
    }
  }

  editDesignation(designationId: any): void {
    const dialogRef = this.dialog.open(DesignationComponent, {
      width: '600px',
      data: { designationId: designationId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.designationData.findIndex((d: any) => d.id === designationId);
        if (index !== -1) {
          this.designationData[index] = result;
          this.dataSource = new MatTableDataSource(this.designationData);
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
      this.dataSource = new MatTableDataSource(this.designationData);
      this.loading = false;
    } else {
      const filteredData = this.designationData.filter((desig: any) =>
        desig.designation_name.toLowerCase().includes(searchText.toLowerCase()) ||
        desig.department_name.toLowerCase().includes(searchText.toLowerCase())
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
