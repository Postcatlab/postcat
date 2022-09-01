import { Component, OnInit, Input } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'websocket-content',
  template: `<div>
    <header class="flex p-4">
      <nz-select class="!w-[106px] flex-none" [(ngModel)]="model.request.protocol">
        <nz-option *ngFor="let item of WS_PROTOCOL" [nzLabel]="item.key" [nzValue]="item.value"></nz-option>
      </nz-select>
      <input type="text" i18n-placeholder placeholder="Enter URL" [(ngModel)]="wsUrl" name="uri" nz-input />
      <div class="flex px-1">
        <button class="mx-1 w-28" *ngIf="!isConnect" nz-button nzType="primary" (click)="handleConnect(true)">
          Connect
        </button>
        <button
          class="mx-1 w-28"
          *ngIf="isConnect"
          nzDanger
          [disabled]="!msg"
          nz-button
          nzType="primary"
          (click)="handleConnect(false)"
        >
          Disconnect
        </button>
      </div>
    </header>
    <nz-tabset
      [nzTabBarStyle]="{ 'padding-left': '10px' }"
      [nzAnimated]="false"
      [(nzSelectedIndex)]="model.requestTabIndex"
    >
      <!-- Request Headers -->
      <nz-tab [nzTitle]="headerTitleTmp" [nzForceRender]="true">
        <ng-template #headerTitleTmp>
          <span i18n="@@RequestHeaders">Headers</span>
        </ng-template>
      </nz-tab>
      <nz-tab [nzTitle]="queryTitleTmp" [nzForceRender]="true">
        <ng-template #queryTitleTmp>
          <span i18n>Query Params</span>
        </ng-template>
      </nz-tab>
    </nz-tabset>
    <!-- body -->
    <div>
      <eo-monaco-editor
        [(code)]="model.beforeScript"
        [config]="editorConfig"
        [maxLine]="20"
        [eventList]="['type', 'format', 'copy', 'search', 'replace']"
        (codeChange)="rawDataChange($event)"
      >
      </eo-monaco-editor>
      <div class="flex justify-between p-2">
        <nz-select [(ngModel)]="editorConfig.language">
          <nz-option nzValue="text" nzLabel="text"></nz-option>
          <nz-option nzValue="xml" nzLabel="xml"></nz-option>
          <nz-option nzValue="json" nzLabel="json"></nz-option>
        </nz-select>
        <button nz-button class="mx-1" nzType="primary" [disabled]="!isConnect" (click)="handleSendMsg()">Send</button>
      </div>
    </div>
    <!-- response -->
    <nz-tabset
      [nzTabBarStyle]="{ 'padding-left': '10px' }"
      [nzAnimated]="false"
      [(nzSelectedIndex)]="model.requestTabIndex"
    >
      <nz-tab [nzTitle]="messageTmp" [nzForceRender]="true">
        <ng-template #messageTmp>
          <span i18n>Message</span>
        </ng-template>
        <ul>
          <li *ngFor="let m of msgList">{{ m }}</li>
        </ul>
      </nz-tab>
      <nz-tab [nzTitle]="resHeaderTmp" [nzForceRender]="true">
        <ng-template #resHeaderTmp>
          <span i18n>Response Headers</span>
        </ng-template>
      </nz-tab>
      <nz-tab [nzTitle]="reqHeaderTmp" [nzForceRender]="true">
        <ng-template #reqHeaderTmp>
          <span i18n>Request Headers</span>
        </ng-template>
      </nz-tab>
    </nz-tabset>
  </div>`,
  styleUrls: [],
})
export class WebsocketComponent implements OnInit {
  @Input() model = this.resetModel();
  isConnect = false;
  wsUrl = 'ws://106.12.149.147:3782';
  socket = null;
  msg = '';
  msgList = [];
  WS_PROTOCOL = [
    { value: 'ws', key: 'WS' },
    { value: 'wss', key: 'WSS' },
  ];
  editorConfig = {
    language: 'json',
  };
  constructor() {}
  ngOnInit() {
    // * 通过 SocketIO 通知后端
    this.socket = io('ws://localhost:3008', { transports: ['websocket'] });
    // receive a message from the server
    this.socket.on('ws-client', (...args) => {
      console.log('链接成功', args);
    });
  }
  private resetModel() {
    return {
      requestTabIndex: 1,
      responseTabIndex: 0,
      request: {
        protocol: 'ws',
      },
      beforeScript: '',
      afterScript: '',
      testResult: {
        response: {},
        request: {},
      },
    };
  }
  rawDataChange(e) {
    console.log('rawDataChange', e);
  }
  handleConnect(bool = false) {
    if (this.socket == null) {
      console.log('通信未就绪');
      return;
    }
    if (!bool) {
      this.isConnect = false;
      return;
    }
    if (this.wsUrl === '') {
      console.log('Websocket 地址为空');
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-connect', content: { url: this.wsUrl } });
    this.listen();
  }
  handleSendMsg() {
    // * 通过 SocketIO 通知后端
    // send a message to the server
    if (!this.msg) {
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-message', content: { message: this.msg } });
    this.msg = '';
  }
  listen() {
    if (this.socket == null) {
      console.log('通信未连接');
    }
    this.socket.on('ws-client', ({ type, status, content }) => {
      if (type === 'ws-connect-back' && status === 0) {
        this.isConnect = true;
      }
      if (type === 'ws-message-back' && status === 0) {
        console.log(content);
        this.msgList.push(content);
      }
    });
  }
}
