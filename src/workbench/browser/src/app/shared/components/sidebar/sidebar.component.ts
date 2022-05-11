import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';
import { SidebarModuleInfo } from './sidebar.model';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed: boolean;
  destroy = false;
  modules: Array<ModuleInfo | SidebarModuleInfo | any>;
  constructor(private electron: ElectronService, private router: Router, public sidebar: SidebarService) {
    this.isCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChanged()
      .pipe(takeWhile(() => !this.destroy))
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
        if (this.electron.isElectron) {
          const sideWidth: number = isCollapsed ? 50 : 90;
          window.eo.autoResize(sideWidth);
        }
      });
  }
  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    this.getModules();
    this.getModuleIDFromRoute();
  }

  clickModule(module) {
    this.sidebar.currentModule = module;
    this.sidebar.appChanged$.next();
    let nextApp = this.modules.find((val) => val.moduleID === module.moduleID);
    // let route = (nextApp as SidebarModuleInfo).route || '/home/blank';
    // this.router.navigate([route]);
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getModules() {
    let defaultModule = [
      {
        moduleName: 'API',
        moduleID: '@eo-core-apimanger',
        isOffical: true,
        logo: 'icon-api',
        activeRoute: 'home/api',
        route: 'home/api/test',
      },
    ];
    if (!this.electron.isElectron) {
      defaultModule.push({
        moduleName: '拓展广场',
        moduleID: '@eo-core-extension',
        isOffical: true,
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
    if (!currentModule) {
      //route error
      this.clickModule(this.modules[0]);
      return;
    }
    this.sidebar.currentModule = currentModule;
    this.sidebar.appChanged$.next();
  }
}
