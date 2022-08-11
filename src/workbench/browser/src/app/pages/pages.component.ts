import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SidebarService } from 'eo/workbench/browser/src/app/shared/components/sidebar/sidebar.service';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message/message.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { IS_SHOW_REMOTE_SERVER_NOTIFICATION } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';

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
  isShow = localStorage.getItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION) === 'true';
  get dataSourceText() {
    return this.remoteService.dataSourceText;
  }
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  get isShowNotification() {
    return !this.isRemote && this.isShow;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    public sidebar: SidebarService,
    private messageService: MessageService,
    private remoteService: RemoteService,
    public electron: ElectronService
  ) {
    this.rawChange$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.updateState();
    });
  }
  ngOnInit(): void {
    this.watchSidebarItemChange();
    this.watchRemoteServerChange();
    this.rawChange$.next('');
  }
  private watchSidebarItemChange() {
    this.sidebar.appChanged$.subscribe(() => {
      this.loadedIframe = false;
      if (!this.sidebar.currentModule.isOffical) {
        setTimeout(() => {
          //add loading
          this.loadedIframe = false;
          const iframe = document.getElementById('app_iframe') as HTMLIFrameElement;
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
    this.remoteService.switchDataSource('http');
  };

  updateState = async () => {
    if (!this.isRemote && localStorage.getItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION) !== 'false') {
      const [isSuccess] = await this.remoteService.pingRmoteServerUrl();
      this.isShow = isSuccess;
    }
    // if (!) {
    //   this.isClose = false;
    // }
  };

  private watchRemoteServerChange() {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'onDataSourceChange': {
            // this.rawChange$.next(inArg.type);
            break;
          }
        }
      });
  }

  closeNotification() {
    this.isShow = false;
    localStorage.setItem(IS_SHOW_REMOTE_SERVER_NOTIFICATION, 'false');
  }
}
