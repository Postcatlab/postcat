import { NgModule } from '@angular/core';
import { EoNgTabsModule } from 'eo-ng-tabs';

import { SharedModule } from '../../../shared/shared.module';
import { EoSettingComponent } from './setting.component';
@NgModule({
  declarations: [EoSettingComponent],
  imports: [SharedModule, EoNgTabsModule],
  exports: [EoSettingComponent]
})
export class EoSettingModule {}
