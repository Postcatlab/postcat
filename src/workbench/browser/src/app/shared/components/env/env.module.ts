import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EnvComponent } from './env.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EouiModule } from '../../../eoui/eoui.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ElectronService } from '../../../core/services';

const ANTDMODULES = [
  NzModalModule,
  NzButtonModule,
  NzIconModule,
  NzListModule,
  NzInputModule,
  NzFormModule,
  NzSelectModule,
  NzDividerModule,
  NzPopconfirmModule,
  NzToolTipModule,
];
@NgModule({
  declarations: [EnvComponent],
  imports: [FormsModule, CommonModule, EouiModule, ...ANTDMODULES],
  exports: [EnvComponent],
  providers: [ElectronService],
})
export class EnvModule {}
