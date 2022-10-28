import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ModuleInfo } from 'eo/platform/node/extension-manager/types';
import { SidebarService } from './sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarModuleInfo } from './sidebar.model';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  destroy = false;
  modules: Array<ModuleInfo | SidebarModuleInfo | any>;
  constructor(private router: Router, public sidebar: SidebarService) {
    this.isCollapsed = this.sidebar.getCollapsed();
  }
  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    this.getModules();
    this.getIDFromRoute();
    this.watchRouterChange();
  }

  watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.getIDFromRoute();
    });
  }
  clickModule(module) {
    this.sidebar.currentModule = module;
    this.sidebar.appChanged$.next();
    const nextApp = this.modules.find((val) => val.id === module.id);
    const route = (nextApp as SidebarModuleInfo).route || '/home/blank';
    this.router.navigate([route]);
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getModules() {
    const defaultModule = [
      {
        title: 'API',
        id: '@eo-core-apimanger',
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/api',
        route: 'home/api/http/test',
      },
      {
        title: $localize`Extensions`,
        id: '@eo-core-extension',
        isOffical: true,
        icon: 'puzzle',
        activeRoute: 'home/extension',
        route: 'home/extension/list',
      },
      {
        title: $localize`Vue3`,
        id: '@eo-core-vue3',
        isOffical: true,
        icon: 'puzzle',
        activeRoute: 'home/app-vue3',
        route: 'home/app-vue3',
      },
    ];
    this.modules = [...defaultModule];
  }
  private getIDFromRoute() {
    const currentModule = this.modules.find((val) => this.router.url.includes(val.activeRoute));
    if (!currentModule) {
      //route error
      this.clickModule(this.modules[0]);
      console.error('route error: currentModule is undefind', currentModule);
      return;
    }
    this.sidebar.currentModule = currentModule;
    this.sidebar.appChanged$.next();
  }
}
