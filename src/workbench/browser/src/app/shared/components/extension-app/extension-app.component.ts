import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventCenterForMicroApp } from '@micro-zoe/micro-app';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import microApp from '@micro-zoe/micro-app';
import { ActivatedRoute } from '@angular/router';
import { GlobalProvider } from './globalProvider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';

(window as any).eventCenterForAppNameVite = new EventCenterForMicroApp('appname-extension-app');

@Component({
  selector: 'extension-app',
  template: `
    <div style="transform: translate(0)" class="extension-app w-full h-full overflow-auto relative">
      <ngx-wujie
        *ngIf="type === 'micro-app' && url"
        width="100%"
        height="100%"
        [name]="name"
        [url]="url"
        (beforeLoad)="onBeforeLoad($event)"
        (beforeMount)="onBeforeMount($event)"
        (afterMount)="onAfterMount($event)"
        (beforeUnmount)="onBeforeUnmount($event)"
        (afterUnmount)="onAfterUnmount($event)"
        (event)="onEvent($event)"
      ></ngx-wujie>
      <iframe
        *ngIf="type === 'iframe' && safeUrl"
        #extensionApp
        width="100%"
        height="100%"
        class="border-none"
        [name]="name"
        [src]="safeUrl"
      ></iframe>
    </div>
  `,
})
export class ExtensionAppComponent implements OnInit, OnDestroy {
  @ViewChild('extensionApp') extensionApp: ElementRef;

  @Input() name = ``;
  @Input() url = ``;
  @Input() type: 'micro-app' | 'iframe';

  iframeWin: Window;
  safeUrl: SafeResourceUrl;
  retryCount = 0;

  microAppData = { msg: '来自基座的数据' };

  constructor(
    private sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    private globalProvider: GlobalProvider,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.globalProvider.injectGlobalData();
    this.initSidebarViewByRoute();

    window.addEventListener('message', this.receiveMessage, false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.receiveMessage, false);
  }

  initSidebarViewByRoute() {
    this.route.params.subscribe(async (data) => {
      if (data.extName && window.eo?.getSidebarView) {
        this.name = data.extName;
        const sidebar = await window.eo?.getSidebarView?.(data.extName);
        console.log('sidebar', sidebar);
        this.url = sidebar.url;
        this.type = sidebar.useIframe ? 'iframe' : 'micro-app';
        if (sidebar.useIframe) {
          const dynamickUrl = this.settingService.getConfiguration('eoapi-apispace.dynamicUrl');
          console.log('sidebar 动态配置的地址', dynamickUrl);
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dynamickUrl || this.url);
        }
        console.log('this', this);
      }
    });
  }

  receiveMessage = async (event) => {
    const { data, origin } = event;
    const target = data.namePath?.split('.')?.reduce((p, c) => p?.[c], window.eo);
    if (data.msgID) {
      console.log('data.data', data.data);
      const res = typeof target === 'function' ? await target(...data.data) : target;
      this.iframeWin.postMessage(
        {
          msgID: data.msgID,
          data: target ? res : `调用路径[${data.namePath}]不存在`,
        },
        origin
      );
    } else if (data === 'EOAPI_EXT_APP') {
      this.iframeWin = this.extensionApp?.nativeElement?.contentWindow;
      this.iframeWin.postMessage('EOAPI_MESSAGE', '*');
    }
  };

  /**
   * vite 子应用因为沙箱关闭，数据通信功能失效
   */
  onBeforeLoad(e): void {
    console.log('child-vite 创建了', e);
  }

  onBeforeMount(e): void {
    console.log('child-vite 即将被渲染', e);
  }

  onAfterMount(e): void {
    console.log('child-vite 已经渲染完成', e);
    // this.storage.run('groupLoadAllByProjectID', [1], (result) => {
    //   if (result.status === 200) {
    //     this.microAppData = result.data;
    //     // 发送数据给子应用 my-app，setData第二个参数只接受对象类型
    //     microApp.setData(this.name, { data: this.microAppData });
    //     console.log('this.microAppData', this.microAppData);
    //   }
    // });
    // setTimeout(() => {
    //   this.microAppData = { msg: '来自基座的新数据' };
    // }, 2000);
  }

  onBeforeUnmount(e): void {
    console.log('child-vite 卸载了', e);
  }

  onAfterUnmount(e): void {
    console.log('child-vite 卸载完成', e);
  }

  onEvent(e) {
    console.log('onEvent', e);
  }

  handleDataChange(e): void {
    console.log('来自子应用 child-vite 的数据:', e.detail.data);
  }
}
