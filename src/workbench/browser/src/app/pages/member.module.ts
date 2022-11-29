import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { ManageAccessComponent } from 'eo/workbench/browser/src/app/pages/member/manage-access/manage-access.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@NgModule({
  imports: [MemberRoutingModule, CommonModule, NzAvatarModule,NzModalModule, NzInputModule, FormsModule, EoNgButtonModule, SharedModule],
  declarations: [MemberComponent, ManageAccessComponent],
  exports: [],
  providers: [NzModalService],
})
export class MemberModule {}
