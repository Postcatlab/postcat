import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EoNgButtonModule } from 'eo-ng-button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/modules/eo-ui/iconpark-icon/eo-iconpark-icon.module';
import { EoMonacoEditorComponent } from './monaco-editor/monaco-editor.component';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { EoTableProComponent } from './table-pro/table-pro.component';
import { EoNgTableModule } from 'eo-ng-table';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { TabComponentModule } from './tab/tab.module';
import { EoNgFeedbackTooltipModule } from 'eo-ng-feedback';
import { EoNgCheckboxModule } from 'eo-ng-checkbox';

const antdModules = [
  NzCodeEditorModule,
  EoNgDropdownModule,
  EoNgButtonModule,
  NzInputModule,
  NzSelectModule,
  EoNgFeedbackTooltipModule
];
const COMPONENTS = [EoTableProComponent, EoMonacoEditorComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule,EoNgCheckboxModule,EoNgTableModule, FormsModule, EoIconparkIconModule, ...antdModules],
  exports: [...COMPONENTS,TabComponentModule, EoIconparkIconModule],
})
export class EouiModule {}
