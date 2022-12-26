import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoNgTabsModule } from 'eo-ng-tabs';

import { SharedModule } from '../../../shared/shared.module';
import { WorkspaceDeleteComponent } from '../components/delete/workspace-delete.component';
import { WorkspaceEditComponent } from '../components/edit/workspace-edit.component';
import { WorkspaceMemberComponent } from '../components/member/workspace-member.component';
import { ProjectListModule } from '../components/project-list/project-list.module';
import { WorkspaceOverviewComponent } from './workspace-overview.component';

@NgModule({
  declarations: [WorkspaceOverviewComponent, WorkspaceMemberComponent, WorkspaceEditComponent, WorkspaceDeleteComponent],
  imports: [
    CommonModule,
    ProjectListModule,
    SharedModule,
    EoNgTabsModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkspaceOverviewComponent
      }
    ])
  ]
})
export class WorkspaceOverviewModule {}
