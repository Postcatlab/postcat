import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { AboutComponent, DataStorageComponent, LanguageSwticherComponent } from './common';
import { AccountComponent } from '../../pages/account.component';
import { SelectThemeComponent } from './common/select-theme/select-theme.component';

const ANTDMODULES = [
  NzDividerModule,
  NzInputNumberModule,
  NzEmptyModule,
  NzDescriptionsModule,
  NzTreeViewModule
];
@NgModule({
  declarations: [SettingComponent,SelectThemeComponent, AccountComponent, DataStorageComponent, LanguageSwticherComponent, AboutComponent],
  imports: [FormsModule, ReactiveFormsModule, SharedModule, CommonModule, ...ANTDMODULES],
  exports: [SettingComponent],
})
export class SettingModule {}
