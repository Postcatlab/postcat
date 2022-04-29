import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed: boolean;
  destroy = false;
  moduleID: string = '@eo-core-apimanger';
  modules: Array<ModuleInfo | any>;
  constructor(private electron: ElectronService, private router: Router, private sidebar: SidebarService) {
    this.isCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChange()
      .pipe(takeWhile(() => !this.destroy))
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
        if (this.electron.isElectron) {
          const sideWidth: number = isCollapsed ? 50 : 90;
          window.eo.autoResize(sideWidth);
        }
      });
  }

  tooltipVisibleChange(visible) {
    if (this.electron.isElectron && this.isCollapsed) {
      window.eo.toogleViewZIndex(visible);
    }
  }

  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    this.getApps();
    this.getModuleIDFromRoute();
  }

  openApp(moduleID: string) {
    this.moduleID = moduleID;
    let nextApp = this.modules.find((val) => val.moduleID === moduleID);
    if (nextApp.route) {
      this.router.navigate([nextApp.route]);
    }
    if (this.electron.isElectron) {
      window.eo.openApp({ moduleID: moduleID });
    }
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getApps() {
    let defaultModule = [
      {
        moduleName: 'API',
        moduleID: '@eo-core-apimanger',
        logo: 'icon-api',
        activeRoute: 'home/api',
        route: 'home/api/test',
      },
    ];
    if (!this.electron.isElectron) {
      defaultModule.push({
        moduleName: '插件广场',
        moduleID: '@eo-core-extension',
        logo: 'icon-apps',
        activeRoute: 'home/preview',
        route: 'home/preview',
      });
    }
    if (this.electron.isElectron) {
      this.modules = [...defaultModule, ...Array.from(window.eo.getSideModuleList())];
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
        console.log('get moduleUpdate');
        this.modules = window.eo.getSideModuleList();
      });
    } else {
      this.modules = [...defaultModule];
    }
  }
  private getModuleIDFromRoute() {
    let currentModule = this.modules.find((val) => this.router.url.includes(val.activeRoute));
    this.moduleID = currentModule?.moduleID || '@eo-core-apimanger';
    if (!currentModule) this.openApp(this.moduleID);
  }
}
