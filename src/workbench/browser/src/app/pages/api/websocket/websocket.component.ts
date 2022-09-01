import { Component, OnInit, Input } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'websocket-content',
  template: `<div>
    <div class="flex p-4">
      <nz-select class="!w-[106px] flex-none" [(ngModel)]="model">
        <nz-option *ngFor="let item of WS_PROTOCOL" [nzLabel]="item.key" [nzValue]="item.value"></nz-option>
      </nz-select>
      <input type="text" i18n-placeholder placeholder="Enter URL" [(ngModel)]="wsUrl" name="uri" nz-input />
      <div class="flex px-2">
        <button *ngIf="!isConnect" nz-button nzType="primary" (click)="handleConnect(true)">Connect</button>
        <button *ngIf="isConnect" nzDanger nz-button nzType="primary" (click)="handleConnect(false)">Disconnect</button>
      </div>
    </div>
    <input nz-input placeholder="Message ..." [(ngModel)]="msg" nzSize="default" />
    <button nz-button nzType="primary" [disabled]="!isConnect" (click)="handleSendMsg()">Send</button>
    <ul>
      <li *ngFor="let m of msgList">{{ m }}</li>
    </ul>
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
        method: 'ws',
      },
      beforeScript: '',
      afterScript: '',
      testResult: {
        response: {},
        request: {},
      },
    };
  }
  handleConnect(bool = false) {
    if (!bool) {
      this.socket = null;
      return;
    }
    if (this.socket == null) {
      console.log('连接未就绪');
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
