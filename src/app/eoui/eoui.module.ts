import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { EoTableComponent } from './eo-table/eo-table.component';
import { EoEditorComponent } from './eo-editor/eo-editor.component';
import { EoSelectComponent } from './eo-select/eo-select.component';

// ! Directive
import { CellDirective } from './eo-table/cell.directive';

const antdModules = [
  NzTableModule,
  NzMessageModule,
  NzIconModule,
  NzButtonModule,
  NzInputModule,
  NzSelectModule,
  NzPopoverModule,
];

const DEFAULT_ACE_CONFIG: AceConfigInterface = {};
@NgModule({
  declarations: [EoTableComponent, EoSelectComponent, EoEditorComponent, CellDirective],
  imports: [CommonModule, FormsModule, AceModule, ...antdModules],
  exports: [EoTableComponent, EoSelectComponent, EoEditorComponent, CellDirective],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG,
    },
  ],
})
export class EouiModule {}
