import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EoTableProComponent } from './table-pro.component';
import { EoNgTableModule } from 'eo-ng-table';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { EoNgFeedbackTooltipModule } from 'eo-ng-feedback';
import { EoNgCheckboxModule } from 'eo-ng-checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EoTableProComponent],
  imports: [CommonModule,FormsModule,EoNgTableModule,EoNgDropdownModule,EoNgCheckboxModule,EoNgFeedbackTooltipModule],
  exports: [EoTableProComponent],
})
export class EoTableProModule {}
