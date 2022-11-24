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
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/modules/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { EoMonacoEditorComponent } from './monaco-editor/monaco-editor.component';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { EoTableProComponent } from './table-pro/table-pro.component';
import { EoNgTableModule } from 'eo-ng-table';

const antdModules = [NzTableModule, NzCodeEditorModule, EoNgButtonModule, NzInputModule, NzSelectModule];
const COMPONENTS = [EoTableComponent, EoTableProComponent, CellDirective, EoMonacoEditorComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, EoNgTableModule, FormsModule, EoIconparkIconModule, ...antdModules],
  exports: [...COMPONENTS, EoIconparkIconModule],
})
export class EouiModule {}
