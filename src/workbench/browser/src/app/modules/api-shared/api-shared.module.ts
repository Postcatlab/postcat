import { NgModule } from '@angular/core';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { ApiMockTableComponent } from 'eo/workbench/browser/src/app/modules/api-shared/api-mock-table.component';
import { ParamsImportComponent } from 'eo/workbench/browser/src/app/modules/api-shared/params-import/params-import.component';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { ApiTestService } from '../../pages/workspace/project/api/http/test/api-test.service';
import { SharedModule } from '../../shared/shared.module';
import { EoTableProModule } from '../eo-ui/table-pro/table-pro.module';
import { ApiParamsNumPipe } from './api-param-num.pipe';
import { ApiTableService } from './api-table.service';
import { ApiTestHeaderComponent } from './api-test-header/api-test-header.component';
import { ApiTestQueryComponent } from './api-test-query/api-test-query.component';
import { ApiTestResultHeaderComponent } from './api-test-result-header/api-test-result-header.component';
import { ApiTestUtilService } from './api-test-util.service';

const COMPONENTS = [
  ApiTestHeaderComponent,
  ParamsImportComponent,
  ApiTestQueryComponent,
  ApiTestResultHeaderComponent,
  ApiMockTableComponent
];
const SHARE_UI = [EoTableProModule, EoNgTabsModule];

@NgModule({
  imports: [SharedModule, EoMonacoEditorModule, EoNgTreeModule, NzEmptyModule, ...SHARE_UI],
  declarations: [...COMPONENTS, ApiParamsNumPipe],
  providers: [ApiTestUtilService, ApiTableService, ApiTestService, ApiMockService],
  exports: [...COMPONENTS, ApiParamsNumPipe, ...SHARE_UI]
})
export class ApiSharedModule {}
