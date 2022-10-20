import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';

@NgModule({
  imports: [ShareRoutingModule, CommonModule],
  declarations: [ShareComponent],
  exports: [],
  providers: [],
})
export class ShareModule {}
