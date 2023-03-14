import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { autorun } from 'mobx';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { Message, MessageService } from 'pc/browser/src/app/services/message';
import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FeatureControlService } from '../../core/services/feature-control/feature-control.service';
import { SidebarModuleInfo } from './sidebar.model';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  modules: Array<ExtensionInfo | SidebarModuleInfo | any>;
  routerSubscribe: Subscription;
  constructor(
    private router: Router,
    public sidebar: SidebarService,
    private messageService: MessageService,
    private extension: ExtensionService,
    public store: StoreService,
    private feature: FeatureControlService
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
          activeRoute: `home/workspace/project/extensionSidebarView/${item.extensionID}`,
          route: `home/workspace/project/extensionSidebarView/${item.extensionID}`
        });
      }
    });
    sidebarViews?.length && this.getIDFromRoute();
  }

  watchInstalledExtensionsChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type === 'extensionsChange') {
        if (!this.sidebar.visible) return;
        const installedMap = inArg.data.installedMap;
        const extensionIDs = Array.isArray(installedMap) ? installedMap.map(n => n.name) : [...installedMap.keys()];
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
    const settingItem = true
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
    const memberItem = this.feature.config.cloudFeature
      ? [
          {
            title: $localize`Member`,
            id: '@eo-core-member',
            isOffical: true,
            icon: 'peoples',
            activeRoute: 'home/workspace/project/member',
            route: 'home/workspace/project/member'
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
        activeRoute: 'share',
        route: 'share/http/test'
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
      ...memberItem,
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
