import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { UserModalComponent } from './user-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExtensionsComponent } from './extensions.component';
import { NavbarModule } from '../layout/navbar/navbar.module';
import { SettingModule } from '../modules/setting/setting.module';
import { PageBlankComponent } from '../layout/page-blank/page-blank.component';
import { PageNotFoundComponent } from '../layout/page-not-found/page-not-found.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { LocalWorkspaceTipComponent } from '../layout/local-workspace-tip/local-workspace-tip.component';
import { ToolbarModule } from '../layout/toolbar/toolbar.module';

@NgModule({
  imports: [PagesRoutingModule, SettingModule, CommonModule, SharedModule, NavbarModule, ToolbarModule],
  declarations: [
    PagesComponent,
    SidebarComponent,
    PageBlankComponent,
    PageNotFoundComponent,
    LocalWorkspaceTipComponent,
    UserModalComponent,
    ExtensionsComponent,
  ],
  exports: [],
  providers: [NzModalService],
  schemas: [],
})
export class PagesModule {}
