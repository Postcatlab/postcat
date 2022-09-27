import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ElectronService } from '../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { MessageService } from '../../shared/services/message';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { ResourceInfo } from '../../shared/models/client.model';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isSettingVisible = false;

  currentWorkspace={
    title: $localize`Local workspace`,
    type:'offline',
    id: -1,
  };
  searchValue: string;
  private workspace = [
    {
      title: 'online workspace 1',
      type:'online',
      id: 1,
    },
    {
      title: 'online workspace 2',
      type:'online',
      id: 2,
    },{
      title: $localize`Local workspace`,
      type:'offline',
      id: -1,
    }
  ];
  @ViewChild('notificationTemplate', { static: true })
  @ViewChildren(NzDropdownMenuComponent)
  dropdownMenuList: QueryList<NzDropdownMenuComponent>;
  notificationTemplate!: TemplateRef<{}>;
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
  resourceInfo = ResourceInfo;
  issueEnvironment;
  constructor(
    public electron: ElectronService,
    private messageService: MessageService,
    private nzConfigService: NzConfigService,
    private remoteService: RemoteService
  ) {
    this.issueEnvironment = this.getEnviroment();
    this.getInstaller();
  }
  private findLinkInSingleAssets(assets, item) {
    let result = '';
    const assetIndex = assets.findIndex(
      (asset) =>
        new RegExp(`${item.suffix}$`, 'g').test(asset.browser_download_url) &&
        (!item.keyword || asset.browser_download_url.includes(item.keyword))
    );
    if (assetIndex === -1) {
      return result;
    }
    result = assets[assetIndex].browser_download_url;
    assets.splice(assetIndex, 1);
    return result;
  }
  changeWorkspace(item){

  }
  searchWorkspace() {
    if (!this.searchValue) {
      return this.workspace;
    }
    const searchText = this.searchValue.toLocaleLowerCase();
    return this.workspace.filter((val) => val.title.toLocaleLowerCase().includes(searchText));
  }
  private findLink(allAssets, item) {
    let result = '';
    allAssets.some((assets) => {
      result = this.findLinkInSingleAssets(assets, item);
      return result;
    });
    return result;
  }
  getInstaller() {
    fetch('https://api.github.com/repos/eolinker/eoapi/releases')
      .then((response) => response.json())
      .then((data) => {
        if (!(data instanceof Array)) {
          return;
        }
        [...this.resourceInfo]
          .sort((a1, a2) => a2.suffix.length - a1.suffix.length)
          .forEach((item) => {
            item.link = this.findLink(
              data.map((val) => val.assets),
              item
            );
          });
      });
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

  handleShowModal() {
    this.isSettingVisible = true;
  }

  getModules(): Array<ModuleInfo> {
    return Array.from(this.modules.values());
  }

  /**
   * 打开系统设置
   */
  openSettingModal() {
    this.messageService.send({ type: 'toggleSettingModalVisible', data: { isShow: true } });
  }
  private getEnviroment(): string {
    let result = '';
    const systemInfo = this.electron.getSystemInfo();
    console.log(systemInfo);
    systemInfo.forEach((val) => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
}
