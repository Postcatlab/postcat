import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EoNgButtonModule } from 'eo-ng-button';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/modules/api-shared/api-shared.module';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { ApiTestModule } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-test.module';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { ApiEditUtilService } from '../http/edit/api-edit-util.service';
import { WebsocketComponent } from './websocket.component';
import { WebsocketRoutingModule } from './websocket.routing.module';

const ANTDS = [EoNgButtonModule, NzTabsModule];

@NgModule({
  imports: [
    EoMonacoEditorModule,
    WebsocketRoutingModule,
    ApiSharedModule,
    CommonModule,
    SharedModule,
    ApiTestModule,
    NzResizableModule,
    NzBadgeModule,
    ...ANTDS
  ],
  declarations: [WebsocketComponent],
  exports: [WebsocketComponent],
  providers: [ApiEditUtilService]
})
export class WebsocketModule {}
