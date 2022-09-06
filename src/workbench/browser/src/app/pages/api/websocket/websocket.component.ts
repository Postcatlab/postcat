import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { io } from 'socket.io-client';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { StorageService } from '../../../shared/services/storage';
import { MessageService } from '../../../shared/services/message';

@Component({
  selector: 'websocket-content',
  template: `<div class="h-full">
    <eo-split-panel [topStyle]="{ height: '350px' }">
      <div top class="h-full overflow-auto">
        <header class="flex p-4">
          <nz-select class="!w-[106px] flex-none" [(ngModel)]="model.request.protocol">
            <nz-option *ngFor="let item of WS_PROTOCOL" [nzLabel]="item.key" [nzValue]="item.value"></nz-option>
          </nz-select>
          <input
            type="text"
            i18n-placeholder
            placeholder="Enter URL"
            [(ngModel)]="model.request.uri"
            name="uri"
            nz-input
          />
          <div class="flex px-1">
            <button class="mx-1 w-28" *ngIf="!isConnect" nz-button nzType="primary" (click)="handleConnect(true)">
              Connect
            </button>
            <button
              class="mx-1 w-28"
              *ngIf="isConnect"
              nzDanger
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
            <eo-api-test-header
              class="eo_theme_iblock bbd"
              [(model)]="model.request.requestHeaders"
              (modelChange)="emitChangeFun('requestHeaders')"
            ></eo-api-test-header>
          </nz-tab>
          <nz-tab [nzTitle]="queryTitleTmp" [nzForceRender]="true">
            <ng-template #queryTitleTmp>
              <span i18n>Query Params</span>
            </ng-template>
            <eo-api-test-query
              class="eo_theme_iblock bbd"
              [model]="model.queryParams"
              (modelChange)="emitChangeFun('queryParams')"
            ></eo-api-test-query>
          </nz-tab>
          <nz-tab [nzTitle]="messageTmp">
            <ng-template #messageTmp>Message</ng-template>
            <div>
              <eo-monaco-editor
                [(code)]="msg"
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
                <button
                  nz-button
                  class="mx-1"
                  nzType="primary"
                  [disabled]="!isConnect || !msg"
                  (click)="handleSendMsg()"
                >
                  Send
                </button>
              </div>
            </div>
          </nz-tab>
        </nz-tabset>
        <div class="h-8 top-line"></div>
        <!-- body -->
      </div>
      <!-- response -->
      <nz-tabset
        bottom
        [nzTabBarStyle]="{ 'padding-left': '10px' }"
        [nzAnimated]="false"
        [(nzSelectedIndex)]="model.responseTabIndex"
      >
        <nz-tab [nzTitle]="messageTmp" [nzForceRender]="true">
          <ng-template #messageTmp>
            <span i18n>Message</span>
          </ng-template>
          <ul class="p-4">
            <li *ngFor="let msg of model.response.responseBody">{{ msg }}</li>
          </ul>
        </nz-tab>
        <nz-tab [nzTitle]="resHeaderTmp" [nzForceRender]="true">
          <ng-template #resHeaderTmp>
            <span i18n>Response Headers</span>
          </ng-template>
          <div class="p-4">
            <pre
              >{{ resHeader }}
        </pre
            >
          </div>
        </nz-tab>
        <nz-tab [nzTitle]="reqHeaderTmp" [nzForceRender]="true">
          <ng-template #reqHeaderTmp>
            <span i18n>Request Headers</span>
          </ng-template>
          <div class="p-4">
            <pre>{{ reqHeader }}</pre>
          </div>
        </nz-tab>
      </nz-tabset>
    </eo-split-panel>
  </div>`,
  styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnInit {
  @Input() model = this.resetModel();
  @Input() bodyType = 'json';
  @Output() modelChange = new EventEmitter<any>();
  isConnect = false;
  socket = null;
  msg = '';
  reqHeader = '';
  resHeader = '';
  WS_PROTOCOL = [
    { value: 'ws', key: 'WS' },
    { value: 'wss', key: 'WSS' },
  ];
  editorConfig = {
    language: 'json',
  };
  constructor(private storage: StorageService, private message: MessageService) {}
  ngOnInit() {
    // * 通过 SocketIO 通知后端
    this.socket = io('ws://localhost:3008', { transports: ['websocket'] });
    // receive a message from the server
    this.socket.on('ws-client', (...args) => {});
  }
  private resetModel() {
    return {
      requestTabIndex: 2,
      responseTabIndex: 0,
      request: {
        requestHeaders: [],
        requestBodyJsonType: '',
        requestBody: '',
        method: 'WS',
        protocol: 'ws',
        uri: 'ws://106.12.149.147:3782',
      },
      response: {
        responseHeaders: [],
        responseBodyType: 'string',
        responseBody: [],
      },
      queryParams: [],
    };
  }
  rawDataChange(e) {
    console.log('rawDataChange', e);
  }
  changeQuery() {
    this.model.request.uri = transferUrlAndQuery(this.model.request.uri, this.model.queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
  }
  emitChangeFun(where) {
    if (where === 'queryParams') {
      this.changeQuery();
    }
    this.modelChange.emit(this.model);
  }
  handleConnect(bool = false) {
    if (this.socket == null) {
      console.log('通信未就绪');
      return;
    }
    const { responseTabIndex, requestTabIndex, ...data } = this.model;
    if (!bool) {
      // * save to test history
      this.storage.run('apiTestHistoryCreate', [{ projectID: 1, apiDataID: 1, ...data }], async (result) => {
        if (result.status === 200) {
          // console.log('save to test history');
          this.message.send({ type: 'updateHistory', data: {} });
        }
      });
      this.isConnect = false;
      return;
    }
    const wsUrl = this.model.request.uri;
    if (wsUrl === '') {
      console.log('Websocket 地址为空');
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-connect', content: data });
    this.listen();
  }
  handleSendMsg() {
    // * 通过 SocketIO 通知后端
    // send a message to the server
    // console.log(JSON.stringify(this.model));
    if (!this.msg) {
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-message', content: { message: this.msg } });
    this.model.response.responseBody.push(this.msg);
    this.msg = '';
  }
  listen() {
    // * 无论是否连接成功，都清空发送历史
    this.model.response.responseBody = [];
    if (this.socket == null) {
      console.log('通信未连接');
    }
    this.socket.on('ws-client', ({ type, status, content }) => {
      if (type === 'ws-connect-back' && status === 0) {
        this.isConnect = true;
        this.model.requestTabIndex = 2;
        const { reqHeader, resHeader } = content;
        const json2String = (data) =>
          Object.entries(data).reduce((total, [name, value]) => `${name}: ${value}\n${total}`, '');
        this.reqHeader = json2String(reqHeader);
        this.resHeader = json2String(resHeader);
      }
      if (type === 'ws-message-back' && status === 0) {
        this.model.response.responseBody.push(content);
      }
    });
  }
}
