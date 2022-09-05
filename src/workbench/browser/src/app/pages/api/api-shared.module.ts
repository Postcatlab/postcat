import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiTestHeaderComponent } from './http/test/header/api-test-header.component';
import { ApiTestQueryComponent } from './http/test/query/api-test-query.component';

import { ParamsImportModule } from '../../shared/components/params-import/params-import.module';
import { Ng1Module } from '../../ng1/ng1.module';
import { ApiTestUtilService } from './http/test/api-test-util.service';

const COMPONENTS = [ApiTestHeaderComponent, ApiTestQueryComponent];

@NgModule({
  imports: [CommonModule, Ng1Module, ParamsImportModule],
  declarations: [...COMPONENTS],
  providers: [ApiTestUtilService],
  exports: [...COMPONENTS],
})
export class ApiSharedModule {}
