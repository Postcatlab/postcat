import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EoIconparkIconComponent } from './eo-iconpark-icon.component';

@NgModule({
  declarations: [EoIconparkIconComponent],
  imports: [CommonModule],
  exports: [EoIconparkIconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EoIconparkIconModule {}
