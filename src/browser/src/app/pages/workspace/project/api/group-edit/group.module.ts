import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { GroupComponent } from './group.component';

@NgModule({
  declarations: [GroupComponent],
  imports: [
    RouterModule.forChild([
      {
        path: 'edit',
        component: GroupComponent
      }
    ]),
    SharedModule,
    EoNgTabsModule
  ],
  exports: [GroupComponent]
})
export class GroupModule {}
