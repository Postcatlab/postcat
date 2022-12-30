/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';

import { EoNgCollapsePanelComponent } from './collapse-panel.component';
import { EoNgCollapseComponent } from './collapse.component';

@NgModule({
  declarations: [EoNgCollapsePanelComponent, EoNgCollapseComponent],
  exports: [EoNgCollapsePanelComponent, EoNgCollapseComponent],
  imports: [BidiModule, CommonModule, NzOutletModule, NzNoAnimationModule]
})
export class EoNgCollapseModule {}
