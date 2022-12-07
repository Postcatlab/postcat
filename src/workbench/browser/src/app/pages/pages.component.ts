import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { Message, MessageService } from 'eo/workbench/browser/src/app/shared/services/message';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  isShowNotification;
  sidebarViews: any[] = [];
  constructor(
    public electron: ElectronService,
    private messageService: MessageService,
    private settingService: SettingService,
    private sanitizer: DomSanitizer
  ) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {
    // this.initSidebarViews();
  }
  async initSidebarViews() {
    this.sidebarViews = await window.eo?.getSidebarViews?.();
    console.log('this.sidebarViews', this.sidebarViews);
    this.sidebarViews = this.sidebarViews?.filter((item) => {
      if (item.useIframe) {
        const dynamickUrl = this.settingService.getConfiguration('eoapi-apispace.dynamicUrl');
        item.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dynamickUrl || item.url);
      }
      return item.useIframe;
    });
  }

  watchLocalExtensionsChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type === 'localExtensionsChange') {
        this.initSidebarViews();
      }
    });
  }
}
