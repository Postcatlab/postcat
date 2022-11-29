import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabOperateService } from './tab-operate.service';
import { TabStorageService } from './tab-storage.service';
import { EoTabComponent } from './tab.component';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoIconparkIconModule } from '../iconpark-icon/eo-iconpark-icon.module';
import { EoNgDropdownModule } from 'eo-ng-dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';

@NgModule({
  declarations: [EoTabComponent],
    imports: [CommonModule,NzOutletModule,EoNgTabsModule,EoNgButtonModule,EoIconparkIconModule,EoNgDropdownModule,NzSpinModule,NzBadgeModule],
  providers: [TabOperateService, TabStorageService],
  exports: [EoTabComponent],
})
export class EoTabModule {}
