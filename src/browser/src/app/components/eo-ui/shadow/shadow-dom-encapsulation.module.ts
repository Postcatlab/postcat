import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShadowDomEncapsulationComponent } from './shadow-dom-encapsulation.component';

@NgModule({
  declarations: [ShadowDomEncapsulationComponent],
  imports: [CommonModule],
  exports: [ShadowDomEncapsulationComponent]
})
export class ShadowDomEncapsulationModule {}
