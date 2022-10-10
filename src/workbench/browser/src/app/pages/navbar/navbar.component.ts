import { Component, OnInit } from '@angular/core';
import { ElectronService, WebService } from '../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SettingComponent } from '../../shared/components/setting/setting.component';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isSettingVisible = false;

  searchValue: string;
  OS_TYPE = navigator.platform.toLowerCase();
  modules: Map<string, ModuleInfo>;
  resourceInfo = this.web.resourceInfo;
  issueEnvironment;
  constructor(
    public electron: ElectronService,
    private web: WebService,
    private modal: NzModalService,
    private message: MessageService,
    public workspaceService: WorkspaceService,
    public userService: UserService,
    public dataSourceService: DataSourceService
  ) {
    this.issueEnvironment = this.getEnviroment();
    if (this.workspaceService.currentWorkspace?.id) {
      this.workspaceService.getWorkspaceInfo(this.workspaceService.currentWorkspace.id);
    }
  }
  changeWorkspace(item) {
    this.workspaceService.setCurrentWorkspace(item);
  }
  get searchWorkspace() {
    if (!this.searchValue) {
      return this.workspaceService.workspaceList;
    }
    const searchText = this.searchValue.toLocaleLowerCase();
    return this.workspaceService.workspaceList.filter((val) => val.title.toLocaleLowerCase().includes(searchText));
  }
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize',
    });
  }
  toggleMaximize() {
    this.electron.ipcRenderer.send('message', {
      action: this.isMaximized ? 'restore' : 'maximize',
    });
    this.isMaximized = !this.isMaximized;
  }
  close() {
    this.electron.ipcRenderer.send('message', {
      action: 'close',
    });
  }
  ngOnInit(): void {
    if (this.electron.isElectron) {
      this.modules = window.eo.getAppModuleList();
    } else {
      this.modules = new Map();
    }
    this.message.get().subscribe(({ type }) => {
      if (type === 'open-setting') {
        this.openSettingModal();
      }
    });
  }
  loginOrSign() {
    if (this.web.isWeb) {
      return this.web.jumpToClient($localize`Eoapi Client is required to sign in`);
    }
    this.message.send({ type: 'login', data: {} });
  }
  loginOut() {
    this.message.send({ type: 'logOut', data: {} });
  }
  async addWorkspace() {
    if (this.web.isWeb) {
      return this.web.jumpToClient($localize`Eoapi Client is required to add workspace`);
      // 1. 如果配置了远程地址
    } else {
      console.log('je');
      this.dataSourceService.checkRemoteCanOperate(() => {
        this.message.send({ type: 'addWorkspace', data: {} });
      });
    }
  }

  getModules(): Array<ModuleInfo> {
    return Array.from(this.modules.values());
  }

  /**
   * 打开系统设置
   */
  openSettingModal() {
    this.modal.create({
      nzClassName: 'eo-setting-modal',
      nzContent: SettingComponent,
      nzFooter: null,
    });
  }
  private getEnviroment(): string {
    let result = '';
    const systemInfo = this.electron.getSystemInfo();
    systemInfo.forEach((val) => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
}
