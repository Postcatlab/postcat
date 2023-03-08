import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule } from 'pc/browser/src/app/pages/workspace/project/api/api.module';

import { NavbarModule } from '../../layouts/navbar/navbar.module';
import { SharedModule } from '../../shared/shared.module';
import { ShareComponent } from './share-project.component';
import { ShareRoutingModule } from './share-routing.module';

@NgModule({
  imports: [ShareRoutingModule, NavbarModule, CommonModule, SharedModule, ApiModule],
  declarations: [ShareComponent],
  providers: []
})
export class ShareProjectModule {}
