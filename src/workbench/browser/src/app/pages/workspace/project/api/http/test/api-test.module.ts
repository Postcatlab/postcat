import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EoNgTreeModule } from 'eo-ng-tree';
import { ElectronService, WebService } from 'eo/workbench/browser/src/app/core/services';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/modules/api-shared/api-shared.module';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { ApiScriptComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-script/api-script.component';
import { TestServerLocalNodeService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/local-node/test-connect.service';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/remote-node/test-connect.service';
import { TestServerServerlessService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/serverless-node/test-connect.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResizableModule, NzResizableService } from 'ng-zorro-antd/resizable';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { SharedModule } from '../../../../../../shared/shared.module';
import { TestServerService } from '../../service/api-test/test-server.service';
import { ApiTestComponent } from './api-test.component';
import { ApiTestService } from './api-test.service';
import { ApiTestBodyComponent } from './body/api-test-body.component';
import { ApiTestRestComponent } from './rest/api-test-rest.component';
import { ApiTestResultRequestBodyComponent } from './result-request-body/api-test-result-request-body.component';
import { ApiTestResultResponseComponent } from './result-response/api-test-result-response.component';
import { ByteToStringPipe } from './result-response/get-size.pipe';

const UI_COMPONETS = [
  NzTabsModule,
  EoNgTreeModule,
  NzDividerModule,
  NzEmptyModule,
  NzTypographyModule,
  NzUploadModule,
  NzBadgeModule,
  EoMonacoEditorModule
];
const COMPONENTS = [
  ApiTestComponent,
  ApiTestBodyComponent,
  ApiTestRestComponent,
  ApiTestResultResponseComponent,
  ApiTestResultRequestBodyComponent,
  ApiScriptComponent
];
@NgModule({
  declarations: [...COMPONENTS, ByteToStringPipe],
  exports: [...COMPONENTS],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiTestComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ...UI_COMPONETS,
    ApiSharedModule,
    SharedModule,
    NzResizableModule
  ],
  providers: [
    ApiTestService,
    NzResizableService,
    {
      provide: TestServerService,
      useFactory: (electron: ElectronService, web: WebService, locale) => {
        if (electron.isElectron) {
          return new TestServerLocalNodeService(electron, locale);
        } else if (!web.isVercel) {
          return new TestServerRemoteService(locale);
        } else {
          return new TestServerServerlessService(locale);
        }
      },
      deps: [ElectronService, WebService, LOCALE_ID]
    }
  ]
})
export class ApiTestModule {}
