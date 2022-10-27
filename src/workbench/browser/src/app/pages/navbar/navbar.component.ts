import { Component, OnInit } from '@angular/core';
import { ElectronService, WebService } from '../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SettingComponent } from '../../shared/components/setting/setting.component';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { WorkspaceService } from 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service';
import { UserService } from 'eo/workbench/browser/src/app/shared/services/user/user.service';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { distinct } from 'rxjs/operators';
import { interval } from 'rxjs';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
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
  shareLink = '';
  constructor(
    public electron: ElectronService,
    private web: WebService,
    private modal: NzModalService,
    private message: MessageService,
    public workspaceService: WorkspaceService,
    public userService: UserService,
    public dataSourceService: DataSourceService,
    public status: StatusService,
    private http: RemoteService,
    private eoMessage: EoMessageService
  ) {
    this.issueEnvironment = this.getEnviroment();
    if (this.workspaceService.currentWorkspace?.id !== -1) {
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
  handleCopy() {
    const isOk = copy(this.shareLink);
    // TODO
    if (isOk) {
      this.eoMessage.success('Copied');
    }
  }
  async ngOnInit(): Promise<void> {
    if (this.electron.isElectron) {
      this.modules = window.eo.getAppModuleList();
    } else {
      this.modules = new Map();
    }
    this.shareLink = await this.getShareLink();
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type }) => {
        if (type === 'open-setting') {
          this.openSettingModal();
          return;
        }
        if (type === 'update-share-link') {
          // * request share link
          this.shareLink = await this.getShareLink();
        }
      });
  }
  async getShareLink() {
    if (this.workspaceService.isLocal) {
      return '';
    }
    if (!this.userService.isLogin) {
      return '';
    }
    if (this.status.isShare) {
      return '';
    }
    const [res, err]: any = await this.http.api_shareCreateShare({});
    if (err) {
      return '';
    }
    return `${this.dataSourceService.remoteServerUrl}/home/share/http/test?shareId=${res.uniqueID}`;
  }
  loginOrSign() {
    if (this.web.isWeb) {
      return this.web.jumpToClient($localize`Eoapi Client is required to sign in`);
    }
    this.dataSourceService.checkRemoteCanOperate();
  }
  loginOut() {
    this.message.send({ type: 'logOut', data: {} });
  }
  async addWorkspace() {
    if (this.web.isWeb) {
      return this.web.jumpToClient($localize`Eoapi Client is required to add workspace`);
      // 1. 如果配置了远程地址
    } else {
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
    const ref = this.modal.create({
      nzClassName: 'eo-setting-modal',
      nzContent: SettingComponent,
      nzFooter: null,
    });
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(({ type }) => {
        if (type === 'close-setting') {
          ref.close();
        }
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
