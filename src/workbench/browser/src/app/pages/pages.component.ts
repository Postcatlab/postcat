import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'eo/workbench/browser/src/app/shared/components/sidebar/sidebar.service';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { IS_SHOW_REMOTE_SERVER_NOTIFICATION } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  get isRemote() {
    return this.dataSource.isRemote;
  }
  isShow = localStorage.getItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION) === 'true';
  get isShowNotification() {
    return !this.isRemote && this.isShow;
  }

  constructor(
    public sidebar: SidebarService,
    public eMessage: EoMessageService,
    private workspace: WorkspaceService,
    public dataSource: DataSourceService,
    public electron: ElectronService
  ) {}
  ngOnInit(): void {}

  switchToTheCloud = () => {
    if (!this.workspace.workspaceList.length) {
      this.eMessage.error($localize`You don't have cloud space yet, please create one`);
      return;
    }
    this.workspace.setCurrentWorkspace(this.workspace.workspaceList[0]);
  };

  closeNotification() {
    this.isShow = false;
    localStorage.setItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false');
  }
}
