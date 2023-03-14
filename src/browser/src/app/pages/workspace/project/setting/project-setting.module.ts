import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { ExtensionSelectModule } from '../../../../components/extension-select/extension-select.module';
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
    SharedModule,
    NzToolTipModule
  ],
  declarations: [ProjectSettingComponent]
})
export class ProjectSettingModule {}
