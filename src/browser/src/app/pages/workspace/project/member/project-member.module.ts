import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EoNgButtonModule } from 'eo-ng-button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { SharedModule } from 'pc/browser/src/app/shared/shared.module';

import { MemberListModule } from '../../../../components/member-list/member-list.module';
import { MemberService } from '../../../../components/member-list/member.service';
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
