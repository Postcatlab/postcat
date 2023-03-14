import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EoNgTreeModule } from 'eo-ng-tree';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzResizableModule, NzResizableService } from 'ng-zorro-antd/resizable';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { EoMonacoEditorModule } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco.module';
import { ElectronService, WebService } from 'pc/browser/src/app/core/services';
import { ApiSharedModule } from 'pc/browser/src/app/pages/workspace/project/api/api-shared.module';
import { ApiScriptComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-script/api-script.component';
import { TestServerLocalNodeService } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/local-node/test-connect.service';
import { TestServerRemoteService } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/remote-node/test-connect.service';
import { TestServerServerlessService } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/serverless-node/test-connect.service';

import { SharedModule } from '../../../../../../shared/shared.module';
import { ApiTestUtilService } from '../../service/api-test-util.service';
import { TestServerService } from '../../service/test-server/test-server.service';
import { ApiTestComponent } from './api-test.component';
import { ApiTestService } from './api-test.service';
import { ApiTestBodyComponent } from './body/api-test-body.component';
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
    SharedModule,
    ApiSharedModule,
    NzResizableModule
  ],
  providers: [
    ApiTestService,
    NzResizableService,
    {
      provide: TestServerService,
      useFactory: (electron: ElectronService, web: WebService, locale, test: ApiTestUtilService) => {
        if (electron.isElectron) {
          return new TestServerLocalNodeService(electron, locale, test);
        } else if (!web.isVercel) {
          return new TestServerRemoteService(locale, test);
        } else {
          return new TestServerServerlessService(locale, test);
        }
      },
      deps: [ElectronService, WebService, LOCALE_ID, ApiTestUtilService]
    }
  ]
})
export class ApiTestModule {}
