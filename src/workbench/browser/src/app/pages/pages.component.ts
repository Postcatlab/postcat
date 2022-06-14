import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SidebarService } from 'eo/workbench/browser/src/app/shared/components/sidebar/sidebar.service';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message/message.model';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  loadedIframe = false;
  iframeSrc: SafeResourceUrl;
  isRemote = true;
  isClose = true;
  dataSourceText = '';
  switchDataSource = () => ({});
  private destroy$: Subject<void> = new Subject<void>();
  /** 在线或离线图标 */
  get icon() {
    return `../../../../assets/images/${this.isRemote ? 'online' : 'offline'}.svg`;
  }
  get isShowNotification() {
    return !this.isRemote && !this.isClose && localStorage.getItem('IS_SHOW_REMOTE_SERVER_NOTIFICATION') !== 'false';
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    public sidebar: SidebarService,
    private messageService: MessageService
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

  private watchRemoteServerChange() {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'remoteServerUpdate': {
            const { isRemote, switchDataSource, dataSourceText } = inArg.data;
            setTimeout(() => {
              this.isRemote = isRemote;
              this.dataSourceText = dataSourceText;
              this.switchDataSource = switchDataSource;
              if (!isRemote) {
                this.isClose = false;
              }
              console.log('this.isClose', this.isClose, isRemote);
            });
            break;
          }
        }
      });
  }

  closeNotification() {
    this.isClose = true;
    localStorage.setItem('IS_SHOW_REMOTE_SERVER_NOTIFICATION', 'false');
  }
}
