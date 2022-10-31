import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, takeWhile } from 'rxjs/operators';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarModuleInfo } from './sidebar.model';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  destroy = false;
  modules: Array<ModuleInfo | SidebarModuleInfo | any>;
  constructor(
    private electron: ElectronService,
    private router: Router,
    public sidebar: SidebarService,
    private dataSourceService: DataSourceService,
    private messageService: MessageService,
    private workspace: WorkspaceService,
    private status: StatusService
  ) {
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
    this.watchWorkspaceChange();
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
      this.getModuleIDFromRoute();
    });
  }
  async clickModule(module) {
    this.sidebar.currentModule = module;
    const nextApp = this.modules.find((val) => val.moduleID === module.moduleID);
    const route = (nextApp as SidebarModuleInfo).route || '/home/blank';
    if (module.moduleID !== '@eo-core-member') {
      this.router.navigate([route], { queryParamsHandling: 'merge' });
      return;
    }
    const isLocal = this.workspace.currentWorkspaceID === -1;
    this.dataSourceService.checkRemoteCanOperate(() => {
      this.router.navigate([route], { queryParamsHandling: 'merge' });
    }, isLocal);
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getModules() {
    const defaultModule = [
      {
        moduleName: 'API',
        moduleID: '@eo-core-share',
        isShare: true,
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/share',
        route: 'home/share/http/test',
      },
      {
        moduleName: 'API',
        moduleID: '@eo-core-apimanger',
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/api',
        route: 'home/api/http/test',
      },
      ...(!this.workspace.isLocal
        ? [
            {
              moduleName: $localize`Member`,
              moduleID: '@eo-core-member',
              isOffical: true,
              icon: 'every-user',
              activeRoute: 'home/member',
              route: 'home/member',
            },
          ]
        : []),
      {
        moduleName: $localize`Workspace`,
        moduleID: '@eo-core-workspace',
        isOffical: true,
        icon: 'home-5kaioboo',
        activeRoute: 'home/workspace',
        route: 'home/workspace',
      },
      {
        moduleName: $localize`Extensions`,
        moduleID: '@eo-core-extension',
        isOffical: true,
        icon: 'puzzle',
        activeRoute: 'home/extension',
        route: 'home/extension/list',
      },
    ];
    if (this.electron.isElectron) {
      this.modules = [...defaultModule, ...Array.from(window.eo.getSideModuleList())].filter((it: any) => !it.isShare);
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
        this.modules = window.eo.getSideModuleList().filter((it: any) => !it.isShare);
      });
    } else {
      const isShare = this.status.isShare;
      this.modules = defaultModule.filter((it: any) =>
        isShare ? it?.isShare : it?.isShare ? it?.isShare === isShare : true
      );
    }
  }
  private getModuleIDFromRoute() {
    const currentModule = this.modules.find((val) => this.router.url.includes(val.activeRoute));
    if (!currentModule) {
      //route error
      // this.clickModule(this.modules[0]);
      console.warn(`route error: currentModule is [${currentModule}]`, currentModule);
      return;
    }
    this.sidebar.currentModule = currentModule;
  }
}
