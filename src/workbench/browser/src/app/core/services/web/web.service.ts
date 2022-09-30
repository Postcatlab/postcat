import { Injectable } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { DownloadClienteComponent } from 'eo/workbench/browser/src/app/core/services/web/download-client.component';
import { PROTOCOL } from 'eo/workbench/browser/src/app/shared/constants/protocol';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  isWeb = !this.electronService.isElectron;
  resourceInfo = [
    {
      id: 'win',
      name: $localize`Windows Client`,
      icon: 'windows',
      keyword: 'Setup',
      suffix: 'exe',
      link: '',
    },
    {
      id: 'mac',
      name: $localize`MacOS(Intel) Client`,
      icon: 'mac',
      suffix: 'dmg',
      link: '',
    },
    {
      id: 'mac',
      name: $localize`MacOS(M1) Client`,
      icon: 'mac',
      suffix: 'arm64.dmg',
      link: '',
    },
  ];
  constructor(private modalService: ModalService, private electronService: ElectronService) {
    this.getClientResource();
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

  private getClientResource() {
    fetch('https://api.github.com/repos/eolinker/eoapi/releases')
      .then((response) => response.json())
      .then((data = []) => {
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

  async protocolCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.electronService.isElectron) {
        return resolve(true);
      }
      (window as any).protocolCheck(
        PROTOCOL,
        () => {
          // alert("检测到您电脑Eoapi Client本地客户端未安装 请下载");
          resolve(false);
        },
        () => {
          resolve(true);
        }
      );
    });
  }

  showDownloadClientModal() {
    const modal = this.modalService.create({
      nzTitle: $localize`Eoapi Client is required to install this extension.`,
      nzContent: DownloadClienteComponent,
      nzOnOk() {
        modal.destroy();
      },
    });
    return modal;
  }

  jumpToClient() {
    return new Promise(async (resolve, reject) => {
      const isInstalled = await this.protocolCheck();
      if (!isInstalled) {
        // alert("检测到您电脑Eoapi Client本地客户端未安装 请下载");
        this.showDownloadClientModal();
        resolve(false);
      } else {
        window.location.href = PROTOCOL;
        resolve(true);
      }
    });
  }
}
