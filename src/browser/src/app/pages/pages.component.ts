import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NzNotificationRef, NzNotificationService } from 'ng-zorro-antd/notification';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { NewbieGuideComponent } from 'pc/browser/src/app/pages/components/model-article/newbie-guide/newbie-guide.component';
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
    private store: StoreService
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

    // TODO: first use
    if (this.store.getAppHasInitial) return;
    const modal = this.modal.create({
      nzTitle: $localize`Hello，欢迎使用Postcat~`,
      nzWidth: '650px',
      nzContent: NewbieGuideComponent,
      nzCancelText: $localize`我了解了`,
      nzBodyStyle: {
        height: '450px',
        'overflow-y': 'scroll'
      },
      nzCentered: true,
      nzClassName: 'model-article'
    });
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
}
