import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';

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
  NzTabsModule,
  NzTreeViewModule,
  NzCheckboxModule,
  NzInputNumberModule,
];
@NgModule({
  declarations: [SettingComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ...ANTDMODULES],
  exports: [SettingComponent],
  providers: [ElectronService],
})
export class SettingModule {}
