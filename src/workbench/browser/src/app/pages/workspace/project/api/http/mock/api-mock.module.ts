import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/modules/api-shared/api-shared.module';
import { DownloadClientModule } from 'eo/workbench/browser/src/app/modules/download-client/download-client.module';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { EoTableProModule } from 'eo/workbench/browser/src/app/modules/eo-ui/table-pro/table-pro.module';
import { ApiMockEditComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/mock/edit/api-mock-edit.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzResultModule } from 'ng-zorro-antd/result';

import { ApiMockComponent } from './api-mock.component';
@NgModule({
  declarations: [ApiMockComponent, ApiMockEditComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiMockComponent
      }
    ]),
    NzResultModule,
    ApiSharedModule,
    EoMonacoEditorModule,
    EoTableProModule,
    SharedModule,
    DownloadClientModule
  ],
  providers: [],
  exports: []
})
export class ApiMockModule {}
