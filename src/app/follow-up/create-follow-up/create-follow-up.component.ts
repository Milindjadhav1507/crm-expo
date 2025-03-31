import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CrmApiService } from '../../crm-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-follow-up',
  standalone: true,
  imports: [MatCardModule,ReactiveFormsModule,NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,HttpClientModule,MatDialogModule,CommonModule,
    MatButtonModule,MatIconModule],
    providers: [HttpClient,CrmApiService],
  templateUrl: './create-follow-up.component.html',
  styleUrl: './create-follow-up.component.scss'
})
export class CreateFollowUpComponent {
  followupForm: FormGroup;
  selectedLead: string | null = null;
  statusOptions :any
  leads: any;
// @Input() followupF: any;
  constructor(private fb: FormBuilder,private api:CrmApiService,
    public dialogRef: MatDialogRef<CreateFollowUpComponent>,
    @Inject(MAT_DIALOG_DATA) public followupF: any
) {
    this.followupForm = this.fb.group({
      client_name: [null, [Validators.required]], // Lead ID, numeric
      comments: [''], // Comments, max length 500
      status: [null, [Validators.required]], // Status dropdown
      next_followup_date: [null, [Validators.required]], // Follow-up date
      id:[]
    });
  }

  ngOnInit(): void {
    this.getAllStatus()
    this.getLeads()
    console.log(this.followupF,"lk");
    if(this.followupF){
      this.followupForm.patchValue({
        client_name:this.followupF.client_name,
        comments:this.followupF.comments,
        status:this.followupF.status,
        next_followup_date:this.followupF.next_followup_date,
        id:this.followupF.id
      })
    }
  }
onClose(){
  this.dialogRef.close()
}
  onSubmit() {
    if (this.followupForm.valid) {
      if(this.followupF!=null){
        this.api.post(`UpdateFollowup/${this.followupF.id}`+"/",this.followupForm.value).subscribe((res:any)=>{
          if(res.status==200) {
            this.dialogRef.close();
            // this.toast.success({detail:'Follow-up updated successfully'});
          }
          console.log(res)
        })
      }else{
      console.log('Form Submitted:', this.followupForm.value);
      // /crm/CreateFollowup/
      this.api.post('CreateFllowup/',this.followupForm.value).subscribe((res:any)=>{
        if(res.status==200) {
        console.log(res)
        // this.toast.success({detail:'Follow-up added successfully'});
        this.followupForm.reset();
        this.dialogRef.close();
        }
      })
    }
    } else {
      console.log('Form is invalid');
    }
  }
  // crm/GetAllStatus/ -------get method ------to get all status
  getAllStatus(){
    this.api.get('api/GetAllStatus/',null).subscribe((res:any)=>{
      console.log(res)
      this.statusOptions=res.data
    })
  }
  getLeads(){
    // /crm/GetAllLead/s=a
    this.api.post('api/GetAllLead/s=',null).subscribe((res:any)=>{
      console.log(res)
      this.leads=res.data
  })
}
}
