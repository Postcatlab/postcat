import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiOverviewComponent } from 'eo/workbench/browser/src/app/pages/workspace/overview/api-overview.component';
import { WorkspaceComponent } from 'eo/workbench/browser/src/app/pages/workspace/workspace.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { SharedModule } from '../../shared/shared.module';
import { ExportApiComponent } from './export-api/export-api.component';
import { ExtensionSelectComponent } from './extension-select/extension-select.component';
import { ImportApiComponent } from './import-api/import-api.component';
import { SyncApiComponent } from './sync-api/sync-api.component';

@NgModule({
  declarations: [
    ExportApiComponent,
    ImportApiComponent,
    SyncApiComponent,
    ExtensionSelectComponent,
    WorkspaceComponent,
    ApiOverviewComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WorkspaceComponent,
      },
    ]),
    NzCardModule,
    CommonModule,
    NzFormModule,
    SharedModule,
    NzUploadModule,
  ],
})
export class WorkspaceModule {}
