import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetShareLinkComponent } from './get-share-link.component';
import { NavbarComponent } from './navbar.component';
import { SelectWorkspaceComponent } from './select-workspace.component';
import { WinOperateComponent } from './win-operate.component';

@NgModule({
  imports: [SharedModule],
  declarations: [NavbarComponent, GetShareLinkComponent, WinOperateComponent, SelectWorkspaceComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
