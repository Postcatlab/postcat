import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { EoTableComponent } from './table/eo-table/eo-table.component';

// ! Directive
import { CellDirective } from './table/eo-table/cell.directive';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module';

const antdModules = [NzTableModule, EoNgButtonModule, NzInputModule, NzSelectModule];

@NgModule({
  declarations: [EoTableComponent, CellDirective],
  imports: [CommonModule, FormsModule, EoIconparkIconModule, ...antdModules],
  exports: [EoTableComponent, CellDirective],
})
export class EouiModule {}
