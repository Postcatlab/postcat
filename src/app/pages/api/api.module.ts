import { NgModule } from '@angular/core';
import { Ng1Module } from '../../ng1/ng1.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiRoutingModule } from './api-routing.module';
import { ApiEditModule } from './edit/api-edit.module';
import { ApiDetailModule } from './detail/api-detail.module';
import { ApiTestModule } from './test/api-test.module';
import { EnvModule } from '../env/env.module';
import { EouiModule } from '../../eoui/eoui.module';
import { ParamsImportModule } from '../../shared/components/params-import/params-import.module';

import { ApiComponent } from './api.component';
import { ApiGroupEditComponent } from './group/edit/api-group-edit.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { ApiDataService } from '../../shared/services/api-data/api-data.service';
import { GroupService } from '../../shared/services/group/group.service';
import { ApiTabService } from './tab/api-tab.service';
import { MessageService } from '../../shared/services/message';
import { ApiGroupTreeComponent } from './group/tree/api-group-tree.component';
import { ApiTabComponent } from './tab/api-tab.component';
import { ApiService } from './api.service';

const COMPONENTS = [ApiComponent, ApiGroupEditComponent, ApiGroupTreeComponent];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ApiRoutingModule,
    ApiEditModule,
    ApiDetailModule,
    ApiTestModule,
    Ng1Module,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzLayoutModule,
    NzTreeModule,
    NzFormModule,
    NzInputModule,
    NzDropDownModule,
    ParamsImportModule,
    EouiModule,
    EnvModule,
  ],
  declarations: [...COMPONENTS, ApiTabComponent],
  exports: [],
  providers: [ApiDataService, GroupService, MessageService, ApiTabService,ApiService],
})
export class ApiModule {}
