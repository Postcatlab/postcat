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
  isElectron: boolean = false;
  moduleID: string = '@eo-core-apimanger';
  modules: Array<ModuleInfo | any>;
  constructor(private electron: ElectronService,private router: Router, private sidebar: SidebarService) {
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
    let defaultModule = { moduleName: 'API', moduleID: '@eo-core-apimanger', logo: 'icon-api', route: 'home/api/test' };
    if (this.isElectron) {
      // TODO change app to blank page
      this.modules = [defaultModule, ...Array.from(window.eo.getSideModuleList())];
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
        console.log('get moduleUpdate');
        this.modules = window.eo.getSideModuleList();
      });
    } else {
      this.modules = [defaultModule];
    }
  }

  openApp(moduleID: string) {
    let currentApp=this.modules.find(val=>val.moduleID===this.moduleID),nextApp=this.modules.find(val=>val.moduleID===moduleID);
    if(currentApp.route){
      //core app
      this.router.navigate(['home/blank']);
    }
    this.moduleID = moduleID;
    if(nextApp.route){
      this.router.navigate([nextApp.route]);
    }
    window.eo.openApp({ moduleID: moduleID });
  }

  ngOnDestroy(): void {
    this.destroy = true;
  }
}
