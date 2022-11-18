import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExtensionSettingComponent } from './components/extensions.component';
import { ExtensionDetailComponent } from './extension-detail.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, FormsModule, CommonModule],
  declarations: [ExtensionSettingComponent, ExtensionDetailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExtensionDetailModule {}
