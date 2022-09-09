import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SettingModule } from '../shared/components/setting/setting.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from 'eo/workbench/browser/src/app/pages/navbar/navbar.module';
import { EouiModule } from 'eo/workbench/browser/src/app/eoui/eoui.module';

@NgModule({
  imports: [PagesRoutingModule, SettingModule, EouiModule, CommonModule, SharedModule, NavbarModule],
  declarations: [PagesComponent],
  exports: [],
})
export class PagesModule {}
