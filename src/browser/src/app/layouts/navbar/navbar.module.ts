import { NgModule } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { DownloadClientModule } from '../../components/download-client/download-client.module';
import { LogoModule } from '../../components/logo/logo.module';
import { SharedModule } from '../../shared/shared.module';
import { NavBreadcrumbComponent } from './breadcrumb/nav-breadcrumb.component';
import { SelectWorkspaceComponent } from './breadcrumb/select-workspace/select-workspace.component';
import { BtnUserComponent } from './btn-user/btn-user.component';
import { GetShareLinkComponent } from './get-share-link.component';
import { HelpDropdownComponent } from './help-dropdown/help-dropdown.component';
import { NavOperateComponent } from './nav-operate.component';
import { NavbarComponent } from './navbar.component';
import { ShareNavbarComponent } from './share-navbar/share-navbar.component';

@NgModule({
  imports: [SharedModule, DownloadClientModule, LogoModule, NzBreadCrumbModule],
  declarations: [
    NavbarComponent,
    GetShareLinkComponent,
    NavOperateComponent,
    SelectWorkspaceComponent,
    NavBreadcrumbComponent,
    ShareNavbarComponent,
    HelpDropdownComponent,
    BtnUserComponent
  ],
  exports: [NavbarComponent, ShareNavbarComponent]
})
export class NavbarModule {}
