import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { waitNextTick } from 'eo/workbench/browser/src/app/utils/index.utils';
import { autorun, reaction } from 'mobx';

import { FeatureControlService } from '../../../core/services/feature-control/feature-control.service';
import { StoreService } from '../../../shared/store/state.service';
import { ProjectListService } from './project-list/project-list.service';

@Component({
  selector: 'eo-workspace-overview',
  templateUrl: './workspace-overview.component.html',
  styleUrls: ['./workspace-overview.component.scss']
})
export class WorkspaceOverviewComponent implements OnInit {
  title = 'Workspaces';
  nzSelectedIndex = 0;
  isOwner = true;
  constructor(
    public projectList: ProjectListService,
    public store: StoreService,
    private router: Router,
    public feature: FeatureControlService,
    private message: MessageService
  ) {}
  async invite() {
    if (this.nzSelectedIndex !== 1) {
      this.router.navigate(['/home/workspace/overview/member']);
    }
    await waitNextTick();
    this.message.send({ type: 'addWorkspaceMember', data: {} });
  }
  ngOnInit(): void {
    autorun(async () => {
      await waitNextTick();
      this.title = this.store.getCurrentWorkspace?.title;
      this.isOwner = this.store?.getWorkspaceRole?.some(it => ['Workspace Owner'].includes(it.name));
    });
  }
}
