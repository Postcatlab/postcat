import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../../../shared/shared.module';

import { EoNgButtonModule } from 'eo-ng-button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { ApiDetailComponent } from './api-detail.component';
import { ApiDetailFormComponent } from './form/api-detail-form.component';
import { ApiDetailBodyComponent } from './body/api-detail-body.component';

import { RouterModule } from '@angular/router';
import { ApiSharedModule } from '../../../../modules/api-shared/api-shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { EoMonacoEditorModule } from 'eo/workbench/browser/src/app/modules/eo-ui/monaco-editor/monaco.module';
import { EoApiMethodsTagComponent } from './eo-api-methods-tag/eo-api-methods-tag.component';

const NZ_COMPONETS = [EoNgButtonModule, NzTagModule, NzModalModule, NzFormModule, NzToolTipModule,NzCollapseModule];
const COMPONENTS = [
  ApiDetailComponent,
  ApiDetailFormComponent,
  ApiDetailBodyComponent,
  EoApiMethodsTagComponent
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiDetailComponent,
      },
    ]),
    FormsModule,
    ApiSharedModule,
    ReactiveFormsModule,
    EoMonacoEditorModule,
    CommonModule,
    ...NZ_COMPONETS,
    SharedModule,
  ],
  exports: [...COMPONENTS],
})
export class ApiDetailModule {}
