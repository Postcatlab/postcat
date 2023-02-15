import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocalWorkspaceTipComponent } from '../layouts/local-workspace-tip/local-workspace-tip.component';
import { NavbarModule } from '../layouts/navbar/navbar.module';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { ToolbarModule } from '../layouts/toolbar/toolbar.module';
import { SystemSettingModule } from '../modules/system-setting/system-setting.module';
import { SharedModule } from '../shared/shared.module';
import { ThirdLoginComponent } from './components/third-login/third-login.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  imports: [PagesRoutingModule, SystemSettingModule, CommonModule, NavbarModule, ToolbarModule, SharedModule],
  declarations: [PagesComponent, SidebarComponent, LocalWorkspaceTipComponent, UserModalComponent, ThirdLoginComponent],
  exports: [],
  providers: [],
  schemas: []
})
export class PagesModule {}
