import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SettingModule } from '../shared/components/setting/setting.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from 'eo/workbench/browser/src/app/pages/navbar/navbar.module';
import { EouiModule } from 'eo/workbench/browser/src/app/eoui/eoui.module';
import { UserModalComponent } from './user-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';


@NgModule({
  imports: [PagesRoutingModule, SettingModule, EouiModule, CommonModule, NzAlertModule, SharedModule, NavbarModule],
  declarations: [PagesComponent, UserModalComponent],
  exports: [],
  providers: [NzModalService],
})
export class PagesModule {}
