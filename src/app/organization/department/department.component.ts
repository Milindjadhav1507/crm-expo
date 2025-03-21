import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CrmApiService } from '../../crm-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-department',
  standalone: true,
  imports: [NgIf,CommonModule,ReactiveFormsModule,FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,MatSelectModule,NgClass
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {
  departmentForm!: FormGroup;
  branchData:any=[]
  constructor(private fb: FormBuilder,private api:CrmApiService,
     @Optional() public dialogRef: MatDialogRef<DepartmentComponent,any>,
        @Optional()  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      branch: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.branchget()
    if (this.data.departmentId) {
      this.particularDepartments()}
  }

  get f() {
    return this.departmentForm.controls;
  }
branchget() {
  this.api.post('api/allbranch/s=',null).subscribe((res:any)=>{
    this.branchData=res.data
  })
}
particularDepartments() {
  this.api.get('api/particular_departments/'+this.data.departmentId+'/').subscribe((res:any)=>{
    this.departmentForm.patchValue(res.data)

  })
}
  onSubmit(): void {
    if (this.departmentForm.valid) {
      console.log('Form Data:', this.departmentForm.value);
      if(this.data.departmentId==null){
      // Add API call or other logic here
      this.api.post('api/create_departments/',this.departmentForm.value).subscribe((res:any) => { 
        if (res.status==200){
          console.log('Department created successfully:', res);
        }
      
      });
    }else{
      this.api.post('api/edit_departments/'+this.data.departmentId+'/',this.departmentForm.value).subscribe((res:any) => { 
        if (res.status==200){
          console.log('Department updated successfully:', res);
        }
    })
    }}
  }
  onClose() {
    // Logic to handle the close action, e.g., closing a modal
    console.log('Close action triggered');
    this.dialogRef.close();
  }
}
