import { Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BranchComponent } from '../branch/branch.component';
import { MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-branchlist',
  standalone: true,
  imports: [FormsModule,MatTabsModule,MatButtonModule,MatIcon,ReactiveFormsModule,NgIf,FormsModule,MatInputModule,
     MatTableModule, MatDialogModule,MatPaginatorModule,BranchComponent, MatCardModule,MatFormFieldModule],
  templateUrl: './branchlist.component.html',
  styleUrls: ['./branchlist.component.scss']
})
export class BranchlistComponent {
  @ViewChild(MatSort) set matSort(sort: MatSort){ this.dataSource.sort=sort;}
  branches: any = [];
  filterText: string = '';
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource(this.branches);
  displayedColumns: string[] = ['srNo', 'branchName', 'address', 'city', 'pincode', 'actions'];
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
    // Initialize with dummy data
    this.initializeDummyData();
  }

  ngOnInit() {
    // No need to call API anymore
  }

  private initializeDummyData() {
    // Dummy data from your JSON
    const dummyResponse = {
      data: [
        {
          id: 1,
          branchName: "MAINy",
          address: "456 Mumbai Avenue, Mumbai",
          city: "Mumbai",
          pincode: "400002",
          deleted: false,
          state: 1
        },
        {
          id: 3,
          branchName: "Mumbai Main Branch",
          address: "123 Mumbai Street, Mumbai",
          city: "Mumbai",
          pincode: "400001",
          deleted: false,
          state: 2
        },
        {
          id: 4,
          branchName: "Ambivali",
          address: "xyz",
          city: "Kalyan",
          pincode: "421102",
          deleted: false,
          state: 1
        },
        {
          id: 5,
          branchName: "ssssssssss",
          address: "ddddddddddddd",
          city: "jbnmskd kj",
          pincode: "421102",
          deleted: false,
          state: 3
        },
        {
          id: 6,
          branchName: "Mumbai",
          address: "123 Mumbai Street, Mumbai",
          city: "Mumbai",
          pincode: "400001",
          deleted: false,
          state: 27
        },
        {
          id: 7,
          branchName: "MAINM",
          address: "456 Mumbai Avenue, Mumbai",
          city: "Mumbai",
          pincode: "400002",
          deleted: false,
          state: 1
        },
        {
          id: 8,
          branchName: "MAINMy",
          address: "456 Mumbai Avenue, Mumbai",
          city: "Mumbai",
          pincode: "400002",
          deleted: false,
          state: 1
        },
        {
          id: 9,
          branchName: "Kalyan",
          address: "456 Mumbai Avenue, Mumbai",
          city: "Mumbai",
          pincode: "400002",
          deleted: false,
          state: 6
        },
        {
          id: 10,
          branchName: "Mumbai1 Main Branch",
          address: "123 Mumbai Street, Mumbai",
          city: "Mumbai",
          pincode: "400001",
          deleted: false,
          state: 1
        },
        {
          id: 11,
          branchName: "Mumbai2 Main Branch",
          address: "123 Mumbai Street, Mumbai",
          city: "Mumbai",
          pincode: "400001",
          deleted: false,
          state: 1
        }
      ],
      pagination_data: {
        total_data: 14,
        limit: 10,
        total_pages: 2,
        page_number: 1,
        next_page: true,
        previous_page: false
      },
      status: 200
    };

    this.branches = dummyResponse.data;
    this.filteredBranches = this.branches;
    this.totalData = dummyResponse.pagination_data.total_data;
    this.limit = dummyResponse.pagination_data.limit;
    this.totalPages = dummyResponse.pagination_data.total_pages;
    this.pageNumber = dummyResponse.pagination_data.page_number;
    this.nextPage = dummyResponse.pagination_data.next_page;
    this.previousPage = dummyResponse.pagination_data.previous_page;
    this.dataSource = new MatTableDataSource(this.branches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  deleteBranch(id: number) {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.branches = this.branches.filter((branch: any) => branch.id !== id);
      this.dataSource = new MatTableDataSource(this.branches);
    }
  }

  editBranch(branchId: any): void {
    const dialogRef = this.dialog.open(BranchComponent, {
      width: '600px',
      data: { branchId: branchId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Update the branch in the list
        const index = this.branches.findIndex((b: any) => b.id === branchId);
        if (index !== -1) {
          this.branches[index] = result;
          this.dataSource = new MatTableDataSource(this.branches);
        }
      }
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    // Since we're using static data, we don't need to make an API call
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
      this.dataSource = new MatTableDataSource(this.branches);
      this.loading = false;
    } else {
      const filteredData = this.branches.filter((branch: any) =>
        branch.branchName.toLowerCase().includes(searchText.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchText.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchText.toLowerCase())
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
