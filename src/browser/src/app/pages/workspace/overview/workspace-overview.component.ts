import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun, reaction } from 'mobx';
import { MessageService } from 'pc/browser/src/app/services/message';
import { waitNextTick } from 'pc/browser/src/app/shared/utils/index.utils';

import { FeatureControlService } from '../../../core/services/feature-control/feature-control.service';
import { StoreService } from '../../../store/state.service';
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
    private message: EoNgFeedbackMessageService,
    public feature: FeatureControlService,
    private postMessage: MessageService
  ) {}
  async invite() {
    if (this.nzSelectedIndex !== 1) {
      this.router.navigate(['/home/workspace/overview/member']);
    }
    if (this.store.isLocal) {
      this.message.info($localize`You should switch to cloud workspace and invite members.`);
      return;
    }
    await waitNextTick();
    this.postMessage.send({ type: 'addWorkspaceMember', data: {} });
  }
  ngOnInit(): void {
    reaction(
      () => this.store.getWorkspaceRole,
      value => {
        this.isOwner = value?.some(it => ['Workspace Owner'].includes(it.name));
      }
    );
    autorun(async () => {
      if (!this.store.getCurrentWorkspace) return;
      this.title = this.store.getCurrentWorkspace.title;
    });
  }
}
