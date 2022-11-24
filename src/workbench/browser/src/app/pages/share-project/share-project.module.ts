import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule } from 'eo/workbench/browser/src/app/pages/api/api.module';

import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share-project.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [ShareRoutingModule, CommonModule, SharedModule, ApiModule],
  declarations: [ShareComponent],
  providers: [],
})
export class ShareProjectModule {}
