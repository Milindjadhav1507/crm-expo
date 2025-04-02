import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Inject, Optional, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CrmApiService } from '../../crm-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class DepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  branchData: any[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: CrmApiService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<DepartmentComponent,any>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      branch: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    if (this.data?.departmentId) {
      this.loadDepartmentDetails();
    }
  }

  loadBranches() {
    this.loading = true;
    this.api.getBranchList().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.branchData = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.snackBar.open('Error loading branches', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  loadDepartmentDetails() {
    this.loading = true;
    this.api.getDepartmentDetail(this.data.departmentId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.departmentForm.patchValue(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading department details:', error);
        this.snackBar.open('Error loading department details', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      this.loading = true;
      const formData = this.departmentForm.value;

      if (this.data?.departmentId) {
        // Update department
        this.api.updateDepartment(this.data.departmentId, formData).subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              this.snackBar.open('Department updated successfully', 'Close', {
                duration: 3000
              });
              this.dialogRef.close(response);
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating department:', error);
            this.snackBar.open('Error updating department', 'Close', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      } else {
        // Create department
        this.api.createDepartment(formData).subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              this.snackBar.open('Department created successfully', 'Close', {
                duration: 3000
              });
              this.dialogRef.close(response);
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating department:', error);
            this.snackBar.open('Error creating department', 'Close', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.departmentForm.controls;
  }
}
