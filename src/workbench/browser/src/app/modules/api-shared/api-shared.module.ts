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
import { ApiTableService } from './api-table.service';
import { ApiTestFormComponent } from './api-test-form/api-test-form.component';
import { ApiTestResultHeaderComponent } from './api-test-result-header/api-test-result-header.component';
import { ApiFormaterPipe } from './pipe/api-formater.pipe';
import { ApiParamsNumPipe } from './pipe/api-param-num.pipe';

const COMPONENTS = [ApiTestFormComponent, ParamsImportComponent, ApiTestResultHeaderComponent, ApiMockTableComponent];
const SHARE_UI = [EoTableProModule, EoNgTabsModule];
const SHARE_PIPE = [ApiFormaterPipe, ApiParamsNumPipe];
@NgModule({
  imports: [SharedModule, EoMonacoEditorModule, EoNgTreeModule, NzEmptyModule, ...SHARE_UI],
  declarations: [...COMPONENTS, ...SHARE_PIPE],
  providers: [ApiTableService, ApiTestService, ApiMockService],
  exports: [...COMPONENTS, ...SHARE_PIPE, ...SHARE_UI]
})
export class ApiSharedModule {}
