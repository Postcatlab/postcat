import { OnDestroy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EventCenterForMicroApp } from '@micro-zoe/micro-app';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import microApp from '@micro-zoe/micro-app';
import { ActivatedRoute } from '@angular/router';
import { GlobalProvider } from './globalProvider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

(window as any).eventCenterForAppNameVite = new EventCenterForMicroApp('appname-extension-app');

@Component({
  selector: 'extension-app-iframe',
  template: `
    <iframe
      *ngIf="safeUrl"
      #extensionApp
      width="100%"
      height="100%"
      class="border-none"
      [name]="name"
      [src]="safeUrl"
      (beforeLoad)="onBeforeLoad($event)"
      (beforeMount)="onBeforeMount($event)"
      (afterMount)="onAfterMount($event)"
      (beforeUnmount)="onBeforeUnmount($event)"
      (afterUnmount)="onAfterUnmount($event)"
      (load)="onLoad()"
    ></iframe>
  `,
})
export class ExtensionAppIframeComponent implements OnInit, OnDestroy {
  @ViewChild('extensionApp') extensionApp: ElementRef;

  @Input() name = ``;
  @Input() url = ``;

  microAppData = { msg: '来自基座的数据' };
  safeUrl: SafeResourceUrl;
  retryCount = 0;
  iframeWin: Window;

  constructor(public sanitizer: DomSanitizer, public route: ActivatedRoute, private globalProvider: GlobalProvider) {}

  ngOnInit(): void {
    this.globalProvider.injectGlobalData();
    this.initSidebarViewByRoute();

    window.addEventListener('message', this.receiveMessage, false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.receiveMessage, false);
  }

  receiveMessage = async (event) => {
    const { data, origin } = event;
    if (data.msgID && window.eo[data.name]) {
      const res = await window.eo[data.name](...data.data);
      this.iframeWin.postMessage(
        {
          msgID: data.msgID,
          data: res,
        },
        origin
      );
    }
  };

  onLoad(): void {
    this.injectByContentWindow();
    console.log('麻了');
  }
  // 方式一(手动将全局变量挂载到子应用Window上)
  injectByContentWindow = () => {
    // 这里只是为了确保变量一定成功被挂载到子应用Window上
    setTimeout(() => {
      if (this.retryCount++ > 5) {
        return;
      }
      this.iframeWin = this.extensionApp?.nativeElement?.contentWindow;
      if (this.iframeWin) {
        this.iframeWin.postMessage('EOAPI_MESSAGE', '*');
        // this.iframeWin.__POWERED_BY_EOAPI__ = true;
        // this.iframeWin.eo = window.eo;
        // // 这里主要为了解决iframe页面刷新后，window对象被重新实例化导致主应用挂载的变量丢失
        // this.iframeWin.addEventListener('pagehide', () => {
        //   // iframe页面刷新后需要重新对其设置全局变量
        //   this.injectByContentWindow();
        // });
        this.retryCount = 0;
      } else {
        this.injectByContentWindow();
      }
    });
  };
  // 方式二（由于加载顺序不固定，注入的脚步可能会被干掉）
  insetScript = () => {
    const iframeDoc = this.extensionApp.nativeElement.contentDocument;
    const script = iframeDoc.createElement('script');
    script.textContent = `
                  window.__POWERED_BY_EOAPI__ = true;
                  window.eo = window.parent.eo
                  `;

    iframeDoc.head.prepend(script);
  };

  initSidebarViewByRoute() {
    this.route.params.subscribe(async (data) => {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:3000/');
      if (data.extName && window.eo?.getSidebarView) {
        this.name = data.extName;
        const sidebar = await window.eo?.getSidebarView?.(data.extName);
        this.url = sidebar.url;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      }
    });
  }

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
