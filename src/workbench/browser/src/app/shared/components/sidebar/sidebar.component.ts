import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed: boolean;
  destroy = false;
  isElectron: boolean = false;
  moduleID: string = 'api';
  modules: Array<ModuleInfo|any>;
  constructor(private electron: ElectronService, private sidebar: SidebarService) {
    this.isElectron = this.electron.isElectron;
    this.isCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChange()
      .pipe(takeWhile(() => !this.destroy))
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
        if (this.isElectron) {
          const sideWidth: number = isCollapsed ? 50 : 90;
          window.eo.autoResize(sideWidth);
        }
      });
  }

  tooltipVisibleChange(visible) {
    if (this.isCollapsed) {
      window.eo.toogleViewZIndex(visible);
    }
  }

  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    if (this.isElectron) {
      this.modules =[{ moduleName: 'API', moduleID: 'api', logo: 'icon-api' },...Array.from(window.eo.getSideModuleList())] 
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
        console.log('get moduleUpdate');
        this.modules = window.eo.getSideModuleList();
      });
    } else {
      this.modules =[];
    }
  }

  openApp(moduleID: string) {
    this.moduleID = moduleID;
    window.eo.openApp({ moduleID: moduleID });
  }

  ngOnDestroy(): void {
    this.destroy = true;
  }
}
