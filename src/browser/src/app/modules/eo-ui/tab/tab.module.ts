import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { EoIconparkIconModule } from '../iconpark-icon/eo-iconpark-icon.module';
import { TabOperateService } from './tab-operate.service';
import { TabStorageService } from './tab-storage.service';
import { EoTabComponent } from './tab.component';

@NgModule({
  declarations: [EoTabComponent],
  imports: [
    CommonModule,
    NzOutletModule,
    EoNgTabsModule,
    EoNgButtonModule,
    EoIconparkIconModule,
    EoNgDropdownModule,
    NzSpinModule,
    NzBadgeModule
  ],
  providers: [TabOperateService, TabStorageService],
  exports: [EoTabComponent]
})
export class EoTabModule {}
