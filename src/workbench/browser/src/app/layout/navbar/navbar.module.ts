import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetShareLinkComponent } from './get-share-link.component';
import { NavbarComponent } from './navbar.component';
import { SelectWorkspaceComponent } from './select-workspace.component';

@NgModule({
  imports: [SharedModule],
  declarations: [NavbarComponent, GetShareLinkComponent, SelectWorkspaceComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
