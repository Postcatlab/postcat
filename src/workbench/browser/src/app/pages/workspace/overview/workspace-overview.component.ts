import { Component, OnInit, ViewChild } from '@angular/core';
import { autorun } from 'mobx';

import { SettingService } from '../../../modules/system-setting/settings.service';
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
  constructor(private setting: SettingService, public store: StoreService) {}
  invite() {
    this.nzSelectedIndex = 1;
  }
  ngOnInit(): void {
    autorun(() => {
      this.title = this.store.getCurrentWorkspace?.title;
    });
  }
}
