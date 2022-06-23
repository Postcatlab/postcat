import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NavbarComponent } from 'eo/workbench/browser/src/app/pages/navbar/navbar.component';
import { SettingModule } from 'eo/workbench/browser/src/app/shared/components/setting/setting.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule,NzDropDownModule,NzToolTipModule, SettingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
