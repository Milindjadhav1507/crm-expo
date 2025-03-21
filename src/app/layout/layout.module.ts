import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutRoutingModule } from './layout-routing.module';
import { TopbarComponent } from './topbar/topbar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,TopbarComponent,
    LayoutRoutingModule,
    RouterModule
  ],
  exports: [TopbarComponent]
})
export class LayoutModule { }
