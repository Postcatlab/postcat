import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';

import { AboutComponent, DataStorageComponent, LanguageSwticherComponent } from './common';
import { AccountComponent } from './common/account.component';
import { SelectThemeComponent } from './common/select-theme/select-theme.component';
import { SettingComponent } from './setting.component';

const ANTDMODULES = [NzDividerModule, NzInputNumberModule, NzEmptyModule, NzDescriptionsModule, NzTreeViewModule];
@NgModule({
  declarations: [SettingComponent, SelectThemeComponent, AccountComponent, DataStorageComponent, LanguageSwticherComponent, AboutComponent],
  imports: [FormsModule, EoNgTabsModule, ReactiveFormsModule, SharedModule, CommonModule, ...ANTDMODULES],
  exports: [SettingComponent]
})
export class SettingModule {}
