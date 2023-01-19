import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';

import { MemberListModule } from '../../../../modules/member-list/member-list.module';
import { MemberService } from '../../../../modules/member-list/member.service';
import { ProjectMemberRoutingModule } from './project-member-routing.module';
import { ProjectMemberComponent } from './project-member.component';
import { ProjectMemberService } from './project-member.service';

@NgModule({
  imports: [
    ProjectMemberRoutingModule,
    MemberListModule,
    CommonModule,
    NzAvatarModule,
    NzModalModule,
    FormsModule,
    EoNgButtonModule,
    SharedModule
  ],
  declarations: [ProjectMemberComponent],
  exports: [],
  providers: [
    NzModalService,
    {
      provide: MemberService,
      useClass: ProjectMemberService
    }
  ]
})
export class ProjectMemberModule {}
