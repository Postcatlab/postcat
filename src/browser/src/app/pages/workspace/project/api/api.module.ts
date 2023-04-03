import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgLayoutModule } from 'eo-ng-layout';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzResizableModule, NzResizableService } from 'ng-zorro-antd/resizable';
import { ApiTabService, API_TABS } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { ApiGroupTreeDirective } from 'pc/browser/src/app/pages/workspace/project/api/components/group/api-group-tree.directive';
import { ResponseStepsComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/response-steps/response-steps.component';
import { BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiMockService } from 'pc/browser/src/app/pages/workspace/project/api/http/mock/api-mock.service';
import { ApiCaseService } from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-case.service';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { EoTabModule } from '../../../../components/eo-ui/tab/tab.module';
import { ExtensionSelectModule } from '../../../../components/extension-select/extension-select.module';
import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';
import { ApiGroupTreeComponent } from './components/group/api-group-tree.component';
import { HistoryComponent } from './components/history/eo-history.component';
import { EnvModule } from './env/env.module';
import { ApiTestUtilService } from './service/api-test-util.service';
import { ProjectApiService } from './service/project-api.service';
const COMPONENTS = [ApiComponent, ApiGroupTreeComponent, HistoryComponent];
const tabs = API_TABS.map(val => ({ ...val, pathname: `/home/workspace/project/api${val.pathname}` }));
@NgModule({
  imports: [
    ExtensionSelectModule,
    HttpClientModule,
    FormsModule,
    EnvModule,
    CommonModule,
    ApiRoutingModule,
    SharedModule,
    EoTabModule,
    NzResizableModule,
    NzEmptyModule,
    NzBadgeModule,
    EoNgLayoutModule,
    EoNgTabsModule,
    EoNgTreeModule,
    ResponseStepsComponent
  ],
  declarations: [...COMPONENTS, ApiGroupTreeDirective],
  exports: [ApiComponent],
  providers: [
    {
      provide: BASIC_TABS_INFO,
      useValue: {
        BASIC_TABS: tabs,
        pathByName: tabs.reduce((acc, curr) => ({ ...acc, [curr.uniqueName]: curr.pathname }), {})
      } as TabsConfig
    },
    ApiCaseService,
    ProjectApiService,
    ApiTestUtilService,
    NzResizableService,
    ApiTabService,
    ApiMockService
  ]
})
export class ApiModule {}
