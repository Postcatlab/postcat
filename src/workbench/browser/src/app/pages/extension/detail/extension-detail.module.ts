import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExtensionSettingComponent } from './components/extensions.component';
import { ExtensionDetailComponent } from './extension-detail.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

@NgModule({
  imports: [SharedModule, FormsModule, CommonModule,NzAvatarModule,NzResultModule,NzInputNumberModule,NzDescriptionsModule],
  declarations: [ExtensionSettingComponent, ExtensionDetailComponent],
  schemas: [],
})
export class ExtensionDetailModule {}
