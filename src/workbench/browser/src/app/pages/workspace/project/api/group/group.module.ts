import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { EoNgTreeModule } from 'eo-ng-tree';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { EoTableProModule } from '../../../../../modules/eo-ui/table-pro/table-pro.module';
import { GroupComponent } from './group.component';

const ANTDMODULES = [EoTableProModule];
@NgModule({
  declarations: [GroupComponent],
  imports: [
    RouterModule.forChild([
      {
        path: 'edit',
        component: GroupComponent
      }
    ]),
    EoNgTreeModule,
    NzEmptyModule,
    SharedModule,
    EoNgTabsModule,
    ...ANTDMODULES
  ],
  exports: [GroupComponent]
})
export class EnvModule {}
