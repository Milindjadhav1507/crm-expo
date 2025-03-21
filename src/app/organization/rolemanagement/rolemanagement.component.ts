import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrmApiService } from '../../crm-api.service';
import { DesignationComponent } from '../designation/designation.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Permission {
  page_name: string;
  actions: {
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
  };
}

@Component({
  selector: 'app-rolemanagement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,NgFor,
   
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule
  ],
  templateUrl: './rolemanagement.component.html',
  styleUrls: ['./rolemanagement.component.scss']
})
export class RolemanagementComponent implements OnInit {
  roleForm!: FormGroup;
  displayedColumns: string[] = ['pageName', 'create', 'edit', 'view', 'delete'];
  allSelected = false;
  level_Data=[{id:1, name: 'L1'}, {id:2, name: 'L2'}, {id:3, name: 'L3'}, {id:4, name: 'L4'}, {id:5, name: 'L5'}, {id:6, name: 'L6'}]
  pages: any[] = [
    { pageName: 'Sales Voucher' },
    { pageName: 'Purchase Voucher' },
    { pageName: 'Inventory' },
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,private api:CrmApiService,
    @Optional() public dialogRef: MatDialogRef<DesignationComponent,any>,
                @Optional()  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Simulate API call
    setTimeout(() => {
      this.pages = [
        { pageName: 'Lead' },
        { pageName: 'Followup' },
        { pageName: 'Ticket' },
        { pageName: 'Comment' },
        { pageName: 'Setting' },
      ];
      this.initForm(); // Reinitialize form with new pages
      if(this.data!=null){
        this.getParticularrole()
  
      }
    }, 1000);
   
  }
getParticularrole(){
  this.api.get('api/particular_roles/'+this.data.roleId+'/').subscribe((res:any)=>{
    this.roleForm.patchValue(res.data)

  })
}
  private initForm() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      level: [1],
      Permission: this.fb.array(
        this.pages.map(page =>
          this.fb.group({
            page_name: [page.pageName],
            actions: this.fb.group({
              create: [false],
              edit: [false],
              view: [false],
              delete: [false],
            })
          })
        )
      )
    });

    // Subscribe to changes to update select all state
    this.Permission.valueChanges.subscribe(values => {
      this.updateSelectAllState(values);
    });
  }

  private updateSelectAllState(values: any[]) {
    this.allSelected = values.every(v => 
      v.actions.create && v.actions.edit && v.actions.view && v.actions.delete
    );
  }

  toggleSelectAll() {
    const newValue = !this.allSelected;
    this.Permission.controls.forEach(control => {
      control.patchValue({
        actions: {
          create: newValue,
          edit: newValue,
          view: newValue,
          delete: newValue
        }
      });
    });
    this.allSelected = newValue;
  }

  get Permission(): FormArray {
    return this.roleForm.get('Permission') as FormArray;
  }

  getPermissionControl(pageIndex: number, permission: string): FormControl | null {
    const permissionControl = this.Permission.at(pageIndex);
    return permissionControl ? permissionControl.get('actions')?.get(permission) as FormControl : null;
  }

  resetForm() {
    this.roleForm.reset();
    this.Permission.controls.forEach(control => {
      control.patchValue({
        actions: {
          create: false,
          edit: false,
          view: false,
          delete: false
        }
      });
    });
    this.allSelected = false;
  }

  onSubmit() {
    console.log('Form Value:', this.roleForm.value);
    
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      const transformedOutput = {
        name: formValue.name,
        description: formValue.description,
        level: formValue.level,
        Permission: formValue.Permission.map((permission: Permission) => ({
          page_name: permission.page_name,
          actions: {
            create: permission.actions.create,
            edit: permission.actions.edit,
            view: permission.actions.view,
            delete: permission.actions.delete
          }
        }))
      };
      console.log('Transformed Output:', transformedOutput);
      if(this.data==null){
      this.api.post('api/create_roles/', transformedOutput).subscribe((res:any) => {
        console.log('Role saved:', res);
        if (res.status==200) {
          this.snackBar.open(res.data, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.resetForm(); // Reset the form after submission

        }else{
          this.snackBar.open(res.error, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }

      })
    }else{
      this.api.post('api/edit_roles/'+this.data.roleId+'/', transformedOutput).subscribe((res:any) => {
        console.log('Role saved:', res);
        if (res.status==200) {
          this.snackBar.open(res.data, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.resetForm(); // Reset the form after submission

        }else{
          this.snackBar.open(res.error, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }

      })
    }
      // You can handle the form submission here, like sending the data to an API.
    } else {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.markFormGroupTouched(this.roleForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
