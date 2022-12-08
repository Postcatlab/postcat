import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocalWorkspaceTipComponent } from '../layouts/local-workspace-tip/local-workspace-tip.component';
import { NavbarModule } from '../layouts/navbar/navbar.module';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { ToolbarModule } from '../layouts/toolbar/toolbar.module';
import { SettingModule } from '../modules/setting/setting.module';
import { SharedModule } from '../shared/shared.module';
import { ExtensionsComponent } from './extensions.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { UserModalComponent } from './user-modal.component';

@NgModule({
  imports: [PagesRoutingModule, SettingModule, CommonModule, NavbarModule, ToolbarModule, SharedModule],
  declarations: [PagesComponent, SidebarComponent, LocalWorkspaceTipComponent, UserModalComponent, ExtensionsComponent],
  exports: [],
  providers: [],
  schemas: [],
})
export class PagesModule {}
