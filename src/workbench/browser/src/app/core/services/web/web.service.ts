import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { SettingService } from 'eo/workbench/browser/src/app/modules/system-setting/settings.service';
import { DownloadClientModalComponent } from 'eo/workbench/browser/src/app/shared/components/download-client.component';
import { PROTOCOL } from 'eo/workbench/browser/src/app/shared/constants/protocol';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

import packageJson from '../../../../../../../../package.json';

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
      link: ''
    },
    {
      id: 'mac-intel',
      name: $localize`MacOS(Intel) Client`,
      icon: 'mac',
      suffix: 'dmg',
      link: ''
    },
    {
      id: 'mac-m1',
      name: $localize`MacOS(M1) Client`,
      icon: 'mac',
      suffix: 'arm64.dmg',
      link: ''
    }
  ];
  constructor(private modalService: ModalService, private settingService: SettingService, private electronService: ElectronService) {
    this.isWeb = !this.electronService.isElectron;
    if (this.isWeb) {
      this.settingService.putSettings({ 'backend.url': window.location.origin });
    } else {
      this.settingService.putSettings({ 'backend.url': APP_CONFIG.production ? 'https://postcat.com' : 'http://54.255.141.14:8080' });
    }
    this.getClientResource('gitee');
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

  private getClientResource(platform = 'github') {
    switch (platform) {
      case 'gitee': {
        this.resourceInfo.forEach(item => {
          switch (item.id) {
            case 'win': {
              item.link = `https://gitee.com/eolink_admin/postcat/releases/download/v${packageJson.version}/Postcat-${packageJson.version}.dmg`;
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
        fetch('https://api.github.com/repos/eolinker/postcat/releases')
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
}
