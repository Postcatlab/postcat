import { Component, Input, OnInit } from '@angular/core';
import { EventCenterForMicroApp } from '@micro-zoe/micro-app';

(window as any).eventCenterForAppNameVite = new EventCenterForMicroApp('appname-custom-tab');

@Component({
  selector: 'eo-custom-tab',
  template: `
    <micro-app
      name="appname-custom-tab"
      [attr.url]="url"
      [data]="microAppData"
      (created)="handleCreate()"
      (beforemount)="handleBeforeMount()"
      (mounted)="handleMount()"
      (unmount)="handleUnmount()"
      (error)="handleError()"
      (datachange)="handleDataChange($event)"
    ></micro-app>
  `,
})
export class CustomTabComponent implements OnInit {
  url = `http://127.0.0.1:8080`;

  constructor() {}

  ngOnInit(): void {}

  microAppData = { msg: '来自基座的数据' };

  /**
   * vite 子应用因为沙箱关闭，数据通信功能失效
   */
  handleCreate(): void {
    console.log('child-vite 创建了');
  }

  handleBeforeMount(): void {
    console.log('child-vite 即将被渲染');
  }

  handleMount(): void {
    console.log('child-vite 已经渲染完成');

    setTimeout(() => {
      this.microAppData = { msg: '来自基座的新数据' };
    }, 2000);
  }

  handleUnmount(): void {
    console.log('child-vite 卸载了');
  }

  handleError(): void {
    console.log('child-vite 加载出错了');
  }

  handleDataChange(e): void {
    console.log('来自子应用 child-vite 的数据:', e.detail.data);
  }
}
