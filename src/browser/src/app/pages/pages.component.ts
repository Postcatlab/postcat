import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationRef, NzNotificationService } from 'ng-zorro-antd/notification';
import { ElectronService, WebService } from 'pc/browser/src/app/core/services';
import { NewbieGuideComponent } from 'pc/browser/src/app/pages/components/model-article/newbie-guide/newbie-guide.component';
import { UpdateLogComponent } from 'pc/browser/src/app/pages/components/model-article/update-log/update-log.component';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { filter } from 'rxjs';

import { SidebarService } from '../layouts/sidebar/sidebar.service';
import StorageUtil from '../shared/utils/storage/storage.utils';
import { SocketService } from './components/extension/socket.service';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  @ViewChild('notificationTmp', { read: TemplateRef, static: true }) notificationTmp: TemplateRef<HTMLDivElement>;
  cookieNotification: NzNotificationRef;
  hasShowCookieTips = StorageUtil.get('has_show_cookie_tips');
  isShowNotification;
  sidebarViews: any[] = [];

  constructor(
    private socket: SocketService,
    public electron: ElectronService,
    private router: Router,
    private sidebar: SidebarService,
    private notification: NzNotificationService,
    private modal: ModalService,
    private store: StoreService,
    private web: WebService
  ) {}
  ngOnInit(): void {
    // * 通过 socketIO 告知 Node 端，建立 grpc 连接
    this.socket.socket2Node();
    this.initSidebarVisible(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.initSidebarVisible(res.url);
    });

    // Show cookie tips
    // if (!(this.hasShowCookieTips || this.electron.isElectron) && this.lang.systemLanguage === 'en-US') {
    //   StorageUtil.set('has_show_cookie_tips', true);
    //   this.showCookiesTips();
    // }
  }

  ngAfterContentInit() {
    // TODO: first use
    const result = this.web.getSystemInfo();
    const version = result.shift().value;
    if (!this.store.getAppHasInitial && !StorageUtil.get('version')) {
      this.newbieGuide(version);
      return;
    }
    if (StorageUtil.get('version') && StorageUtil.get('version') === version) return;
    this.updateLog(version);
  }
  closeNotification() {
    this.notification.remove(this.cookieNotification.messageId);
  }
  showCookiesTips() {
    this.cookieNotification = this.notification.template(this.notificationTmp, {
      nzPlacement: 'bottom',
      nzClass: 'cookie-notification',
      nzPauseOnHover: true
    });
  }

  initSidebarVisible(url: string) {
    if (['home/workspace/overview'].find(val => url.includes(val))) {
      this.sidebar.visible = false;
    } else {
      this.sidebar.visible = true;
    }
  }

  newbieGuide(version: string) {
    this.modal.create({
      nzTitle: $localize`Welcome to Postcat～`,
      nzWidth: '650px',
      nzContent: NewbieGuideComponent,
      nzCancelText: $localize`Got it`,
      nzBodyStyle: {
        height: 'calc(100vh* 0.7)',
        'overflow-y': 'scroll'
      },
      nzCentered: true,
      nzClassName: 'model-article',
      stayWhenRouterChange: true
    });
    StorageUtil.set('version', version);
  }

  updateLog(version: string) {
    this.modal.create({
      nzTitle: $localize`Release Log`,
      nzWidth: '650px',
      nzContent: UpdateLogComponent,
      nzCancelText: $localize`Got it`,
      nzBodyStyle: {
        height: 'calc(100vh* 0.7)',
        'overflow-y': 'scroll'
      },
      nzCentered: true,
      nzClassName: 'model-article',
      stayWhenRouterChange: true
    });
    StorageUtil.set('version', version);
  }
}
