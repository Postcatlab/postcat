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
import { ApiDetailHeaderComponent } from './header/api-detail-header.component';
import { ApiDetailBodyComponent } from './body/api-detail-body.component';
import { ApiDetailQueryComponent } from './query/api-detail-query.component';
import { ApiDetailRestComponent } from './rest/api-detail-rest.component';

import { ApiDetailUtilService } from './api-detail-util.service';
import { RouterModule } from '@angular/router';
import { ApiMockComponent } from 'eo/workbench/browser/src/app/pages/api/http/mock/api-mock.component';
import { ApiSharedModule } from '../../../../modules/api-shared/api-shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

const NZ_COMPONETS = [EoNgButtonModule, NzTagModule, NzModalModule, NzFormModule, NzToolTipModule,NzCollapseModule];
const COMPONENTS = [
  ApiDetailComponent,
  ApiDetailHeaderComponent,
  ApiDetailBodyComponent,
  ApiDetailQueryComponent,
  ApiDetailRestComponent,
  ApiMockComponent,
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
    CommonModule,
    ...NZ_COMPONETS,
    SharedModule,
  ],
  providers: [ApiDetailUtilService],
  exports: [...COMPONENTS],
})
export class ApiDetailModule {}
