import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { EoTableComponent } from './table/eo-table/eo-table.component';
import { EoMessageComponent } from './message/eo-message.component';

// ! Directive
import { CellDirective } from './table/eo-table/cell.directive';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module';

const antdModules = [NzTableModule, NzButtonModule, NzInputModule, NzSelectModule];

@NgModule({
  declarations: [EoTableComponent, EoMessageComponent, CellDirective],
  imports: [CommonModule, FormsModule, EoIconparkIconModule, ...antdModules],
  exports: [EoTableComponent, EoMessageComponent, CellDirective],
})
export class EouiModule {}
