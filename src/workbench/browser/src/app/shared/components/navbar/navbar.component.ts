import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
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
      name: 'macOS 客户端',
      icon: 'mac',
      suffix: 'dmg',
      link: '',
    },
  ];

  constructor(private electron: ElectronService) {
    this.isElectron = this.electron.isElectron;
    this.getInstaller();
  }
  getInstaller() {
    fetch('https://api.github.com/repos/eolinker/eoapi/releases')
      .then((response) => response.json())
      .then((data) => {
        this.resourceInfo.forEach((item) => {
          let assetItem = data[0].assets.find(
            (asset) =>
              asset.browser_download_url.slice(-item.suffix.length) === item.suffix &&
              (!item.keyword || asset.browser_download_url.includes(item.keyword))
          );
          item.link = assetItem.browser_download_url;
        });
      });
  }
  changeHelpVisible(visible) {
    if(this.isElectron){
      window.eo.toogleViewZIndex(visible);
    }
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

  openApp(moduleID: string) {
    window.eo.openApp({ moduleID: moduleID });
  }
}
