import { CommonModule, NgIf } from '@angular/common';
import { Injector, Input, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CrmApiService } from '../../crm-api.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-lead',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,CommonModule,
    MatButtonModule,MatIconModule,HttpClientModule,MatDialogModule
],
providers:[HttpClient,CrmApiService]
,  templateUrl: './create-lead.component.html',
  styleUrl: './create-lead.component.scss'
})
export class CreateLeadComponent {
  leadForm!: FormGroup;
  statusOptions: any;
  leadSourceOptions: any=[
    {id:1,name:'Web'},
    {id:2,name:'Phone'},
    {id:3,name:'Email'},
    {id:4,name:'Other'}
  ]
  assignedToOptions: any=[
    {id:1,name:'Sales manager'},
    {id:2,name:'Manager'},
    {id:3,name:'Team leader'},
    {id:4,name:'Sales Executive'}
  ]
  leadTypeOptions: any=[
    {id:10,name:'Hot'},
    {id:11,name:'Warm'},
    {id:12,name:'Cold'},
  ]

  constructor(private fb: FormBuilder,private api:CrmApiService,   
    @Optional() private dialogRef: MatDialogRef<CreateLeadComponent> | null,
    @Inject(MAT_DIALOG_DATA) public leadF: any) 
    // private injector: Injector,
    // @Inject(MAT_DIALOG_DATA) public leadF: any) 
    {
      // const dialogRef = this.injector.get(MatDialogRef, null);
      // if (dialogRef) {
      //   this.dialogRef = dialogRef;
      // }
   }

  ngOnInit(): void {
    this.initializeForm();
    this.getAllStatus()
    console.log(this.leadF,"op");
    if(this.leadF){
      this.leadForm.patchValue(this.leadF)
      // this.leadForm.patchValue({
      //   leadName:this.leadF.leadName,
      //   email:this.leadF.email,
      //   phone:this.leadF.phone,
      //   leadSource:this.leadF.leadSource,
      //   status:this.leadF.status,
      //   assignedTo:this.leadF.assignedTo,
      //   leadType:this.leadF.leadType,
      //   notes:this.leadF.notes,
      //   id:this.leadF.id
      // })
    }
    console.log(this.leadForm.value);
    
    
  }
getAllEmployees(){
  // /crm/GetAllEmployee
  this.api.get('employee/get_all_employees/',null).subscribe((res:any)=>{
    console.log(res)
    this.assignedToOptions=res.data
  })
}

  // Initialize the form with form controls and validations
  initializeForm(): void {
    this.leadForm = this.fb.group({
      leadName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      leadSource: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['', Validators.required],
      leadType: ['', Validators.required],
      notes: [''],
      id:[]
    });
  }
  getAllStatus(){
    this.api.get('api/GetAllStatus/',null).subscribe((res:any)=>{
      console.log(res)
      this.statusOptions=res.data
    })
  }
  // Submit form function
  onSubmit(): void {
    if (this.leadForm.valid) {
      const formData = this.leadForm.value;
      console.log('Form Data:', formData);
      if(this.leadF){
        // /crm/UpdateLead
        this.api.post(`api/UpdateLead/${this.leadF.id}`+"/",this.leadForm.value).subscribe((res:any)=>{
          if(res.status==200){
            console.log(res)
            // this.toast.success({detail:'Lead updated successfully'});
            this.dialogRef?.close();          }
        })
      }else{
      // crm/Createlead/
      this.api.post('api/Createlead/',formData).subscribe((res:any)=>{
        if(res.status==200) {
        console.log(res)
        // this.toast.success({detail:'Lead added successfully'});
        this.dialogRef?.close();          }
      })
    }
    } else {
      this.leadForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef?.close(); // Call this to close the modal programmatically
  }
}
