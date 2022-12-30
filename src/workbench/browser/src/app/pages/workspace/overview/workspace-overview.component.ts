import { Component, OnInit, ViewChild } from '@angular/core';
import { autorun } from 'mobx';

import { SettingService } from '../../../modules/system-setting/settings.service';
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
  constructor(private dataSourceService: DataSourceService, private message: MessageService, public store: StoreService) {}
  invite() {
    this.nzSelectedIndex = 1;
  }
  ngOnInit(): void {
    autorun(() => {
      this.title = this.store.getCurrentWorkspace?.title;
    });
  }
  createWorkspace() {
    this.dataSourceService.checkRemoteCanOperate(() => {
      this.message.send({ type: 'addWorkspace', data: {} });
    });
  }
}
