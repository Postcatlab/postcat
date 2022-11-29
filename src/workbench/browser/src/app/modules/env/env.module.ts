import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EnvComponent } from './env/env.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { EoTableProModule } from '../eo-ui/table-pro/table-pro.module';
import { EnvListComponent } from './env-list/env-list.component';

const ANTDMODULES = [
  NzModalModule,
  EoNgButtonModule,
  NzListModule,
  NzInputModule,
  NzFormModule,
  NzSelectModule,
  NzDividerModule,
  NzPopconfirmModule,
  NzToolTipModule,
  EoTableProModule
];
@NgModule({
  declarations: [EnvComponent,EnvListComponent],
  imports: [FormsModule, CommonModule, SharedModule, ...ANTDMODULES],
  exports: [EnvComponent,EnvListComponent],
})
export class EnvModule {}
