import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { filter } from 'rxjs';

import { SidebarService } from '../layouts/sidebar/sidebar.service';
import { SocketService } from './extension/socket.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  isShowNotification;
  sidebarViews: any[] = [];
  constructor(private socket: SocketService, public electron: ElectronService, private router: Router, private sidebar: SidebarService) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {
    // * 通过 socketIO 告知 Node 端，建立 grpc 连接
    this.socket.socket2Node();
    this.initSidebarVisible(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.initSidebarVisible(res.url);
    });
  }
  initSidebarVisible(url: string) {
    if (['home/workspace/overview'].find(val => url.includes(val))) {
      this.sidebar.visible = false;
    } else {
      this.sidebar.visible = true;
    }
  }
}
