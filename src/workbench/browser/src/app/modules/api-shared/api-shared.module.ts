import { NgModule } from '@angular/core';
import { ApiTestHeaderComponent } from './api-test-header/api-test-header.component';
import { ApiTestQueryComponent } from './api-test-query/api-test-query.component';
import { ApiTestResultHeaderComponent } from './api-test-result-header/api-test-result-header.component';

import { ApiTestUtilService } from './api-test-util.service';
import { ApiTestService } from '../../pages/api/http/test/api-test.service';
import { ApiParamsNumPipe } from './api-param-num.pipe';
import { ParamsImportComponent } from './params-import/params-import.component';
import { SharedModule } from '../../shared/shared.module';
import { ApiTableService } from './api-table.service';
import { EoTableProModule } from '../eo-ui/table-pro/table-pro.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { ApiMockTableComponent } from 'eo/workbench/browser/src/app/modules/api-shared/api-mock-table.component';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/api/http/mock/api-mock.service';
const COMPONENTS = [
  ApiTestHeaderComponent,
  ParamsImportComponent,
  ApiTestQueryComponent,
  ApiTestResultHeaderComponent,
  ApiMockTableComponent
];
const SHARE_UI = [EoTableProModule, EoNgTabsModule];

@NgModule({
  imports: [SharedModule,EoMonacoEditorModule,EoNgTreeModule, NzEmptyModule, ...SHARE_UI],
  declarations: [...COMPONENTS, ApiParamsNumPipe],
  providers: [ApiTestUtilService, ApiTableService, ApiTestService,ApiMockService],
  exports: [...COMPONENTS,ApiParamsNumPipe, ...SHARE_UI],
})
export class ApiSharedModule {}
