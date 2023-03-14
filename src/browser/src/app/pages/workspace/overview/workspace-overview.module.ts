import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoNgTabsModule } from 'eo-ng-tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { MemberListModule } from '../../../components/member-list/member-list.module';
import { MemberService } from '../../../components/member-list/member.service';
import { SharedModule } from '../../../shared/shared.module';
import { WorkspaceSettingComponent } from './edit/workspace-edit.component';
import { WorkspaceMemberComponent } from './member/workspace-member.component';
import { WorkspaceMemberService } from './member/workspace-member.service';
import { ProjectListModule } from './project-list/project-list.module';
import { ProjectListService } from './project-list/project-list.service';
import { WorkspaceOverviewComponent } from './workspace-overview.component';

@NgModule({
  declarations: [WorkspaceOverviewComponent, WorkspaceMemberComponent, WorkspaceSettingComponent],
  imports: [
    CommonModule,
    MemberListModule,
    SharedModule,
    EoNgTabsModule,
    NzSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkspaceOverviewComponent,
        children: [
          {
            path: '',
            redirectTo: 'projects',
            pathMatch: 'full'
          },
          {
            path: 'projects',
            loadChildren: () => import('./project-list/project-list.module').then(m => m.ProjectListModule)
          },
          {
            path: 'member',
            component: WorkspaceMemberComponent
          },
          {
            path: 'setting',
            component: WorkspaceSettingComponent
          }
        ]
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
