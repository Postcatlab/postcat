import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services';

@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isMaximized = false;
  isElectron: boolean = true;
  OS_TYPE = navigator.platform.toLowerCase();
  constructor(private electron: ElectronService) {
    this.isElectron = this.electron.isElectron;
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
  ngOnInit(): void {}
}
