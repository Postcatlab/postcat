import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { ManageAccessComponent } from 'eo/workbench/browser/src/app/shared/components/manage-access/manage-access.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';

@NgModule({
  imports: [MemberRoutingModule, CommonModule, NzModalModule, NzInputModule, FormsModule, EoNgButtonModule, SharedModule],
  declarations: [MemberComponent, ManageAccessComponent],
  exports: [],
  providers: [NzModalService, MessageService],
})
export class MemberModule {}
