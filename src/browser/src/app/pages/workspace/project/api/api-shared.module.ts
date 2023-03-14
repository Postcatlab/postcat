import { NgModule } from '@angular/core';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { EoMonacoEditorModule } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco.module';
import { EoTableProModule } from 'pc/browser/src/app/components/eo-ui/table-pro/table-pro.module';
import { ApiMockTableComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/api-mock-table.component';
import { ApiTestFormComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/api-test-form/api-test-form.component';
import { ApiTestResultHeaderComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/api-test-result-header/api-test-result-header.component';
import { ParamsImportComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/params-import/params-import.component';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ApiTestService } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.service';
import { ApiTableService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-table.service';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

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
