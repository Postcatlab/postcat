import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../utils/module-loader';

@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isElectron: boolean = true;
  OS_TYPE = navigator.platform.toLowerCase();
  modules: Map<string, ModuleInfo>;
  constructor(private electron: ElectronService) {
    this.isElectron = this.electron.isElectron;
  }
  mouseover($event) {
    // console.log('mouseover',$event.target);
    this.electron.ipcRenderer.send('message',{
      action: 'connect-dropdown',
      data:{
        action:'show',
        positon:{
          x:0,
          y:0
        }
      }
    });
  }
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize',
    });
  }
  toggleMaximize() {
    this.electron.ipcRenderer.send('message', {
      action: this.isMaximized ? 'restore' : 'maximize',
    });
    this.isMaximized = !this.isMaximized;
  }
  close() {
    this.electron.ipcRenderer.send('message', {
      action: 'close',
    });
  }
  ngOnInit(): void {
    if (this.isElectron) {
      this.modules = this.electron.ipcRenderer.sendSync('eo-sync', { type: 'getModules' });
      console.log(this.modules);
    } else {
      this.modules = new Map();
    }
  }

  getModules(): Array<ModuleInfo> {
    return Array.from(this.modules.values());
  }

  openApp(moduleID: string) {
    this.electron.ipcRenderer.sendSync('eo-sync', { type: 'openApp', moduleID: moduleID });
  }
}
