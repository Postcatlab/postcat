import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { WorkspaceComponent } from '../workspace/workspace.component';
import { ExportApiComponent } from './components/export-api/export-api.component';
import { ExtensionSelectComponent } from './components/extension-select/extension-select.component';
import { ImportApiComponent } from './components/import-api/import-api.component';
import { SyncApiComponent } from './components/sync-api/sync-api.component';
import { ProjectSettingComponent } from './project-setting.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProjectSettingComponent
      }
    ]),
    NzUploadModule,
    NzCardModule,
    SharedModule
  ],
  declarations: [
    ProjectSettingComponent,
    ExportApiComponent,
    ImportApiComponent,
    SyncApiComponent,
    ExtensionSelectComponent,
    WorkspaceComponent
  ]
})
export class ProjectSettingModule {}
