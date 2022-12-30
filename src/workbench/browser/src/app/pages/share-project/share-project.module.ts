import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.module';

import { SharedModule } from '../../shared/shared.module';
import { ShareComponent } from './share-project.component';
import { ShareRoutingModule } from './share-routing.module';

@NgModule({
  imports: [ShareRoutingModule, CommonModule, SharedModule, ApiModule],
  declarations: [ShareComponent],
  providers: []
})
export class ShareProjectModule {}
