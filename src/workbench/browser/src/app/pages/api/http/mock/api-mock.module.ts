import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/modules/api-shared/api-shared.module';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { EoTableProModule } from 'eo/workbench/browser/src/app/modules/eo-ui/table-pro/table-pro.module';
import { ApiMockEditComponent } from 'eo/workbench/browser/src/app/pages/api/http/mock/edit/api-mock-edit.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

import { ApiMockComponent } from './api-mock.component';

@NgModule({
  declarations: [ApiMockComponent, ApiMockEditComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiMockComponent,
      },
    ]),
    ApiSharedModule,
    EoMonacoEditorModule,
    EoTableProModule,
    SharedModule,
  ],
  providers: [],
  exports: [],
})
export class ApiMockModule {}
