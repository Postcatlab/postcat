import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ModuleInfo } from 'eo/workbench/browser/src/app/shared/models/extension-manager';
import { SidebarService } from './sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarModuleInfo } from './sidebar.model';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  destroy = false;
  modules: Array<ModuleInfo | SidebarModuleInfo | any>;
  constructor(
    private router: Router,
    public sidebar: SidebarService,
    private messageService: MessageService,
    private store: StoreService
  ) {}
  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    this.getModules();
    this.getIDFromRoute();
    this.watchRouterChange();
    this.watchWorkspaceChange();
    this.initSidebarViews();
  }

  async initSidebarViews() {
    const sidebarViews = await window.eo?.getSidebarViews?.();
    sidebarViews?.forEach((item) => {
      this.modules.push({
        title: item.title,
        id: item.extName,
        isShare: false,
        isOffical: false,
        icon: item.icon,
        activeRoute: `home/extensionSidebarView/${item.extName}`,
        route: `home/extensionSidebarView/${item.extName}`,
      });
    });
    sidebarViews?.length && this.getIDFromRoute();
  }

  watchWorkspaceChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type === 'workspaceChange') {
        this.getModules();
      }
    });
  }

  watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.getIDFromRoute();
    });
  }
  async clickModule(module) {
    this.sidebar.currentModule = module;
    const nextApp = this.modules.find((val) => val.id === module.id);
    const route = (nextApp as SidebarModuleInfo).route || '/home/blank';
    this.router.navigate([route], { queryParamsHandling: 'merge' });
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getModules() {
    const defaultModule = [
      {
        title: 'API',
        id: '@eo-core-share',
        isShare: true,
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/share',
        route: 'home/share/http/test',
      },
      {
        title: 'API',
        id: '@eo-core-apimanger',
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/api',
        route: 'home/api/http/test',
      },
      ...(!this.store.isLocal
        ? [
            {
              title: $localize`Member`,
              id: '@eo-core-member',
              isOffical: true,
              icon: 'peoples',
              activeRoute: 'home/member',
              route: 'home/member',
            },
          ]
        : []),
      {
        title: $localize`Workspace`,
        id: '@eo-core-workspace',
        isOffical: true,
        icon: 'home',
        activeRoute: 'home/workspace',
        route: 'home/workspace',
      },
      {
        title: $localize`Extensions`,
        id: '@eo-core-extension',
        isOffical: true,
        icon: 'plugins',
        activeRoute: 'home/extension',
        route: 'home/extension/list',
      },
      // {
      //   title: $localize`Vue3`,
      //   id: '@eo-core-vue3',
      //   isOffical: true,
      //   icon: 'plugins',
      //   activeRoute: 'home/app-vue3',
      //   route: 'home/app-vue3',
      // },
    ];
    const isShare = this.store.isShare;
    this.modules = defaultModule.filter((it: any) =>
      isShare ? it?.isShare : it?.isShare ? it?.isShare === isShare : true
    );
  }
  private getIDFromRoute() {
    const urlArr = new URL(this.router.url, 'http://localhost').pathname.split('/');
    const currentModule = this.modules.find((val) => val.activeRoute.split('/').every((n) => urlArr.includes(n)));
    if (!currentModule) {
      //route error
      // this.clickModule(this.modules[0]);
      console.warn(`route error: currentModule is [${currentModule}]`, currentModule);
      return;
    }
    this.sidebar.currentModule = currentModule;
  }
}
