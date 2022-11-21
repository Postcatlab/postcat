import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExtensionRoutingModule } from './extension-routing.module';
import { ExtensionComponent } from './extension.component';
import { ExtensionListComponent } from './list/extension-list.component';
import { ExtensionDetailModule } from './detail/extension-detail.module';

import { EoNgButtonModule } from 'eo-ng-button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    NzTabsModule,
    NzToolTipModule,
    NzTagModule,
    NzDescriptionsModule,
    NzInputModule,
    EoNgButtonModule,
    ExtensionRoutingModule,
    CommonModule,
    NzDividerModule,
    NzTreeModule,
    NzSwitchModule,
    NzSkeletonModule,
    NzCardModule,
    NzAvatarModule,
    ExtensionDetailModule,
  ],
  declarations: [ExtensionComponent, ExtensionListComponent],
})
export class ExtensionModule {}
