import { NgFor, NgIf } from '@angular/common';
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
import { DepartmentComponent } from '../department/department.component';
import { DesignationComponent } from '../designation/designation.component';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

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
export class RolelistComponent {
    @ViewChild(MatSort) set matSort(sort: MatSort){ this.dataSource.sort=sort;}

 roleData: any = []
   filterText:any
   searchControl=new FormControl('')
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
  pageSizeOptions = 10
  c: any;
  loading:boolean=false
  y='';
   constructor(private api: CrmApiService,private dialog: MatDialog) { }
   ngOnInit() {
     this.initializeDummyData();
   }
   private initializeDummyData() {
     const dummyResponse = {
       data: [
         {
           id: 5,
           name: "sales Executive",
           description: "Responsible for overseeing teams",
           Permission: [],
           deleted: false,
           level: null
         },
         {
           id: 6,
           name: "kkkk",
           description: "",
           Permission: null,
           deleted: false,
           level: null
         },
         {
           id: 10,
           name: "Superman",
           description: "steel",
           Permission: [
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Lead"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Followup"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Ticket"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Comment"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Setting"
             }
           ],
           deleted: false,
           level: 1
         },
         {
           id: 11,
           name: "captain america",
           description: "soldier",
           Permission: [
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Lead"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Followup"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Ticket"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Comment"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Setting"
             }
           ],
           deleted: false,
           level: 1
         },
         {
           id: 12,
           name: "kretos",
           description: "efhvbknbkjlnklbnlkbg",
           Permission: [
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Lead"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Followup"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Ticket"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Comment"
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: "Setting"
             }
           ],
           deleted: false,
           level: 1
         },
         {
           id: 2,
           name: "admin",
           description: "Responsible for overseeing teams",
           Permission: [
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Lead"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Followup"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Ticket"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Comment"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Setting"
             }
           ],
           deleted: false,
           level: 2
         },
         {
           id: 4,
           name: "sales manager",
           description: "Responsible for overseeing teams",
           Permission: [
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Lead"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Followup"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Ticket"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Comment"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Setting"
             }
           ],
           deleted: false,
           level: 2
         },
         {
           id: 13,
           name: "hhhh",
           description: "ddd",
           Permission: [
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: null
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: null
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: null
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: null
             },
             {
               actions: {
                 edit: false,
                 view: false,
                 create: false,
                 delete: false
               },
               page_name: null
             }
           ],
           deleted: false,
           level: 2
         },
         {
           id: 14,
           name: "new role",
           description: "test role",
           Permission: [
             {
               actions: {
                 edit: true,
                 view: true,
                 create: false,
                 delete: true
               },
               page_name: "Lead"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Followup"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Ticket"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Comment"
             },
             {
               actions: {
                 edit: true,
                 view: true,
                 create: true,
                 delete: true
               },
               page_name: "Setting"
             }
           ],
           deleted: false,
           level: 2
         },
         {
           id: 3,
           name: "Manager",
           description: "Responsible for Level 4",
           Permission: [],
           deleted: false,
           level: 3
         }
       ],
       pagination_data: {
         total_data: 12,
         limit: 10,
         total_pages: 2,
         page_number: 1,
         next_page: true,
         previous_page: false
       },
       status: 200
     };

     this.roleData = dummyResponse.data;
     this.filteredRoles = this.roleData;
     this.totalData = dummyResponse.pagination_data.total_data;
     this.limit = dummyResponse.pagination_data.limit;
     this.totalPages = dummyResponse.pagination_data.total_pages;
     this.pageNumber = dummyResponse.pagination_data.page_number;
     this.nextPage = dummyResponse.pagination_data.next_page;
     this.previousPage = dummyResponse.pagination_data.previous_page;
     this.dataSource = new MatTableDataSource(this.roleData);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.matSort;
   }
   deletedesignation(id: number) {
     // Implement delete functionality here
     console.log('Delete branch with ID:', id);
     this.roleData = this.roleData.filter((branch: any) => branch.id !== id);
   }

   applyPagination() {
     this.dataSource = new MatTableDataSource(this.roleData);
     this.dataSource.paginator = this.paginator;
   }

   applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

     this.filteredRoles = this.roleData.filter((a:any) =>
       a.name.toLowerCase().includes(filterValue)
     );
   }

   editDesignation(roleId: any): void {
     console.log('Editing branch with ID:', roleId);

    const dialogRef = this.dialog.open(RolemanagementComponent, {
       width: '800px',
       data: { roleId: roleId }  // Pass the branch ID if needed
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
    this.api.post('api/get_roles/s='+this.y, d).subscribe((response: any) => {

      this.roleData = new MatTableDataSource(response.data)
    })
  }
  search(e:any) {
    this.y=e
    this.api.post('api/get_roles/s='+e, this.roleData).subscribe((response: any) => {
      //*console.log(response, 'salesssss');
      this.c = response.data
      this.roleData = new MatTableDataSource(this.c)
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

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleData = this.roleData.filter((role: any) => role.id !== id);
      this.dataSource = new MatTableDataSource(this.roleData);
    }
  }

  editRole(roleId: any): void {
    const dialogRef = this.dialog.open(RolemanagementComponent, {
      width: '600px',
      data: { roleId: roleId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.roleData.findIndex((r: any) => r.id === roleId);
        if (index !== -1) {
          this.roleData[index] = result;
          this.dataSource = new MatTableDataSource(this.roleData);
        }
      }
    });
  }
}
