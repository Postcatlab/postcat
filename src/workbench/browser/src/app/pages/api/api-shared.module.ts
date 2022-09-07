import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiTestHeaderComponent } from './http/test/header/api-test-header.component';
import { ApiTestQueryComponent } from './http/test/query/api-test-query.component';
import { ApiTestResultHeaderComponent } from './http/test/result-header/api-test-result-header.component';

import { ParamsImportModule } from '../../shared/components/params-import/params-import.module';
import { Ng1Module } from '../../ng1/ng1.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { ApiTestUtilService } from './http/test/api-test-util.service';
import { ApiTestService } from './http/test/api-test.service';

const COMPONENTS = [ApiTestHeaderComponent, ApiTestQueryComponent, ApiTestResultHeaderComponent];

@NgModule({
  imports: [CommonModule, Ng1Module, NzEmptyModule, ParamsImportModule],
  declarations: [...COMPONENTS],
  providers: [ApiTestUtilService, ApiTestService],
  exports: [...COMPONENTS],
})
export class ApiSharedModule {}
