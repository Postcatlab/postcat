import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiMockComponent } from './api-mock.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EouiModule } from 'eo/workbench/browser/src/app/eoui/eoui.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiMockComponent,
      },
    ]),
    CommonModule,
    SharedModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzModalModule,
    EouiModule,
  ],
  exports: [],
})
export class ApiMockModule {}
