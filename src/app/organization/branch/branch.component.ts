import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, Injector, Input, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CrmApiService } from '../../crm-api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [MatIconModule,NgIf,ReactiveFormsModule,    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,NgFor,MatTabsModule,MatDialogModule,NgIf,NgClass
],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss',
  // providers: [
  //   { provide: MatDialogRef, useValue: {} },
  //   { provide: MAT_DIALOG_DATA, useValue: {} }
  //  ]
})
export class BranchComponent {
  
  branchForm!: FormGroup;
stats:any=[]
statesData:any=[]
  receivedData: any;
// public data:any
  constructor(private fb: FormBuilder,private api:CrmApiService, @Optional() public dialogRef: MatDialogRef<BranchComponent,any>,
    @Optional()  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.receivedData = data ?? null;
    console.log("Received Data:", this.receivedData);
    // this.data = this.injector.get(MAT_DIALOG_DATA,null);
    this.branchForm = this.fb.group({
      branchName: [
        '', 
        
          Validators.required
        
      ],
   
      address: [
        '', 
        
          Validators.required
        
      ],
      city: [
        '', 
        
          Validators.required
        
      ],
      state: [
        '', 
        
          Validators.required
          
        
      ],
      pincode: [
        '', 
        Validators.compose([Validators.required, Validators.pattern('^[0-9]{6}$')])
         
      ],
      managerId:['']
    });
  }

  ngOnInit(): void {
    console.log(this.data,'uiop');
    if(this.data!=null){
      this.getbranch();
    }
    this.statesF()
  }
  ngafterViewInit(): void {
    console.log('After View Init');
  }
  getbranch(){
    console.log(this.data,'piop');
    
    this.api.get("api/particular_branch/"+this.data.branchId+'/').subscribe((res:any)=>{
      console.log(res,this.data);
      this.branchForm.patchValue(res.data);
  
    });
  }
statesF(){
  this.api.get("api/states/").subscribe((res:any)=>{
    console.log(res,this.data);
    this.statesData=res.data;

  });
}
  onSubmit(): void {
    console.log('Form Data:', this.branchForm.value);
    if(this.data==null){
    if (this.branchForm.valid) {
      console.log('Form Data:', this.branchForm.value);
      this.api.post("api/branches/",this.branchForm.value).subscribe((res:any)=>{
        console.log(res);
        this.stats=res;
      // },(err:any)=>{
      //   console.log(err);
      });
    } else {
      console.error('Form is invalid!');
    }}else{
      this.api.post("api/update_branch/"+this.data.branchId+'/',this.branchForm.value).subscribe((res:any)=>{
        console.log(res);
        this.stats=res;
    })}
  }

  onClose() {
    // Logic to handle the close action, e.g., closing a modal
    console.log('Close action triggered');
    this.dialogRef.close();
  }
}
