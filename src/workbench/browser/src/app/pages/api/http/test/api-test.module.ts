import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng1Module } from '../../../../ng1/ng1.module';
import { EouiModule } from '../../../../eoui/eoui.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ParamsImportModule } from '../../../../shared/components/params-import/params-import.module';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { ByteToStringPipe } from './result-response/get-size.pipe';

import { TestServerService } from '../../../../shared/services/api-test/test-server.service';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { TestServerLocalNodeService } from 'eo/workbench/browser/src/app/shared/services/api-test/local-node/test-connect.service';
import { TestServerServerlessService } from 'eo/workbench/browser/src/app/shared/services/api-test/serverless-node/test-connect.service';

import { ApiTestUtilService } from './api-test-util.service';
import { ApiTestService } from './api-test.service';

import { ApiTestComponent } from './api-test.component';
import { ApiTestBodyComponent } from './body/api-test-body.component';
import { ApiTestRestComponent } from './rest/api-test-rest.component';
// import { ApiTestResultHeaderComponent } from './result-header/api-test-result-header.component';
import { ApiTestResultResponseComponent } from './result-response/api-test-result-response.component';
import { ApiTestResultRequestBodyComponent } from './result-request-body/api-test-result-request-body.component';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/shared/services/api-test/remote-node/test-connect.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { RouterModule } from '@angular/router';
import { ApiSharedModule } from 'eo/workbench/browser/src/app/pages/api/api-shared.module';

const NZ_COMPONETS = [
  NzDropDownModule,
  NzModalModule,
  NzInputModule,
  NzButtonModule,
  NzFormModule,
  NzSelectModule,
  NzTreeSelectModule,
  NzCollapseModule,
  NzTabsModule,
  NzRadioModule,
  NzDividerModule,
  NzEmptyModule,
  NzPopconfirmModule,
  NzToolTipModule,
  NzAlertModule,
  NzTypographyModule,
  NzUploadModule,
  ApiSharedModule,
];
const COMPONENTS = [
  ApiTestComponent,
  ApiTestBodyComponent,
  ApiTestRestComponent,
  // ApiTestResultHeaderComponent,
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
    Ng1Module,
    CommonModule,
    ...NZ_COMPONETS,
    EouiModule,
    SharedModule,
    ParamsImportModule,
  ],
  providers: [
    ApiTestUtilService,
    ApiTestService,
    {
      provide: TestServerService,
      useFactory: (electron: ElectronService, locale) => {
        const isVercel = window.location.href.includes('vercel') || window.location.host.includes('eoapi.io');
        if (electron.isElectron) {
          return new TestServerLocalNodeService(electron, locale);
        } else if (!isVercel) {
          return new TestServerRemoteService(locale);
        } else {
          return new TestServerServerlessService(locale);
        }
      },
      deps: [ElectronService, LOCALE_ID],
    },
  ],
})
export class ApiTestModule {}
