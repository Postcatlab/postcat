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
import { AccountComponent } from 'eo/workbench/browser/src/app/pages/account.component';

import { SelectThemeComponent } from 'eo/workbench/browser/src/app/shared/components/toolbar/select-theme/select-theme.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { IconDefinition } from '@ant-design/icons-angular';
import { CaretDownFill } from '@ant-design/icons-angular/icons';
import {
  DataStorageComponent,
  LanguageSwticherComponent,
  AboutComponent,
  ExtensionSettingComponent,
} from 'eo/workbench/browser/src/app/shared/components/setting/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
const icons: IconDefinition[] = [CaretDownFill];
const ANTDMODULES = [
  NzModalModule,
  EoNgButtonModule,
  NzListModule,
  NzInputModule,
  NzIconModule.forRoot(icons),
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
  declarations: [
    SettingComponent,
    SelectThemeComponent,
    DataStorageComponent,
    LanguageSwticherComponent,
    AccountComponent,
    AboutComponent,
    ExtensionSettingComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule, SharedModule, CommonModule, ...ANTDMODULES],
  exports: [SettingComponent, SelectThemeComponent],
})
export class SettingModule {}
