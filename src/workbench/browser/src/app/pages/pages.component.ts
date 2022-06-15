import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SidebarService } from 'eo/workbench/browser/src/app/shared/components/sidebar/sidebar.service';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message/message.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { Subject, takeUntil } from 'rxjs';
import { isElectron } from 'eo/shared/common/common';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';

/** is show local data source tips */
export const IS_SHOW_REMOTE_SERVER_NOTIFICATION = 'IS_SHOW_REMOTE_SERVER_NOTIFICATION';
@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  loadedIframe = false;
  iframeSrc: SafeResourceUrl;
  get isRemote() {
    return this.remoteService.isRemote;
  }
  isElectron = isElectron();
  isClose = true;
  get dataSourceText() {
    return this.remoteService.dataSourceText;
  }
  private destroy$: Subject<void> = new Subject<void>();
  get isShowNotification() {
    return !this.isRemote && !this.isClose && localStorage.getItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION) !== 'false';
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    public sidebar: SidebarService,
    private messageService: MessageService,
    private remoteService: RemoteService
  ) {}
  ngOnInit(): void {
    this.watchSidebarItemChange();
    this.watchRemoteServerChange();
  }
  private watchSidebarItemChange() {
    this.sidebar.appChanged$.subscribe(() => {
      this.loadedIframe = false;
      if (!this.sidebar.currentModule.isOffical) {
        setTimeout(() => {
          //add loading
          this.loadedIframe = false;
          let iframe = document.getElementById('app_iframe') as HTMLIFrameElement;
          //load resource
          iframe.src = this.sidebar.currentModule.main;
          //loading finish
          iframe.onload = () => {
            this.loadedIframe = true;
            this.cdRef.detectChanges();
          };
        }, 0);
      }
    });
  }

  switchDataSource = () => {
    this.remoteService.switchDataSource();
  };

  private watchRemoteServerChange() {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'onDataSourceChange': {
            setTimeout(() => {
              if (!this.remoteService.isRemote) {
                this.isClose = false;
              }
            });
            break;
          }
        }
      });
  }

  closeNotification() {
    this.isClose = true;
    localStorage.setItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false');
  }
}
