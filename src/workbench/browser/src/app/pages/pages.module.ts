import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { LocalWorkspaceTipComponent } from '../layouts/local-workspace-tip/local-workspace-tip.component';
import { NavbarModule } from '../layouts/navbar/navbar.module';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { ToolbarModule } from '../layouts/toolbar/toolbar.module';
import { ChatRobotModule } from '../modules/chat-robot/chat-robot.module';
import { NpsMaskModule } from '../modules/nps-mask/nps-mask.module';
import { SystemSettingModule } from '../modules/system-setting/system-setting.module';
import { SharedModule } from '../shared/shared.module';
import { ChatgptRobotComponent } from './components/chatgpt-robot/chatgpt-robot.component';
import { ThirdLoginComponent } from './components/third-login/third-login.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    NpsMaskModule,
    NzNotificationModule,
    SystemSettingModule,
    CommonModule,
    NavbarModule,
    ToolbarModule,
    SharedModule,
    ChatRobotModule
  ],
  declarations: [
    PagesComponent,
    SidebarComponent,
    LocalWorkspaceTipComponent,
    UserModalComponent,
    ThirdLoginComponent,
    ChatgptRobotComponent
  ],
  exports: [],
  providers: [],
  schemas: []
})
export class PagesModule {}
