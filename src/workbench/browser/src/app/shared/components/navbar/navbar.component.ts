import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
import { NzNotificationService, NzNotificationRef } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Message, MessageService } from '../../../shared/services/message';
import { Subject, takeUntil } from 'rxjs';
import { NzConfigService } from 'ng-zorro-antd/core/config';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isElectron = false;
  messageId;
  messageTop;
  @ViewChild('notificationTemplate', { static: true })
  notificationTemplate!: TemplateRef<{}>;
  dataSourceType = 'http';
  /** 是否远程数据源 */
  get isRemote() {
    return this.dataSourceType === 'http';
  }
  /** 当前数据源对应的文本 */
  get dataSourceText() {
    return this.isRemote ? '远程' : '本地';
  }
  /** 在线或离线图标 */
  get icon() {
    return `../../../../assets/images/${this.isRemote ? 'online' : 'offline'}.svg`;
  }
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
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private electron: ElectronService,
    private messageService: MessageService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private nzConfigService: NzConfigService
  ) {
    this.isElectron = this.electron.isElectron;
    this.messageTop = this.nzConfigService.getConfig()?.message?.nzTop;
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
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'onDataSourceChange': {
            this.dataSourceType = inArg.data.dataSourceType;
            this.showNotification();
            inArg.data?.callback?.();
            break;
          }
        }
      });
  }

  /**
   * 切换数据源
   */
  switchDataSource(): void {
    this.messageService.send({ type: 'switchDataSource', data: { callback: () => this.showMessage() } });
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
  /**
   * 移除消息通知
   */
  removeNotification() {
    this.nzNotificationRef?.messageId && this.notification.remove(this.nzNotificationRef.messageId);
  }

  showNotification() {
    this.removeNotification();
    if (this.notificationTemplate && !this.isRemote) {
      this.nzConfigService.set('message', { nzTop: 24 * 5 });
      this.nzNotificationRef = this.notification.template(this.notificationTemplate, {
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
  }

  showMessage() {
    this.messageId ?? this.message.remove(this.messageId);

    const message = this.message.create('success', `成功切换到${this.dataSourceText}数据源`);
    this.messageId = message.messageId;
    message.onClose.subscribe(() => {
      // 还原message组件默认设置
      this.nzConfigService.set('message', { nzTop: this.messageTop });
    });
  }
}
