import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AceModule, ACE_CONFIG, AceConfigInterface } from 'ngx-ace-wrapper';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { EoTableComponent } from './table/eo-table/eo-table.component';
import { EoEditorComponent } from './editor/eo-editor/eo-editor.component';
import { EoMessageComponent } from './message/eo-message.component';

// ! Directive
import { CellDirective } from './table/eo-table/cell.directive';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module';

const antdModules = [NzTableModule, NzButtonModule, NzInputModule, NzSelectModule];

const DEFAULT_ACE_CONFIG: AceConfigInterface = {};
@NgModule({
  declarations: [EoTableComponent, EoEditorComponent, EoMessageComponent, CellDirective],
  imports: [CommonModule, FormsModule, AceModule, EoIconparkIconModule, ...antdModules],
  exports: [EoTableComponent, EoEditorComponent, EoMessageComponent, CellDirective],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG,
    },
  ],
})
export class EouiModule {}
