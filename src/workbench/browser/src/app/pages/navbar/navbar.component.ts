import { Component, OnInit } from '@angular/core';
import { ElectronService, WebService } from '../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { SettingComponent } from '../../shared/components/setting/setting.component';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isSettingVisible = false;

  searchValue: string;

  get dataSourceType() {
    return this.remoteService.dataSourceType;
  }
  /** 是否云端数据源 */
  get isRemote() {
    return this.remoteService.isRemote;
  }
  /** 当前数据源对应的文本 */
  get dataSourceText() {
    return this.remoteService.dataSourceText;
  }
  OS_TYPE = navigator.platform.toLowerCase();
  modules: Map<string, ModuleInfo>;
  resourceInfo = this.web.resourceInfo;
  issueEnvironment;
  constructor(
    public electron: ElectronService,
    private web: WebService,
    private modal: NzModalService,
    private remoteService: RemoteService,
    private message: MessageService,
    public workspaceService: WorkspaceService,
    public userService: UserService
  ) {
    this.issueEnvironment = this.getEnviroment();
  }
  changeWorkspace(item) {
    console.log('item', item);
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
  }
  loginOrSign() {
    this.message.send({ type: 'login', data: {} });
  }
  loginOut() {
    this.message.send({ type: 'logOut', data: {} });
  }
  addWorkspace() {
    this.message.send({ type: 'addWorkspace', data: {} });
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
