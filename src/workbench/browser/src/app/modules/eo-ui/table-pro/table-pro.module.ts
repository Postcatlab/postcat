import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EoTableProComponent } from './table-pro.component';
import { EoNgTableModule } from 'eo-ng-table';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { EoNgFeedbackTooltipModule } from 'eo-ng-feedback';
import { EoNgCheckboxModule } from 'eo-ng-checkbox';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';

@NgModule({
  declarations: [EoTableProComponent],
  imports: [CommonModule,FormsModule,EoNgTableModule,EoNgButtonModule,EoNgDropdownModule,EoNgCheckboxModule,EoNgFeedbackTooltipModule],
  exports: [EoTableProComponent],
})
export class EoTableProModule {}
