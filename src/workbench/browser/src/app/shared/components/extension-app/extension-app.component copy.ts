import { Component, Input, OnInit } from '@angular/core';
import { EventCenterForMicroApp } from '@micro-zoe/micro-app';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import microApp from '@micro-zoe/micro-app';
import { ActivatedRoute } from '@angular/router';
import { GlobalProvider } from './globalProvider';

(window as any).eventCenterForAppNameVite = new EventCenterForMicroApp('appname-extension-app');

@Component({
  selector: 'extension-app',
  template: `
    <div style="transform: translate(0)">
      <ngx-wujie
        *ngIf="url"
        width="100%"
        height="100%"
        [name]="name"
        [exec]="true"
        url="https://www.baidu.com/"
        (beforeLoad)="onBeforeLoad($event)"
        (beforeMount)="onBeforeMount($event)"
        (afterMount)="onAfterMount($event)"
        (beforeUnmount)="onBeforeUnmount($event)"
        (afterUnmount)="onAfterUnmount($event)"
        (event)="onEvent($event)"
      ></ngx-wujie>
    </div>
  `,
})
export class ExtensionAppComponent implements OnInit {
  @Input() name = ``;
  @Input() url = ``;
  microAppData = { msg: '来自基座的数据' };

  constructor(private storage: StorageService, public route: ActivatedRoute, private globalProvider: GlobalProvider) {}

  ngOnInit(): void {
    this.globalProvider.injectGlobalData();
    this.initSidebarViewByRoute();
  }

  initSidebarViewByRoute() {
    this.route.params.subscribe(async (data) => {
      if (data.extName && window.eo?.getSidebarView) {
        this.name = data.extName;
        const sidebar = await window.eo?.getSidebarView?.(data.extName);
        this.url = sidebar.url;
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
