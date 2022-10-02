import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, takeWhile } from 'rxjs/operators';
import { ElectronService, WebService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarModuleInfo } from './sidebar.model';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

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
    private workspaceService: WorkspaceService,
    private messageService: MessageService,
    private webService: WebService
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
    if (this.webService.isWeb) {
      if (module.moduleID === '@eo-core-workspace') {
        return await this.webService.jumpToClient($localize`Eoapi Client is required to add workspace`);
      }

      if (module.moduleID === '@eo-core-member') {
        return await this.webService.jumpToClient($localize`Eoapi Client is required to manage member`);
      }
    }
    this.router.navigate([route]);
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getModules() {
    const defaultModule = [
      {
        moduleName: 'API',
        moduleID: '@eo-core-apimanger',
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/api',
        route: 'home/api/http/test',
      },
      ...(this.workspaceService.currentWorkspaceID === -1
        ? []
        : [
            {
              moduleName: $localize`Member`,
              moduleID: '@eo-core-member',
              isOffical: true,
              icon: 'every-user',
              activeRoute: 'home/member',
              route: 'home/member',
            },
            {
              moduleName: $localize`Workspace`,
              moduleID: '@eo-core-workspace',
              isOffical: true,
              icon: 'home-5kaioboo',
              activeRoute: 'home/workspace',
              route: 'home/workspace',
            },
          ]),
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
      this.modules = [...defaultModule, ...Array.from(window.eo.getSideModuleList())];
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
        this.modules = window.eo.getSideModuleList();
      });
    } else {
      this.modules = [...defaultModule];
    }
  }
  private getModuleIDFromRoute() {
    const currentModule = this.modules.find((val) => this.router.url.includes(val.activeRoute));
    if (!currentModule) {
      //route error
      this.clickModule(this.modules[0]);
      console.error('route error: currentModule is undefind', currentModule);
      return;
    }
    this.sidebar.currentModule = currentModule;
  }
}
