import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ExtensionService } from 'eo/workbench/browser/src/app/pages/extension/extension.service';
import { ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SidebarModuleInfo } from './sidebar.model';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  modules: Array<ModuleInfo | SidebarModuleInfo | any>;
  routerSubscribe: Subscription;
  constructor(
    private router: Router,
    public sidebar: SidebarService,
    private messageService: MessageService,
    private extension: ExtensionService,
    public store: StoreService
  ) {}
  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    this.getModules();
    autorun(() => {
      this.store.isLocal;
      this.getModules();
    });
    this.getIDFromRoute();
    this.watchRouterChange();
    this.watchInstalledExtensionsChange();
    this.initSidebarViews();
  }

  async initSidebarViews() {
    const sidebarViews = await this.extension.getSidebarViews();
    sidebarViews?.forEach(item => {
      const moduleIndex = this.modules.findIndex(n => n.id === item.extensionID);
      const validExtension = this.extension.isEnable(item.extensionID);
      if (moduleIndex !== -1 && !validExtension) {
        this.modules.splice(moduleIndex, 1);
        return;
      }
      if (moduleIndex === -1 && validExtension) {
        this.modules.splice(-1, 0, {
          title: item.title,
          id: item.extensionID,
          isShare: false,
          isOffical: false,
          icon: item.icon,
          activeRoute: `home/extensionSidebarView/${item.extensionID}`,
          route: `home/extensionSidebarView/${item.extensionID}`
        });
      }
    });
    sidebarViews?.length && this.getIDFromRoute();
  }

  watchInstalledExtensionsChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type === 'installedExtensionsChange') {
        if (!this.sidebar.visible) return;
        const extensionIDs = Array.isArray(inArg.data) ? inArg.data.map(n => n.name) : [...inArg.data.keys()];
        this.modules = this.modules.filter(n => n.isOffical || extensionIDs.includes(n.id));
        this.initSidebarViews();
        if (!this.modules.some(val => this.router.url.includes(val.activeRoute))) {
          pcConsole.warn('sidebar activeRoute not found, redirect to home');
          this.router.navigate(['/home/workspace/project/api']);
        }
      }
    });
  }

  watchRouterChange() {
    this.routerSubscribe = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.getIDFromRoute();
    });
  }
  async clickModule(module) {
    this.sidebar.setModule(module.id);
    const nextApp = this.modules.find(val => val.id === module.id);
    const route = (nextApp as SidebarModuleInfo).route;
    if (route && !this.router.url.includes(nextApp.activeRoute)) {
      this.router.navigate([route]);
    }
  }
  ngOnDestroy(): void {
    this.routerSubscribe?.unsubscribe();
  }
  private getModules() {
    const settingItem = ['Owner'].includes(this.store.getProjectRole)
      ? [
          {
            title: $localize`Setting`,
            id: '@eo-core-setting',
            isOffical: true,
            icon: 'setting',
            activeRoute: 'home/workspace/project/setting',
            route: 'home/workspace/project/setting'
          }
        ]
      : [];

    const defaultModule = [
      {
        title: 'API',
        id: '@eo-core-share',
        isShare: true,
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/share',
        route: 'home/share/http/test'
      },
      {
        title: 'API',
        id: '@eo-core-apimanger',
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/workspace/project/api',
        route: 'home/workspace/project/api/http/test'
      },
      {
        title: $localize`Environment`,
        id: '@eo-core-env',
        isOffical: true,
        icon: 'application',
        activeRoute: 'home/workspace/project/api',
        route: 'home/workspace/project/api/http/test'
      },
      // {
      //   title: $localize`Member`,
      //   id: '@eo-core-member',
      //   isOffical: true,
      //   icon: 'peoples',
      //   activeRoute: 'home/workspace/project/member',
      //   route: 'home/workspace/project/member'
      // },
      ...settingItem
    ];
    const isShare = this.store.isShare;
    this.modules = defaultModule.filter((it: any) => (isShare ? it?.isShare : it?.isShare ? it?.isShare === isShare : true));
  }

  private getIDFromRoute() {
    if (!this.sidebar.visible) return;
    const urlArr = new URL(this.router.url, 'http://localhost').pathname.split('/');
    const currentModuleIsValid = this.modules.find(val => {
      if (val.id === this.sidebar.currentID && val.activeRoute.split('/').every(n => urlArr.includes(n))) {
        return true;
      }
    });
    if (currentModuleIsValid) return;
    const currentModule = this.modules.find(val => val.activeRoute.split('/').every(n => urlArr.includes(n)));
    if (!currentModule) {
      //route error
      pcConsole.warn(`[sidebarComponent]: route error,currentModule is [${currentModule}]`, currentModule, urlArr);
      return;
    }
    this.sidebar.currentID = currentModule.id;
  }
}
