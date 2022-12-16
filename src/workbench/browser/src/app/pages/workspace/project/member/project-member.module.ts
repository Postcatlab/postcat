import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { ManageAccessComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/member/manage-access/manage-access.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';

import { ProjectMemberRoutingModule } from './project-member-routing.module';
import { ProjectMemberComponent } from './project-member.component';

@NgModule({
  imports: [ProjectMemberRoutingModule, CommonModule, NzAvatarModule, NzModalModule, FormsModule, EoNgButtonModule, SharedModule],
  declarations: [ProjectMemberComponent, ManageAccessComponent],
  exports: [],
  providers: [NzModalService]
})
export class ProjectMemberModule {}
