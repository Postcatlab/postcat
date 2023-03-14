import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { NpsMaskModule } from '../components/nps-mask/nps-mask.module';
import { SystemSettingModule } from '../components/system-setting/system-setting.module';
import { LocalWorkspaceTipComponent } from '../layouts/local-workspace-tip/local-workspace-tip.component';
import { NavbarModule } from '../layouts/navbar/navbar.module';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { ToolbarModule } from '../layouts/toolbar/toolbar.module';
import { SharedModule } from '../shared/shared.module';
import { ChatgptRobotComponent } from './components/chatgpt-robot/chatgpt-robot.component';
import { ThirdLoginComponent } from './components/third-login/third-login.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent, SidebarComponent, LocalWorkspaceTipComponent, UserModalComponent, ThirdLoginComponent],
  exports: [],
  providers: [],
  schemas: [],
  imports: [
    ChatgptRobotComponent,
    PagesRoutingModule,
    NpsMaskModule,
    NzNotificationModule,
    SystemSettingModule,
    CommonModule,
    NavbarModule,
    ToolbarModule,
    SharedModule
  ]
})
export class PagesModule {}
