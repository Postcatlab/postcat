import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isElectron: boolean = false;
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

  constructor(private electron: ElectronService) {
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
        console.log(this.resourceInfo);
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
}
