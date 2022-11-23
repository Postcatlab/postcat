import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiTestHeaderComponent } from './api-test-header/api-test-header.component';
import { ApiTestQueryComponent } from './api-test-query/api-test-query.component';
import { ApiTestResultHeaderComponent } from './api-test-result-header/api-test-result-header.component';

import { NzFormModule } from 'ng-zorro-antd/form';

import { ApiTestUtilService } from '../../pages/api/http/test/api-test-util.service';
import { ApiTestService } from '../../pages/api/http/test/api-test.service';
import { ApiScriptComponent } from './api-script/api-script.component';
import { ApiParamsNumPipe } from './api-param-num.pipe';
import { ParamsImportComponent } from './params-import/params-import.component';
import { SharedModule } from '../../shared/shared.module';
import { Ng1Module } from '../../ng1/ng1.module';

const COMPONENTS = [ApiTestHeaderComponent, ApiScriptComponent,ParamsImportComponent, ApiTestQueryComponent, ApiTestResultHeaderComponent];

@NgModule({
  imports: [SharedModule,Ng1Module],
  declarations: [...COMPONENTS, ApiParamsNumPipe],
  providers: [ApiTestUtilService, ApiTestService],
  exports: [...COMPONENTS, ApiParamsNumPipe],
})
export class ApiSharedModule {}
