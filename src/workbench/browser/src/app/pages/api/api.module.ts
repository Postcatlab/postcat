import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ApiRoutingModule } from './api-routing.module';
import { EnvModule } from '../../shared/components/env/env.module';

import { ApiComponent } from './api.component';
import { ApiGroupEditComponent } from './group/edit/api-group-edit.component';
import { ExportApiComponent } from '../../shared/components/export-api/export-api.component';
import { SyncApiComponent } from '../../shared/components/sync-api/sync-api.component';

import { ImportApiComponent } from '../../shared/components/import-api/import-api.component';
import { ExtensionSelectComponent } from '../../shared/components/extension-select/extension-select.component';

import { ApiGroupTreeComponent } from './group/tree/api-group-tree.component';
import { ApiTabComponent } from './tab/api-tab.component';
import { ApiService } from './api.service';
import { ElectronService } from '../../core/services';
import { HistoryComponent } from './history/eo-history.component';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';
import { ApiTabService } from 'eo/workbench/browser/src/app/pages/api/api-tab.service';

const COMPONENTS = [
  ApiComponent,
  ApiGroupEditComponent,
  ApiGroupTreeComponent,
  ExportApiComponent,
  SyncApiComponent,
  ApiTabComponent,
  ImportApiComponent,
  ExtensionSelectComponent,
  HistoryComponent,
];
@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ApiRoutingModule,
    EnvModule,
    SharedModule,
  ],
  declarations: [...COMPONENTS],
  exports: [ApiComponent],
  providers: [ElectronService, ApiService, ApiTabService, ApiTabOperateService, ApiTabStorageService, IndexedDBStorage],
})
export class ApiModule {}
