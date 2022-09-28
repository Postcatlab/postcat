import { NgModule } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NavbarComponent } from 'eo/workbench/browser/src/app/pages/navbar/navbar.component';
import { SettingModule } from 'eo/workbench/browser/src/app/shared/components/setting/setting.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

@NgModule({
  imports: [CommonModule, NzDropDownModule, NzToolTipModule, SettingModule, SharedModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
  providers: [MessageService],
})
export class NavbarModule {}
