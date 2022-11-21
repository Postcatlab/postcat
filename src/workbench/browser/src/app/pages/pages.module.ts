import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { ExtensionsComponent } from './extensions.component';
import { Vue3Component } from 'eo/workbench/browser/src/app/pages/vue3/vue3.component';
import { WujieModule } from '@xmagic/ngx-wujie';

@NgModule({
  imports: [
    PagesRoutingModule,
    WujieModule,
    SettingModule,
    EouiModule,
    CommonModule,
    NzAlertModule,
    SharedModule,
    NavbarModule,
  ],
  declarations: [PagesComponent, Vue3Component, UserModalComponent, ExtensionsComponent],
  exports: [],
  providers: [NzModalService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
