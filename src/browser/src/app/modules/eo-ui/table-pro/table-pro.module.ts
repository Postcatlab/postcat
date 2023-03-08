import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgCheckboxModule } from 'eo-ng-checkbox';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { EoNgFeedbackTooltipModule } from 'eo-ng-feedback';
import { EoNgTableModule } from 'eo-ng-table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { EoTableProComponent } from './table-pro.component';

@NgModule({
  declarations: [EoTableProComponent],
  imports: [
    CommonModule,
    FormsModule,
    EoNgTableModule,
    EoNgButtonModule,
    EoNgDropdownModule,
    EoNgCheckboxModule,
    NzPopconfirmModule,
    EoNgFeedbackTooltipModule,
    NzInputNumberModule
  ],
  exports: [EoTableProComponent]
})
export class EoTableProModule {}
