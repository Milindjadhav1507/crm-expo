import { Component,ViewChild } from '@angular/core';
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
import { UserformComponent } from '../userform/userform.component';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserformComponent,FormsModule,MatTabsModule,MatButtonModule,MatIcon,ReactiveFormsModule,
    MatTableModule, MatDialogModule,MatPaginatorModule,NgIf,MatInputModule,
     MatCardModule,MatFormFieldModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
   @ViewChild(MatSort) set matSort(sort: MatSort){ this.dataSource.sort=sort;}
  userData: any = []
  filterText:any
  searchControl=new FormControl('')
  dataSource = new MatTableDataSource(this.userData);

  displayedColumns: string[] = ['srNo', 'full_name','role_name','mobile_no','email', 'branch_name','department_name',
    'designation_name','actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredBranches: any;
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
  pageSizeOptions = 10
  c: any;
  loading:boolean=false
  y='';
  constructor(private api: CrmApiService,private dialog: MatDialog) { }
  ngOnInit() {
    this.getuserlist();
  }
  getuserlist(){
    this.api.get('api/get_employee/s=',{pagination:true}).subscribe((res:any)=>{
     
      this.userData = res.data;
      this.filteredBranches = this.userData;
      this.pagination = res.pagination_data
      this.totalData = res.pagination_data.total_data;
      this.limit = res.pagination_data.limit;
      this.totalPages = res.pagination_data.total_pages;
      this.pageNumber = res.pagination_data.page_number;
      this.nextPage = res.pagination_data.next_page;
      this.previousPage = res.pagination_data.previous_page;
      this.userData = new MatTableDataSource(this.userData);
      this.userData.paginator = this.paginator;
      this.dataSource.sort = this.matSort
    })
  }
  deletedesignation(id: number) {
    // Implement delete functionality here
    console.log('Delete branch with ID:', id);
    this.userData = this.userData.filter((branch: any) => branch.id !== id);
  }

  applyPagination() {
    this.dataSource = new MatTableDataSource(this.userData);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    this.filteredBranches = this.userData.filter((a:any) =>
      a.name.toLowerCase().includes(filterValue)
    );
  }

  editDesignation(userId: any): void {
    console.log('Editing branch with ID:', userId);
   
   const dialogRef = this.dialog.open(UserformComponent, {
      width: '800px',
      data: { userId: userId }  // Pass the branch ID if needed
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // Handle any actions after the dialog is closed
    });
  }
  onPageChange(event: any) {
    console.log( 'eventworking');
    
    this.limit = event.pageSize; // Update 'limit' based on selected page size
    this.pageNumber = event.pageIndex + 0;
    this.pageNumber++
    // this.pagination.page_number = this.pageNumber
   
    // this.branch_data.page_number = this.pageNumber
    // this.branch_data.limit = this.limit
    let d={
      limit:this.limit,
      "pagination":true,
      page_number:this.pageNumber,
      
    }
    this.api.post('api/get_employee/s='+this.y, d).subscribe((response: any) => {
     
      this.userData = new MatTableDataSource(response.data)
    })
  }
  search(e:any) {
    this.y=e
    this.api.post('api/get_employee/s='+e, this.userData).subscribe((response: any) => {
      //*console.log(response, 'salesssss');
      this.c = response.data
      this.userData = new MatTableDataSource(this.c)
      this.loading=false
      this.pagination = response.pagination_data
      this.totalData = response.pagination_data.total_data;
      this.limit = response.pagination_data.limit;
      this.totalPages = response.pagination_data.total_pages;
      this.pageNumber = response.pagination_data.page_number;
      this.nextPage = response.pagination_data.next_page;
      this.previousPage = response.pagination_data.previous_page;
    })
  }

  searchChange(event:any) {
    const val = event.target.value;
    //*console.log(event, "lll");
    if (val == '') {
      this.search('')
    }else{
    this.search(val);
    this.loading=true
    }
  }
  sea(event:any){
    const vallv= event
    this.search(vallv);
    this.loading=true
  }
  filter(a:any){
    if (a == '') {
      this.search('')
      this.loading=true
    }
  }
  clearFilter() {
    this.filterText = '';   
    this.search('')
  }
}
