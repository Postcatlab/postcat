import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { ExtensionSelectModule } from '../../../../modules/extension-select/extension-select.module';
import { ProjectSettingComponent } from './project-setting.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProjectSettingComponent
      }
    ]),
    ExtensionSelectModule,
    NzUploadModule,
    NzCardModule,
    SharedModule
  ],
  declarations: [ProjectSettingComponent]
})
export class ProjectSettingModule {}
