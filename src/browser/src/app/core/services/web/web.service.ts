import { Injectable } from '@angular/core';
import { getSettings, SettingService } from 'pc/browser/src/app/components/system-setting/settings.service';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { DownloadClientModalComponent } from 'pc/browser/src/app/shared/components/download-client.component';
import { PROTOCOL } from 'pc/browser/src/app/shared/models/protocol.constant';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import packageJson from '../../../../../../../package.json';
import { getBrowserType } from '../../../shared/utils/browser-type';
import StorageUtil from '../../../shared/utils/storage/storage.utils';
import { StoreService } from '../../../store/state.service';

type DescriptionsItem = {
  readonly id: string;
  readonly label: string;
  value: string;
};
@Injectable({
  providedIn: 'root'
})
export class WebService {
  isWeb: boolean;
  isVercel = window.location.href.includes('vercel');
  isClientInstalled: boolean;
  resourceInfo = [
    {
      id: 'win',
      name: $localize`Windows Client`,
      icon: 'windows',
      keyword: 'Setup',
      suffix: 'exe',
      link: 'https://data.postcat.com/download/latest/Postcat-Setup-latest.exe'
    },
    {
      id: 'mac-intel',
      name: $localize`MacOS(Intel) Client`,
      icon: 'mac',
      suffix: 'dmg',
      link: 'https://data.postcat.com/download/latest/Postcat-latest.dmg'
    },
    {
      id: 'mac-m1',
      name: $localize`MacOS(Apple) Client`,
      icon: 'mac',
      suffix: 'arm64.dmg',
      link: 'https://data.postcat.com/download/latest/Postcat-latest-arm64.dmg'
    }
  ];
  githubBugUrl: string;
  constructor(
    private modalService: ModalService,
    private settingService: SettingService,
    private electronService: ElectronService,
    private store: StoreService
  ) {
    this.isWeb = !this.electronService.isElectron;
    this.githubBugUrl = this.getGithubUrl();
    if (this.isWeb) {
      this.settingService.putSettings({ 'backend.url': window.location.origin });
    } else {
      this.settingService.putSettings({ 'backend.url': APP_CONFIG.serverUrl });
    }
    this.getClientResource();
  }
  getGithubUrl(opts = {}) {
    const href = `${APP_CONFIG.GITHUB_REPO_URL}/issues/new`;
    const query = {
      assignees: '',
      labels: '',
      template: 'bug_report.yml',
      environment: this.getEnvironment(),
      ...opts
    };
    return `${href}?${Object.keys(query)
      .map(key => `${key}=${query[key]}`)
      .join('&')}`;
  }
  private getEnvironment(): string {
    let result = '';
    const systemInfo = this.getSystemInfo();
    systemInfo?.forEach(val => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
  private findLinkInSingleAssets(assets, item) {
    let result = '';
    const assetIndex = assets.findIndex(
      asset =>
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
    allAssets.some(assets => {
      result = this.findLinkInSingleAssets(assets, item);
      return result;
    });
    return result;
  }

  private getClientResource(platform = 'pc-resource') {
    switch (platform) {
      case 'gitee': {
        this.resourceInfo.forEach(item => {
          switch (item.id) {
            case 'win': {
              item.link = `https://gitee.com/eolink_admin/postcat/releases/download/v${packageJson.version}/Postcat-Setup-${packageJson.version}.exe`;
              break;
            }
            case 'mac-intel': {
              item.link = `https://gitee.com/eolink_admin/postcat/releases/download/v${packageJson.version}/Postcat-${packageJson.version}.dmg`;
              break;
            }
            case 'mac-m1': {
              item.link = `https://gitee.com/eolink_admin/postcat/releases/download/v${packageJson.version}/Postcat-${packageJson.version}-arm64.dmg`;
              break;
            }
          }
        });
        break;
      }
      case 'pc-resource': {
        break;
      }
      case 'github': {
        fetch('https://api.github.com/repos/Postcatlab/postcat/releases')
          .then(response => response.json())
          .then((data = []) => {
            [...this.resourceInfo]
              .sort((a1, a2) => a2.suffix.length - a1.suffix.length)
              .forEach(item => {
                item.link = this.findLink(
                  data.map(val => val.assets),
                  item
                );
              });
          })
          .catch(e => {
            pcConsole.log('get postcat client download link error');
          });
        break;
      }
    }
  }

  async protocolCheck(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.electronService.isElectron) {
        return resolve(true);
      }
      (window as any).protocolCheck(
        PROTOCOL,
        () => {
          resolve(false);
        },
        () => {
          resolve(true);
        }
      );
    });
  }

  showDownloadClientModal(modalTitle: string) {
    const modal = this.modalService.create({
      nzTitle: modalTitle,
      nzContent: DownloadClientModalComponent,
      nzOnOk() {
        modal.destroy();
      }
    });
    return modal;
  }

  jumpToClient(modalTitle: string) {
    return new Promise(async (resolve, reject) => {
      const isInstalled = await this.protocolCheck();
      if (!isInstalled) {
        this.showDownloadClientModal(modalTitle);
        resolve(false);
      } else {
        window.location.href = PROTOCOL;
        resolve(true);
      }
    });
  }

  getSystemInfo(): DescriptionsItem[] {
    const descriptions: DescriptionsItem[] = [
      {
        id: 'version',
        label: $localize`Version`,
        value: packageJson.version
      }
      // {
      //   id: 'publishTime',
      //   label: $localize`Publish Time`,
      //   value: '',
      // },
    ];

    const electronDetails: DescriptionsItem[] = [
      {
        id: 'electron',
        label: 'Electron',
        value: ''
      },
      {
        id: 'chrome',
        label: 'Chromium',
        value: ''
      },
      {
        id: 'node',
        label: 'Node.js',
        value: ''
      },
      {
        id: 'v8',
        label: 'V8',
        value: ''
      },
      {
        id: 'os',
        label: 'OS',
        value: ''
      },
      {
        id: 'homeDir',
        label: 'Install Location',
        value: ''
      }
    ];
    let systemInfo = {};
    if (!this.isWeb) {
      systemInfo = window.electron.getSystemInfo();
      descriptions.push(...electronDetails);
    } else {
      systemInfo = getBrowserType(getSettings()?.['system.language']);
      descriptions.push(
        ...Object.entries<string>(systemInfo).map(([key, value]) => ({
          id: key,
          label: key.replace(/^\S/, s => s.toUpperCase()),
          value
        }))
      );
    }
    descriptions.forEach(item => {
      if (item.id in systemInfo) {
        item.value = systemInfo[item.id];
      }
    });

    // remote server version
    const serverVersion = StorageUtil.get('server_version');
    if (serverVersion && !this.store.isLocal) {
      descriptions.push({
        id: 'server',
        label: 'Server',
        value: serverVersion
      });
    }
    descriptions.push({
      id: 'platForm',
      label: $localize`Platform`,
      value: !this.isWeb ? 'Electron' : 'Web'
    });

    return descriptions;
  }
}
