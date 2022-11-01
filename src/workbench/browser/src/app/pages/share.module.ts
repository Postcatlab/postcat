import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiModule } from 'eo/workbench/browser/src/app/pages/api/api.module'

import { ShareRoutingModule } from './share-routing.module'
import { ShareComponent } from './share.component'

@NgModule({
  imports: [ShareRoutingModule, CommonModule, ApiModule],
  declarations: [ShareComponent],
  exports: [],
  providers: []
})
export class ShareModule {}
