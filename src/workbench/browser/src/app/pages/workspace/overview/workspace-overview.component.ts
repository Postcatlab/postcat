import { Component, OnInit } from '@angular/core';

import { SettingService } from '../../../modules/system-setting/settings.service';
import { StoreService } from '../../../shared/store/state.service';

@Component({
  selector: 'eo-workspace-overview',
  templateUrl: './workspace-overview.component.html',
  styleUrls: ['./workspace-overview.component.scss']
})
export class WorkspaceOverviewComponent implements OnInit {
  title = 'Workspaces';
  listType = this.setting.get('workbench.list.type') || 'list';
  constructor(private setting: SettingService, private store: StoreService) {}

  ngOnInit(): void {
    this.title = this.store.getCurrentWorkspace?.title;
  }
  setListType(type) {}
  createProject() {}
}
