import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { ApiTabService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api-tab.service';
import { ApiGroupTreeDirective } from 'eo/workbench/browser/src/app/pages/workspace/project/api/components/group/tree/api-group-tree.directive';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzResizableModule, NzResizableService } from 'ng-zorro-antd/resizable';

import { ElectronService } from '../../../../core/services';
import { EoTabModule } from '../../../../modules/eo-ui/tab/tab.module';
import { ExtensionSelectModule } from '../../../../modules/extension-select/extension-select.module';
import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';
import { EnvModule } from './components/env/env.module';
import { ApiGroupEditComponent } from './components/group/edit/api-group-edit.component';
import { ApiGroupTreeComponent } from './components/group/tree/api-group-tree.component';
import { HistoryComponent } from './components/history/eo-history.component';

const COMPONENTS = [ApiComponent, ApiGroupEditComponent, ApiGroupTreeComponent, HistoryComponent];
@NgModule({
  imports: [
    ExtensionSelectModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ApiRoutingModule,
    EnvModule,
    SharedModule,
    EoTabModule,
    NzResizableModule,
    NzEmptyModule,
    NzBadgeModule,
    NzLayoutModule,
    EoNgTabsModule,
    EoNgTreeModule
  ],
  declarations: [...COMPONENTS, ApiGroupTreeDirective],
  exports: [ApiComponent],
  providers: [ElectronService, NzResizableService, ApiTabService, IndexedDBStorage]
})
export class ApiModule {}
