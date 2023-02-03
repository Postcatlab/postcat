import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgTreeModule } from 'eo-ng-tree';
import { EoNgCollapseModule } from 'eo/workbench/browser/src/app/modules/eo-ui/collapse/collapse.module';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

import { ApiSharedModule } from '../../../../../../modules/api-shared/api-shared.module';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ApiEditUtilService } from './api-edit-util.service';
import { ApiEditComponent } from './api-edit.component';
import { ApiEditBodyComponent } from './body/api-edit-body.component';
import { ApiParamsExtraSettingComponent } from './extra-setting/api-params-extra-setting.component';
import { ApiEditFormComponent } from './form/api-edit-form.component';

const NZ_COMPONETS = [EoNgButtonModule, NzBadgeModule, EoNgCollapseModule, EoNgTreeModule];
const COMPONENTS = [ApiEditComponent, ApiEditFormComponent, ApiEditBodyComponent, ApiParamsExtraSettingComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiEditComponent
      }
    ]),
    EoMonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ...NZ_COMPONETS,
    ApiSharedModule,
    SharedModule
  ],
  providers: [ApiEditUtilService, ApiEditService]
})
export class ApiEditModule {}
