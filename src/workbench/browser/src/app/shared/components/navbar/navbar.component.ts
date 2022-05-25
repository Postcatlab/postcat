import { Component, OnInit, TemplateRef } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { MessageService } from '../../services/message';
import { NzNotificationService, NzNotificationRef } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isElectron: boolean = false;
  /** 是否远程数据源 */
  isRemote: boolean = false;
  nzNotificationRef: NzNotificationRef;
  OS_TYPE = navigator.platform.toLowerCase();
  modules: Map<string, ModuleInfo>;
  resourceInfo = [
    {
      id: 'win',
      name: 'Windows 客户端',
      icon: 'windows',
      keyword: 'Setup',
      suffix: 'exe',
      link: '',
    },
    {
      id: 'mac',
      name: 'macOS(Intel) 客户端',
      icon: 'mac',
      suffix: 'dmg',
      link: '',
    },
    {
      id: 'mac',
      name: 'macOS(M1) 客户端',
      icon: 'mac',
      suffix: 'arm64.dmg',
      link: '',
    },
  ];

  constructor(
    private electron: ElectronService,
    private messageService: MessageService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {
    this.isElectron = this.electron.isElectron;
    this.getInstaller();
  }
  private findLinkInSingleAssets(assets, item) {
    let result = '';
    let assetIndex = assets.findIndex(
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
    if (this.isElectron) {
      this.modules = window.eo.getAppModuleList();
    } else {
      this.modules = new Map();
    }
  }

  getModules(): Array<ModuleInfo> {
    return Array.from(this.modules.values());
  }

  /**
   * 打开系统设置
   */
  openSettingModal() {
    console.log('this.messageService', this.messageService);
    this.messageService.send({ type: 'toggleSettingModalVisible', data: { isShow: true } });
  }
  /**
   * 移除消息通知
   */
  removeNotification() {
    this.nzNotificationRef?.messageId && this.notification.remove(this.nzNotificationRef.messageId);
  }

  /**
   * 切换到单机
   */
  switchToStandAlone(template: TemplateRef<{}>): void {
    this.isRemote = false;
    this.removeNotification();
    this.nzNotificationRef = this.notification.template(template, {
      nzStyle: {
        position: 'fixed',
        right: 0,
        left: 0,
        top: '50px',
        minWidth: '100vw',
        height: '50px',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255, 219, 7)',
      },
      nzDuration: 0,
    });
  }

  /**
   * 切换到远程
   */
  switchToRemote() {
    this.isRemote = true;
    this.removeNotification();
    this.message.create('success', '成功切换至远程数据源');
  }
}
