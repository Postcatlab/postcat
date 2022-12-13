import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { GetShareLinkComponent } from './get-share-link.component';
import { NavOperateComponent } from './nav-operate.component';
import { NavbarComponent } from './navbar.component';
import { SelectWorkspaceComponent } from './select-workspace.component';

@NgModule({
  imports: [SharedModule],
  declarations: [NavbarComponent, GetShareLinkComponent, NavOperateComponent, SelectWorkspaceComponent],
  exports: [NavbarComponent]
})
export class NavbarModule {}
