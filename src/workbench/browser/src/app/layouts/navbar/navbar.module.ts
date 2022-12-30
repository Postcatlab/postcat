import { NgModule } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { SharedModule } from '../../shared/shared.module';
import { NavBreadcrumbComponent } from './breadcrumb/nav-breadcrumb.component';
import { SelectWorkspaceComponent } from './breadcrumb/select-workspace/select-workspace.component';
import { GetShareLinkComponent } from './get-share-link.component';
import { NavOperateComponent } from './nav-operate.component';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [SharedModule, NzBreadCrumbModule],
  declarations: [NavbarComponent, GetShareLinkComponent, NavOperateComponent, SelectWorkspaceComponent, NavBreadcrumbComponent],
  exports: [NavbarComponent]
})
export class NavbarModule {}
