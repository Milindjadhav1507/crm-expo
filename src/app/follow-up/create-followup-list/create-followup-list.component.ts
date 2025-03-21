import { Component, ViewChild } from '@angular/core';
import { CreateFollowUpComponent } from '../create-follow-up/create-follow-up.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CrmApiService } from '../../crm-api.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-followup-list',
  standalone: true,
  imports: [ReactiveFormsModule,MatCardModule,CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,MatIconModule,MatTableModule,MatPaginatorModule,FormsModule,],
  templateUrl: './create-followup-list.component.html',
  styleUrl: './create-followup-list.component.scss'
})
export class CreateFollowupListComponent {
  displayedColumns: string[] = ['id','created', 'leadName', 'comments', 'next_followup_date', 'statusName', 'actions',];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  leadOptions: any;
  selectedLead: any='' ; // Selected lead from dropdown
  followUpData: any;
  filters: { startDate: string; endDate: string; status: string; };

  constructor(private api: CrmApiService,private dialog:MatDialog) {
    this.filters = {
      startDate: this.api.getDate().oneMonthAgo,
      endDate: this.api.getDate().today,
      status: '',
    };
   }

  ngOnInit(): void {
    this.getAllFollowUps();
    this.getLeads()
  }

  getLeads() {
    // /crm/GetAllLead/s=a
    this.api.post('api/GetAllLead/s=', null).subscribe((res: any) => {
      console.log(res)
      this.leadOptions = res.data
    })
  }
  applyFilters() {
    const { status, startDate, endDate } = this.filters;

    this.dataSource.data = this.followUpData.filter((lead: { created_at: string | number | Date; statusName: string; }) => {
      const startDateMatch =
        !startDate || new Date(lead.created_at) >= new Date(startDate);
      const endDateMatch =
        !endDate || new Date(lead.created_at) <= new Date(endDate);
      const statusMatch = !status || lead.statusName === status;

      return startDateMatch && endDateMatch && statusMatch;
    });
  }
  openCreateFollowUpModal() {
    const dialogRef = this.dialog.open(CreateFollowUpComponent, {
      width: '600px', // Specify dialog width
      data: null, // Pass data to the dialog
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        this.getAllFollowUps(); // Refresh the list or perform actions
      }
    });

  }
  getAllFollowUps(): void {
    // GetAllFollowup/<str:keyw>
    this.api.post('api/GetAllFollowup/s=', { lead_id: this.selectedLead }).subscribe((res: any) => {
      console.log(res.data)
      if (res.status == 200) {
        this.followUpData=res.data
        this.dataSource = new MatTableDataSource<any>(res.data);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  editFollowUp(row: any) {
    // UpdateFollowup/<int:pk>/ ----------post method
    this.api.get(`api/GetFollowup/${row.id}`, null).subscribe((res: any) => {
      console.log(res)
      const dialogRef = this.dialog.open(CreateFollowUpComponent, {
        width: '600px', // Specify dialog width
        data:res.data, // Pass data to the dialog
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          this.getAllFollowUps(); // Refresh the list or perform actions
        }
      });
  
  })

  }

  deleteFollowUp(id: number) {
    // DeleteFollowup/<int:pk>/----get method
    if(confirm('Are you sure you want to delete this follow-up?')){
    this.api.get(`api/DeleteFollowup/${id}` + "/", null).subscribe((res: any) => {
      if(res.status ==200){
        // this.toast.success({detail:'Follow-up deleted successfully'});
      console.log(res)
      this.getAllFollowUps()
      }
    })
  }
    console.log('Delete follow-up with ID:', id);
  }
}
