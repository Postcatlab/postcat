import { Component, OnInit, ViewChild } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';

import { FeatureControlService } from '../../../core/services/feature-control/feature-control.service';
import { DataSourceService } from '../../../shared/services/data-source/data-source.service';
import { MessageService } from '../../../shared/services/message';
import { StoreService } from '../../../shared/store/state.service';
import { ProjectListComponent } from '../components/project-list/project-list.component';

@Component({
  selector: 'eo-workspace-overview',
  templateUrl: './workspace-overview.component.html',
  styleUrls: ['./workspace-overview.component.scss']
})
export class WorkspaceOverviewComponent implements OnInit {
  @ViewChild('eoProjectList') eoProjectList: ProjectListComponent;
  title = 'Workspaces';
  nzSelectedIndex = 0;
  isOwner = false;
  constructor(
    private dataSourceService: DataSourceService,
    private nzMessage: EoNgFeedbackMessageService,
    private message: MessageService,
    public store: StoreService,
    public feature: FeatureControlService
  ) {}
  invite() {
    if (this.nzSelectedIndex) {
      this.nzMessage.warning($localize`You has already selected members tab,you can operate now.`);
    }
    this.nzSelectedIndex = 1;
  }
  ngOnInit(): void {
    autorun(() => {
      this.title = this.store.getCurrentWorkspace?.title;
      console.log('this.store.getWorkspaceRole', this.store.getWorkspaceRole);
      // this.isOwner = this.store.getWorkspaceRole?.find(it => it.name === 'Workspace Owner');
    });
  }
  createWorkspace() {
    this.dataSourceService.checkRemoteCanOperate(() => {
      this.message.send({ type: 'addWorkspace', data: {} });
    });
  }
}
