import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SettingModule } from '../shared/components/setting/setting.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NavbarModule } from 'eo/workbench/browser/src/app/pages/navbar/navbar.module';

@NgModule({
  imports: [PagesRoutingModule,SettingModule, CommonModule, SharedModule, NzIconModule, NavbarModule],
  declarations: [PagesComponent],
  exports: [],
})
export class PagesModule {}
