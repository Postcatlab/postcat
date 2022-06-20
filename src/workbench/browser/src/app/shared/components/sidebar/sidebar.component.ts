import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, takeWhile } from 'rxjs/operators';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
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
    this.watchRouterChange();
  }

  watchRouterChange(){
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.getModuleIDFromRoute();
    });
  }
  clickModule(module) {
    this.sidebar.currentModule = module;
    this.sidebar.appChanged$.next();
    let nextApp = this.modules.find((val) => val.moduleID === module.moduleID);
    let route = (nextApp as SidebarModuleInfo).route || '/home/blank';
    this.router.navigate([route]);
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
      {
        moduleName: '插件广场',
        moduleID: '@eo-core-extension',
        isOffical: true,
        logo: 'icon-apps',
        activeRoute: 'home/extension',
        route: this.electron.isElectron ? 'home/extension/list' : 'home/preview',
      },
    ];
    if (this.electron.isElectron) {
      this.modules = [...defaultModule, ...Array.from(window.eo.getSideModuleList())];
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
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
