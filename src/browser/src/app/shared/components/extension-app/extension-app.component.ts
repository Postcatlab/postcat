import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
@Component({
  selector: 'extension-app',
  template: `
    <nz-spin
      [nzSpinning]="isSpinning"
      [nzSize]="'large'"
      style="transform: translate(0)"
      class="extension-app w-full h-full overflow-hidden relative"
    >
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
        (load)="onAppload()"
      ></iframe>
    </nz-spin>
  `,
  styles: [
    `
      :host ::ng-deep .ant-spin-container {
        height: 100%;
      }
    `
  ]
})
export class ExtensionAppComponent implements OnInit, OnDestroy {
  @ViewChild('extensionApp') extensionApp: ElementRef;

  @Input() name = ``;
  @Input() url = ``;
  @Input() type: 'micro-app' | 'iframe';

  iframeWin: Window;
  safeUrl: SafeResourceUrl;
  retryCount = 0;
  isSpinning = true;

  microAppData = { msg: '来自基座的数据' };

  constructor(private sanitizer: DomSanitizer, public route: ActivatedRoute, private extension: ExtensionService) {}

  ngOnInit(): void {
    this.initSidebarViewByRoute();

    window.addEventListener('message', this.receiveMessage, false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.receiveMessage, false);
  }

  onAppload() {
    requestIdleCallback(() => {
      this.isSpinning = false;
    });
  }

  initSidebarViewByRoute() {
    this.route.params.subscribe(async data => {
      if (data.extName) {
        this.name = data.extName;
        const sidebar = await this.extension.getSidebarView(data.extName);
        this.url = sidebar.url;
        this.type = sidebar.useIframe ? 'iframe' : 'micro-app';
        if (sidebar.useIframe) {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
      }
    });
  }

  receiveMessage = async event => {
    const { data, origin } = event;
    const target = data.namePath?.split('.')?.reduce((p, c) => p?.[c], window.eo);
    if (data.msgID) {
      console.log('data.data', data.data);
      const res = typeof target === 'function' ? await target(...data.data) : target;
      this.iframeWin.postMessage(
        {
          msgID: data.msgID,
          data: target ? res : `调用路径[${data.namePath}]不存在`
        },
        origin
      );
    } else if (data === 'EOAPI_EXT_APP') {
      //TODO compatible with old version
      this.iframeWin = this.extensionApp?.nativeElement?.contentWindow;
      this.iframeWin.postMessage('EOAPI_MESSAGE', '*');
    } else if (data === 'POSTCAT_EXT_APP') {
      this.iframeWin = this.extensionApp?.nativeElement?.contentWindow;
      this.iframeWin.postMessage('POSTCAT_MESSAGE', '*');
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
