import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { filter } from 'rxjs';

import { SidebarService } from '../layouts/sidebar/sidebar.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  isShowNotification;
  sidebarViews: any[] = [];
  constructor(
    public electron: ElectronService,
    private messageService: MessageService,
    private router: Router,
    private sidebar: SidebarService
  ) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {
    this.initPlugSideabr();
    this.initSidebarVisible(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.initSidebarVisible(res.url);
    });
  }
  initSidebarVisible(url: string) {
    if (['home/workspace/project/list'].find(val => url.includes(val))) {
      this.sidebar.sidebarShow = false;
    } else {
      this.sidebar.sidebarShow = true;
    }
  }
  async initPlugSideabr() {
    // this.sidebarViews = await window.eo?.getSidebarViews?.();
    // console.log('this.sidebarViews', this.sidebarViews);
    // this.sidebarViews = this.sidebarViews?.filter(item => {
    //   if (item.useIframe) {
    //     const dynamickUrl = this.settingService.getConfiguration('eoapi-apispace.dynamicUrl');
    //     item.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dynamickUrl || item.url);
    //   }
    //   return item.useIframe;
    // });
  }

  watchLocalExtensionsChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type === 'localExtensionsChange') {
        this.initPlugSideabr();
      }
    });
  }
}
