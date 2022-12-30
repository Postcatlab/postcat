import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EoNgButtonModule } from 'eo-ng-button';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { ApiSharedModule } from '../../../../../../modules/api-shared/api-shared.module';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ApiDetailComponent } from './api-detail.component';
import { ApiDetailBodyComponent } from './body/api-detail-body.component';
import { PcApiMethodsTagComponent } from './eo-api-methods-tag/eo-api-methods-tag.component';
import { ApiDetailFormComponent } from './form/api-detail-form.component';

const NZ_COMPONETS = [EoNgButtonModule, NzTagModule, NzModalModule, NzFormModule, NzToolTipModule, NzCollapseModule];
const COMPONENTS = [ApiDetailComponent, ApiDetailFormComponent, ApiDetailBodyComponent, PcApiMethodsTagComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiDetailComponent
      }
    ]),
    FormsModule,
    ApiSharedModule,
    ReactiveFormsModule,
    EoMonacoEditorModule,
    CommonModule,
    ...NZ_COMPONETS,
    SharedModule
  ],
  exports: [...COMPONENTS]
})
export class ApiDetailModule {}
