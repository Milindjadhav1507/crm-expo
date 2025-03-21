import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CrmApiService } from '../../crm-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule,MatError, NgClass,   MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,NgFor
],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.scss'
})
export class DesignationComponent {
  designationForm!: FormGroup;
  departmentData:any=[]
  level_Data=[{id:1, name: 'L1'}, {id:2, name: 'L2'}, {id:3, name: 'L3'}, {id:4, name: 'L4'}, {id:5, name: 'L5'}, {id:6, name: 'L6'}]

  constructor(private fb: FormBuilder,private api:CrmApiService,
     @Optional() public dialogRef: MatDialogRef<DesignationComponent,any>,
            @Optional()  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.designationForm = this.fb.group({
      designation_name: [
        '', 
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      description: [
        ''
      ],
      level:['',Validators.required],
      department: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
    this.getdepartmentall()
    if (this.data!=null) {
      this.particularDesignation()}
  }
  particularDesignation() {
    this.api.get('api/retrieve_designation/'+this.data.designationId+'/').subscribe((res:any)=>{
      this.designationForm.patchValue(res.data)
  
    })
  }
getdepartmentall(){
  this.api.post('api/get_departments/s=',null).subscribe((res:any)=>{
    this.departmentData=res.data
  })
}
  onSubmit(): void {
    
    if (this.designationForm.valid) {
      if(this.data==null){
      console.log('Form Data:', this.designationForm.value);
      this.api.post("api/create_designation/",this.designationForm.value).subscribe((data:any) => { 
          if (data.status==200){
          console.log('Designation created successfully:', data);
          }
        
        }
      )}else{
        this.api.put("api/update_designation/"+this.data.designationId+'/',this.designationForm.value).subscribe((data:any) => { 
          if (data.status==200){
          console.log('Designation updated successfully:', data);
          }
        
        })
      }
      // Handle API call or further processing here
    } else {
      console.error('Form is invalid!');
    }
  }
  onClose() {
    // Logic to handle the close action, e.g., closing a modal
    console.log('Close action triggered');
    this.dialogRef.close();
  }
}
