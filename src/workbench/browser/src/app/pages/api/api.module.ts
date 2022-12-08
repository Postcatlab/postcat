import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { ApiTabService } from 'eo/workbench/browser/src/app/pages/api/api-tab.service';
import { ApiGroupTreeDirective } from 'eo/workbench/browser/src/app/pages/api/group/tree/api-group-tree.directive';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzResizableModule, NzResizableService } from 'ng-zorro-antd/resizable';

import { ElectronService } from '../../core/services';
import { EnvModule } from '../../modules/env/env.module';
import { ApiRoutingModule } from './api-routing.module';

import { ApiComponent } from './api.component';
import { ApiGroupEditComponent } from './group/edit/api-group-edit.component';

import { ApiGroupTreeComponent } from './group/tree/api-group-tree.component';
import { HistoryComponent } from './history/eo-history.component';




import { EoTabModule } from '../../modules/eo-ui/tab/tab.module';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

const COMPONENTS = [ApiComponent, ApiGroupEditComponent, ApiGroupTreeComponent, HistoryComponent];
@NgModule({
  imports: [
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
    EoNgTreeModule,
  ],
  declarations: [...COMPONENTS, ApiGroupTreeDirective],
  exports: [ApiComponent],
  providers: [ElectronService, NzResizableService, ApiTabService, IndexedDBStorage],
})
export class ApiModule {}
