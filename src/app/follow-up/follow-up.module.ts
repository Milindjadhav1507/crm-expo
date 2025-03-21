import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';

import { FollowUpRoutingModule } from './follow-up-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxEchartsModule } from 'ngx-echarts';
import { CrmApiService } from '../crm-api.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FollowUpRoutingModule,
        // NgxEchartsModule.forRoot({
        //   echarts: () => import('echarts')
        // })
  ],
  providers:[DatePipe,CrmApiService]
})
export class FollowUpModule { }
