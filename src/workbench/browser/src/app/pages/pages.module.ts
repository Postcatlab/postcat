import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SettingModule } from '../shared/components/setting/setting.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [PagesComponent],
  imports: [PagesRoutingModule, SettingModule, CommonModule, SharedModule, NzIconModule],
  exports: [],
})
export class PagesModule {}
