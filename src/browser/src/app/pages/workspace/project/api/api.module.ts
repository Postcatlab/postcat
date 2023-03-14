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
import { ApiTabService } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { ApiGroupTreeDirective } from 'pc/browser/src/app/pages/workspace/project/api/components/group/tree/api-group-tree.directive';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { EoTabModule } from '../../../../components/eo-ui/tab/tab.module';
import { ExtensionSelectModule } from '../../../../components/extension-select/extension-select.module';
import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';
import { ProjectApiService } from './api.service';
import { ApiGroupEditComponent } from './components/group/edit/api-group-edit.component';
import { ApiGroupTreeComponent } from './components/group/tree/api-group-tree.component';
import { HistoryComponent } from './components/history/eo-history.component';
import { EnvModule } from './env/env.module';
import { ApiTestUtilService } from './service/api-test-util.service';

const COMPONENTS = [ApiComponent, ApiGroupEditComponent, ApiGroupTreeComponent, HistoryComponent];
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
    EoNgTreeModule
  ],
  declarations: [...COMPONENTS, ApiGroupTreeDirective],
  exports: [ApiComponent],
  providers: [ProjectApiService, ApiTestUtilService, NzResizableService, ApiTabService]
})
export class ApiModule {}
