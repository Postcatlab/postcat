import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExtensionRoutingModule } from './extension-routing.module';
import { ExtensionComponent } from './extension.component';
import { ExtensionListComponent } from './list/extension-list.component';
import { ExtensionDetailModule } from './detail/extension-detail.module';

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { EoNgSwitchModule } from 'eo-ng-switch';
import { EoNgTreeModule } from 'eo-ng-tree';
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
