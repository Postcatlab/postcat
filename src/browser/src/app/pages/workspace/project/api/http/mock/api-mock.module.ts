import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { DownloadClientModule } from 'pc/browser/src/app/components/download-client/download-client.module';
import { EoMonacoEditorModule } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco.module';
import { EoTableProModule } from 'pc/browser/src/app/components/eo-ui/table-pro/table-pro.module';
import { ApiSharedModule } from 'pc/browser/src/app/pages/workspace/project/api/api-shared.module';
import { ApiMockEditComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/edit/api-mock-edit.component';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

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
    ApiSharedModule,
    NzResultModule,
    EoMonacoEditorModule,
    EoTableProModule,
    SharedModule,
    DownloadClientModule
  ],
  providers: [],
  exports: []
})
export class ApiMockModule {}
