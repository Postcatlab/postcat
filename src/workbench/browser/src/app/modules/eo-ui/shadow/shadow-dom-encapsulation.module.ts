import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowDomEncapsulationComponent } from './shadow-dom-encapsulation.component';



@NgModule({
  declarations: [ShadowDomEncapsulationComponent],
  imports: [
    CommonModule
  ],
  exports:[ShadowDomEncapsulationComponent]
})
export class ShadowDomEncapsulationModule { }
