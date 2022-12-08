import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgSwitchModule } from 'eo-ng-switch';
import { EoNgTreeModule } from 'eo-ng-tree';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { ExtensionDetailModule } from './detail/extension-detail.module';
import { ExtensionRoutingModule } from './extension-routing.module';
import { ExtensionComponent } from './extension.component';
import { ExtensionListComponent } from './list/extension-list.component';

@NgModule({
  imports: [
    SharedModule,
    NzDescriptionsModule,
    ExtensionRoutingModule,
    CommonModule,
    NzTreeModule,
    NzCardModule,
    NzAvatarModule,
    ExtensionDetailModule,
    EoNgSwitchModule,
    EoNgTreeModule,
  ],
  declarations: [ExtensionComponent, ExtensionListComponent],
})
export class ExtensionModule {}
