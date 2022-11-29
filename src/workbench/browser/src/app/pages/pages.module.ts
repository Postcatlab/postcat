import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { UserModalComponent } from './user-modal.component';
import { ExtensionsComponent } from './extensions.component';
import { NavbarModule } from '../layout/navbar/navbar.module';
import { SettingModule } from '../modules/setting/setting.module';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { LocalWorkspaceTipComponent } from '../layout/local-workspace-tip/local-workspace-tip.component';
import { ToolbarModule } from '../layout/toolbar/toolbar.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PagesRoutingModule, SettingModule, CommonModule, NavbarModule, ToolbarModule, SharedModule],
  declarations: [PagesComponent, SidebarComponent, LocalWorkspaceTipComponent, UserModalComponent, ExtensionsComponent],
  exports: [],
  providers: [],
  schemas: [],
})
export class PagesModule {}
