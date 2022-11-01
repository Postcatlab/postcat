import { NgModule } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NavbarComponent } from 'eo/workbench/browser/src/app/pages/navbar/navbar.component';
import { SettingModule } from 'eo/workbench/browser/src/app/shared/components/setting/setting.module';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, NzDropDownModule, NzSelectModule, NzToolTipModule, SettingModule, SharedModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
