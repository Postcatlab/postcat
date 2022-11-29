import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportApiComponent } from './export-api/export-api.component';
import { ImportApiComponent } from './import-api/import-api.component';
import { SyncApiComponent } from './sync-api/sync-api.component';
import { WorkspaceModule } from '../workspace.module';
import { SharedModule } from '../../shared/shared.module';
import { ExtensionSelectComponent } from './extension-select/extension-select.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@NgModule({
  declarations: [
    ExportApiComponent,
    ImportApiComponent,
    SyncApiComponent,
    ExtensionSelectComponent
  ],
  imports: [CommonModule,SharedModule,WorkspaceModule,NzUploadModule],
})
export class EoWorkspaceModule {}
