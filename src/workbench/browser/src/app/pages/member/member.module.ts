import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { ManageAccessComponent } from 'eo/workbench/browser/src/app/pages/member/manage-access/manage-access.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';

import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';

@NgModule({
  imports: [
    MemberRoutingModule,
    CommonModule,
    NzAvatarModule,
    NzModalModule,
    FormsModule,
    EoNgButtonModule,
    SharedModule,
  ],
  declarations: [MemberComponent, ManageAccessComponent],
  exports: [],
  providers: [NzModalService],
})
export class MemberModule {}
