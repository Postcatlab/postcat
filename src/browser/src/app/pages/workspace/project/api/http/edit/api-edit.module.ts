import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoNgTreeModule } from 'eo-ng-tree';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { EoNgCollapseModule } from 'pc/browser/src/app/components/eo-ui/collapse/collapse.module';
import { EoMonacoEditorModule } from 'pc/browser/src/app/components/eo-ui/monaco-editor/monaco.module';
import { ApiSharedModule } from 'pc/browser/src/app/pages/workspace/project/api/api-shared.module';
import { ApiEditService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit.service';

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
    ApiSharedModule,
    CommonModule,
    ...NZ_COMPONETS,
    SharedModule
  ],
  providers: [ApiEditUtilService, ApiEditService]
})
export class ApiEditModule {}
