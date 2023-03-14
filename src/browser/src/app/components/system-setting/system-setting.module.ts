import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { EoSettingModule } from '../eo-ui/setting/setting.module';
import { LogoModule } from '../logo/logo.module';
import { StarMotivationComponent } from '../star-motivation/star-motivation.component';
import { AboutComponent, DataStorageComponent, LanguageSwticherComponent, TokenComponent } from './common';
import { AccountComponent } from './common/account.component';
import { SelectThemeComponent } from './common/select-theme/select-theme.component';
import { SystemSettingComponent } from './system-setting.component';

const ANTDMODULES = [NzDividerModule, NzInputNumberModule, NzEmptyModule, NzDescriptionsModule, NzTreeViewModule];
@NgModule({
  declarations: [
    SystemSettingComponent,
    SelectThemeComponent,
    AccountComponent,
    TokenComponent,
    DataStorageComponent,
    LanguageSwticherComponent,
    AboutComponent
  ],
  imports: [
    EoSettingModule,
    StarMotivationComponent,
    LogoModule,
    FormsModule,
    EoNgTabsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    ...ANTDMODULES
  ],
  exports: [SystemSettingComponent]
})
export class SystemSettingModule {}
