import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoNgTabsModule } from 'eo-ng-tabs';

import { MemberListModule } from '../../../modules/member-list/member-list.module';
import { MemberService } from '../../../modules/member-list/member.service';
import { SharedModule } from '../../../shared/shared.module';
import { WorkspaceSettingComponent } from '../components/edit/workspace-edit.component';
import { WorkspaceMemberComponent } from '../components/member/workspace-member.component';
import { WorkspaceMemberService } from '../components/member/workspace-member.service';
import { ProjectListModule } from '../components/project-list/project-list.module';
import { WorkspaceOverviewComponent } from './workspace-overview.component';

@NgModule({
  declarations: [WorkspaceOverviewComponent, WorkspaceMemberComponent, WorkspaceSettingComponent],
  imports: [
    CommonModule,
    ProjectListModule,
    MemberListModule,
    SharedModule,
    EoNgTabsModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkspaceOverviewComponent
      }
    ])
  ],
  providers: [
    {
      provide: MemberService,
      useClass: WorkspaceMemberService
    }
  ]
})
export class WorkspaceOverviewModule {}
