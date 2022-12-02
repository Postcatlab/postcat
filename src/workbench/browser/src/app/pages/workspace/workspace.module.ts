import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportApiComponent } from './export-api/export-api.component';
import { ImportApiComponent } from './import-api/import-api.component';
import { SyncApiComponent } from './sync-api/sync-api.component';
import { SharedModule } from '../../shared/shared.module';
import { ExtensionSelectComponent } from './extension-select/extension-select.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { WorkspaceComponent } from 'eo/workbench/browser/src/app/pages/workspace/workspace.component';
import { RouterModule } from '@angular/router';
import { ApiOverviewComponent } from 'eo/workbench/browser/src/app/pages/workspace/overview/api-overview.component';
import { NzCardModule } from 'ng-zorro-antd/card';

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
