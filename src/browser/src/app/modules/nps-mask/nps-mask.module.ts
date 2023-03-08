import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NpsMaskComponent } from './component/nps-mask.component';

@NgModule({
  declarations: [NpsMaskComponent],
  imports: [CommonModule],
  exports: [NpsMaskComponent]
})
export class NpsMaskModule {}
