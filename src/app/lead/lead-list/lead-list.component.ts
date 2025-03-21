import { Component, ViewChild } from '@angular/core';
import { LeadsService } from '../leads.service';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CrmApiService } from '../../crm-api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateLeadComponent } from '../create-lead/create-lead.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [MatTableModule,
    MatButtonModule,MatInputModule,
    MatPaginatorModule,MatCardModule,MatCheckboxModule,FormsModule,ReactiveFormsModule,MatDialogModule,
    MatSortModule,MatFormFieldModule,CommonModule,MatIconModule],
  templateUrl: './lead-list.component.html',
  styleUrl: './lead-list.component.scss'
})
export class LeadListComponent {
  leads: any = [];
  leadF: any;
  displayedColumns: string[] = [
    'index',
    'created_at',
    'leadName',
    'email',
    'phone',
    // 'country',
    // 'state',
    // 'city',
    'leadSourceName',
    'leadType_id',
    'assignedTo_id',
    'status_id',
    'actions',
  ];
  filteredLeads: MatTableDataSource<any> = new MatTableDataSource();
  filters: { startDate: string; endDate: string; status: string; };
  constructor(private api: CrmApiService, private dialog: MatDialog) {
    this.filters = {
      startDate: this.api.getDate().oneMonthAgo,
      endDate: this.api.getDate().today,
      status: '',
    };
   }

  ngOnInit(): void {
    this.getLeads()
    console.log(this);

  }


  // Filtered leads to display

  // Apply filters based on user input
  applyFilters() {
    const { status, startDate, endDate } = this.filters;

    this.filteredLeads.data = this.leads.filter((lead: { created_at: string | number | Date; statusName: string; }) => {
      const startDateMatch =
        !startDate || new Date(lead.created_at) >= new Date(startDate);
      const endDateMatch =
        !endDate || new Date(lead.created_at) <= new Date(endDate);
      const statusMatch = !status || lead.statusName === status;

      return startDateMatch && endDateMatch && statusMatch;
    });
  }

  openCreateLeadModal(): void {
    const dialogRef = this.dialog.open(CreateLeadComponent, {
      width: '500px', // Optional: specify width
      data: {} // Optional: pass any required data to the dialog
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        this.getLeads();
      }
    });
  }


  getLeads() {
    // /crm/GetAllLead/s=a
    this.api.post('api/GetAllLead/s=', null).subscribe((res: any) => {
      console.log(res)
      this.leads = res.data
      this.filteredLeads.data = this.leads
    })
  }
  editLead(lead: any) {
    console.log('Edit Lead:', lead);
    // /crm/UpdateLead
    this.api.get(`api/GetLead/${lead.id}`, null).subscribe((res: any) => {
      console.log(res)
      const dialogRef = this.dialog.open(CreateLeadComponent, {
        width: '500px', // Optional: specify width
        data: res.data // Optional: pass any required data to the dialog
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          this.getLeads();
        }
      });
    })

  }

  // Function to delete lead
  deleteLead(id: number) {
    if (confirm('Are you sure you want to delete this lead?')) {
      // /crm/DeleteLead/1
      this.api.get(`api/DeleteLead/${id}`, null).subscribe((res: any) => {
        if (res.status == 200) {
          console.log(res)
          this.getLeads()
          // this.toast.success({ detail: 'Lead deleted successfully' });
        }
      })
    }
  }

}
