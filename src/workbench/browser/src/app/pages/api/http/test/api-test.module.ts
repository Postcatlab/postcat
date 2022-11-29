import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../../shared/shared.module';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { ByteToStringPipe } from './result-response/get-size.pipe';

import { TestServerService } from '../../service/api-test/test-server.service';
import { ElectronService, WebService } from 'eo/workbench/browser/src/app/core/services';
import { TestServerLocalNodeService } from 'eo/workbench/browser/src/app/pages/api/service/api-test/local-node/test-connect.service';
import { TestServerServerlessService } from 'eo/workbench/browser/src/app/pages/api/service/api-test/serverless-node/test-connect.service';

import { ApiTestComponent } from './api-test.component';
import { ApiTestBodyComponent } from './body/api-test-body.component';
import { ApiTestRestComponent } from './rest/api-test-rest.component';
import { ApiTestResultResponseComponent } from './result-response/api-test-result-response.component';
import { ApiTestResultRequestBodyComponent } from './result-request-body/api-test-result-request-body.component';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/pages/api/service/api-test/remote-node/test-connect.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { RouterModule } from '@angular/router';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/modules/api-shared/api-shared.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzResizableModule, NzResizableService } from 'ng-zorro-antd/resizable';
import { ApiTestService } from './api-test.service';

const NZ_COMPONETS = [
  NzDropDownModule,
  NzModalModule,
  NzInputModule,
  EoNgButtonModule,
  NzFormModule,
  NzSelectModule,
  NzTreeSelectModule,
  NzTabsModule,
  NzRadioModule,
  NzDividerModule,
  NzEmptyModule,
  NzPopconfirmModule,
  NzToolTipModule,
  NzTypographyModule,
  NzUploadModule,
  NzBadgeModule,
];
const COMPONENTS = [
  ApiTestComponent,
  ApiTestBodyComponent,
  ApiTestRestComponent,
  ApiTestResultResponseComponent,
  ApiTestResultRequestBodyComponent,
];
@NgModule({
  declarations: [...COMPONENTS, ByteToStringPipe],
  exports: [...COMPONENTS],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiTestComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ...NZ_COMPONETS,
    ApiSharedModule,
    SharedModule,
    NzResizableModule,
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
      deps: [ElectronService, WebService, LOCALE_ID],
    },
  ],
})
export class ApiTestModule {}
