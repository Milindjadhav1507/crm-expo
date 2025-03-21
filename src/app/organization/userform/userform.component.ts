import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup } from '@angular/material/card';
import { CrmApiService } from '../../crm-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-userform',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,MatCardContent,MatCardTitle,MatCardHeader,MatCard,NgFor
  ],
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserformComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Manager', 'User']; // This should be fetched from your role service
  designationData: any;
  departmentData: any;
  rolesdata: any;
  branchData:any
  constructor(private fb: FormBuilder,private api:CrmApiService,
     @Optional() public dialogRef: MatDialogRef<UserListComponent,any>,
                    @Optional()  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile_no: [''],
      role: ['', [Validators.required]],
      // password: [''],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      branch: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // You can fetch roles from your service here
    this.getdesignation();
    this.getdepartmentall();
    this.getrole();
    this.branchget()
    if (this.data!=null) {
      this.getparticularuser()}
  }
  getparticularuser(){
    this.api.get('api/particular_employee/'+this.data.userId+'/').subscribe((res:any)=>{
      this.userForm.patchValue(res.data)
    })
  }
  branchget() {
    this.api.post('api/allbranch/s=',null).subscribe((res:any)=>{
      this.branchData=res.data
    })
  }
  getdesignation(){
    this.api.post('api/designation_level/',null).subscribe((res:any)=>{
     
      this.designationData = res.data;

    })
  }
  getdepartmentall(){
      this.api.post('api/get_departments/s=',null).subscribe((res:any)=>{
       
        this.departmentData = res.data;
        
      })
    }
    getrole(){
      this.api.post('api/roles_level/',null).subscribe((res:any)=>{
        console.log(res)
        this.rolesdata = res.data;
      })
    }
  onSubmit(): void {
    console.log(this.userForm.value);
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      if(this.data==null){
      // Add your API call here to save the user
      this.api.post('api/create_employee/',this.userForm.value).subscribe((res:any) => { 
        if (res.status==200){
          console.log('User created successfully:', res);
        }
      });}else{
        this.api.post('api/edit_employee/'+this.data.userId+'/',this.userForm.value).subscribe((res:any) => { 
        if (res.status==200){
          console.log('User updated successfully:', res);
        }})
      }
    }
  }
}
