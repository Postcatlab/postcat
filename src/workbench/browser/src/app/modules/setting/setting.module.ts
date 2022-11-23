import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { AboutComponent, DataStorageComponent, LanguageSwticherComponent } from './common';
import { AccountComponent } from '../../pages/account.component';

const ANTDMODULES = [
  NzModalModule,
  EoNgButtonModule,
  NzListModule,
  NzInputModule,
  NzFormModule,
  NzSelectModule,
  NzDividerModule,
  NzTabsModule,
  NzTreeViewModule,
  NzCheckboxModule,
  NzInputNumberModule,
  NzEmptyModule,
  NzDropDownModule,
  NzPopoverModule,
  NzRadioModule,
  NzDescriptionsModule,
];
@NgModule({
  declarations: [SettingComponent, AccountComponent, DataStorageComponent, LanguageSwticherComponent, AboutComponent],
  imports: [FormsModule, ReactiveFormsModule, SharedModule, CommonModule, ...ANTDMODULES],
  exports: [SettingComponent],
})
export class SettingModule {}
