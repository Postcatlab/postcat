import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoNgTreeModule } from 'eo-ng-tree';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { EoTableProModule } from '../../../../../components/eo-ui/table-pro/table-pro.module';
import { EnvEditComponent } from './env-edit/env-edit.component';
import { EnvListComponent } from './env-list/env-list.component';
import { EnvSelectComponent } from './env-select/env-select.component';

const ANTDMODULES = [EoTableProModule];
const COMPONENTA = [EnvListComponent, EnvSelectComponent];
@NgModule({
  declarations: [...COMPONENTA, EnvEditComponent],
  imports: [
    RouterModule.forChild([
      {
        path: 'edit',
        component: EnvEditComponent
      }
    ]),
    NzTypographyModule,
    EoNgTreeModule,
    NzEmptyModule,
    SharedModule,
    ...ANTDMODULES
  ],
  exports: [...COMPONENTA]
})
export class EnvModule {}
