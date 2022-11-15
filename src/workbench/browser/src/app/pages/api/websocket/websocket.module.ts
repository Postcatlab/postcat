import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EoNgButtonModule } from 'eo-ng-button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { Ng1Module } from '../../../ng1/ng1.module';
import { ApiEditUtilService } from '../http/edit/api-edit-util.service';

import { WebsocketComponent } from './websocket.component';
import { WebsocketRoutingModule } from './websocket.routing.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/pages/api/api-shared.module';
import { ApiTestModule } from 'eo/workbench/browser/src/app/pages/api/http/test/api-test.module';

const ANTDS = [EoNgButtonModule, NzInputModule, NzSelectModule, NzTabsModule];

@NgModule({
  imports: [
    WebsocketRoutingModule,
    ApiSharedModule,
    // FormsModule,
    Ng1Module,
    // ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ApiTestModule,
    ...ANTDS,
  ],
  declarations: [WebsocketComponent],
  exports: [WebsocketComponent],
  providers: [ApiEditUtilService],
})
export class WebsocketModule {}
