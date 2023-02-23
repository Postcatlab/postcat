import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { npsMaskComponent } from './component/nps-mask.component';

@NgModule({
  declarations: [npsMaskComponent],
  imports: [CommonModule],
  exports: [npsMaskComponent]
})
export class npsMaskModule {}
