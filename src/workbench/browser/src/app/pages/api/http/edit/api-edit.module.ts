import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng1Module } from '../../../../ng1/ng1.module';
import { EouiModule } from '../../../../modules/eo-ui/eoui.module';
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
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { ApiEditComponent } from './api-edit.component';
import { ApiEditHeaderComponent } from './header/api-edit-header.component';
import { ApiEditBodyComponent } from './body/api-edit-body.component';
import { ApiEditQueryComponent } from './query/api-edit-query.component';
import { ApiEditRestComponent } from './rest/api-edit-rest.component';
import { ApiParamsExtraSettingComponent } from './extra-setting/api-params-extra-setting.component';

import { ApiEditUtilService } from './api-edit-util.service';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/api/http/edit/api-edit.service';
import { RouterModule } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { ApiSharedModule } from '../../../../modules/api-shared/api-shared.module';

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
  NzAffixModule,
  NzPopconfirmModule,
  NzBadgeModule,
];
const COMPONENTS = [
  ApiEditComponent,
  ApiEditHeaderComponent,
  ApiEditBodyComponent,
  ApiEditQueryComponent,
  ApiEditRestComponent,
  ApiParamsExtraSettingComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiEditComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    Ng1Module,
    CommonModule,
    ...NZ_COMPONETS,
    EouiModule,
    ApiSharedModule,
    SharedModule,
  ],
  providers: [ApiEditUtilService, ApiEditService],
})
export class ApiEditModule {}
