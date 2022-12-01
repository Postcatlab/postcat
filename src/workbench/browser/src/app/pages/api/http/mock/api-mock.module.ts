import { NgModule } from '@angular/core';
import { ApiMockComponent } from './api-mock.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterModule } from '@angular/router';
import { EoTableProModule } from 'eo/workbench/browser/src/app/modules/eo-ui/table-pro/table-pro.module';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApiMockComponent,
      },
    ]),
    FormsModule,
    EoTableProModule,
    SharedModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzModalModule
  ],
  exports: [],
})
export class ApiMockModule {}
