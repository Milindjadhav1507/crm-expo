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

interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
}

@Component({
  selector: 'app-userform',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    NgFor
  ],
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserformComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  designationData: any;
  departmentData: any;
  branchData: any;

  constructor(
    private fb: FormBuilder,
    private api: CrmApiService,
    @Optional() public dialogRef: MatDialogRef<UserformComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_no: ['', Validators.required],
      role_id: [null, Validators.required],
      department_id: [null],
      branch_id: [null],
      designation_id: [null, Validators.required]
    });
    this.initForm();
  }

  ngOnInit() {
    this.getrole();
    this.getDepartment();
    this.getBranch();
    this.getDesignation();
  }

  initForm() {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

  getrole() {
    this.api.getRoles('').subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.roles = res.data.map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            level: role.level
          }));
          console.log('Roles loaded in form:', this.roles);
          
          // If we have data for editing, set the role
          if (this.data && this.data.role_id) {
            this.userForm.patchValue({
              role_id: this.data.role_id
            });
          }
        }
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  getDepartment() {
    this.api.post('api/get_departments/s=', null).subscribe({
      next: (res: any) => {
        this.departmentData = res.data || [];
        if (this.data && this.data.department_id) {
          this.userForm.patchValue({
            department_id: this.data.department_id
          });
        }
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  getBranch() {
    this.api.post('api/allbranch/s=', null).subscribe({
      next: (res: any) => {
        this.branchData = res.data || [];
        if (this.data && this.data.branch_id) {
          this.userForm.patchValue({
            branch_id: this.data.branch_id
          });
        }
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      }
    });
  }

  getDesignation() {
    this.api.post('api/designation_level/', null).subscribe({
      next: (res: any) => {
        this.designationData = res.data || [];
        if (this.data && this.data.designation_id) {
          this.userForm.patchValue({
            designation_id: this.data.designation_id
          });
        }
      },
      error: (error) => {
        console.error('Error loading designations:', error);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
