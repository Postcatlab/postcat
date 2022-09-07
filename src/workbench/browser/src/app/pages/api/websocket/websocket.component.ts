import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { StorageService } from '../../../shared/services/storage';
import { MessageService } from '../../../shared/services/message';
import { ApiTestService } from '../../../pages/api/http/test/api-test.service';

@Component({
  selector: 'websocket-content',
  template: `<div class="h-full">
    <eo-split-panel [topStyle]="{ height: '300px' }">
      <div top class="h-full overflow-auto">
        <header class="flex p-4">
          <nz-select class="!w-[106px] flex-none" [disabled]="isConnect" [(ngModel)]="model.request.protocol">
            <nz-option *ngFor="let item of WS_PROTOCOL" [nzLabel]="item.key" [nzValue]="item.value"></nz-option>
          </nz-select>
          <input
            type="text"
            i18n-placeholder
            placeholder="Enter URL"
            [(ngModel)]="model.request.uri"
            [disabled]="isConnect"
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
            <fieldset [disabled]="isConnect">
              <eo-api-test-header
                class="eo_theme_iblock bbd"
                [(model)]="model.request.requestHeaders"
                (modelChange)="emitChangeFun('requestHeaders')"
              ></eo-api-test-header>
            </fieldset>
          </nz-tab>
          <nz-tab [nzTitle]="queryTitleTmp" [nzForceRender]="true">
            <ng-template #queryTitleTmp>
              <span i18n>Query Params</span>
            </ng-template>
            <fieldset [disabled]="isConnect">
              <eo-api-test-query
                class="eo_theme_iblock bbd"
                [model]="model.queryParams"
                (modelChange)="emitChangeFun('queryParams')"
              ></eo-api-test-query>
            </fieldset>
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
            <li *ngFor="let item of model.response.responseBody" class="flex bottom-line">
              <div *ngIf="item.type === 'send'" class="inline-flex items-center text-gray-400 text-xs my-1">
                <eo-iconpark-icon name="arrow-up" size="12"></eo-iconpark-icon>
                <div class="px-2 text-gray-500">{{ item.msg }}</div>
              </div>
              <div *ngIf="item.type === 'get'" class="inline-flex items-center text-green-700 text-xs my-1">
                <eo-iconpark-icon name="arrow-down" size="12"></eo-iconpark-icon>
                <div class="px-2 text-green-600">{{ item.msg }}</div>
              </div>
            </li>
          </ul>
        </nz-tab>
        <nz-tab [nzTitle]="resHeaderTmp" [nzForceRender]="true">
          <ng-template #resHeaderTmp>
            <span i18n>Response Headers</span>
          </ng-template>
          <eo-api-test-result-header [model]="resHeader"></eo-api-test-result-header>
        </nz-tab>
        <nz-tab [nzTitle]="reqHeaderTmp" [nzForceRender]="true">
          <ng-template #reqHeaderTmp>
            <span i18n>Request Headers</span>
          </ng-template>
          <eo-api-test-result-header [model]="reqHeader"></eo-api-test-result-header>
        </nz-tab>
      </nz-tabset>
    </eo-split-panel>
  </div>`,
  styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnInit {
  @Input() bodyType = 'json';
  @Output() modelChange = new EventEmitter<any>();
  isConnect = false;
  socket = null;
  msg = '';
  reqHeader = [];
  resHeader = [];
  model: any = this.resetModel();
  WS_PROTOCOL = [
    { value: 'ws', key: 'WS' },
    { value: 'wss', key: 'WSS' },
  ];
  editorConfig = {
    language: 'json',
  };
  constructor(
    private storage: StorageService,
    public route: ActivatedRoute,
    private testService: ApiTestService,
    private message: MessageService
  ) {}
  async ngOnInit() {
    const id = this.route.snapshot.queryParams.uuid;
    if (id && id.includes('history_')) {
      const historyData = await this.testService.getHistory(Number(id.replace('history_', '')));
      console.log('historyData', historyData);
      this.model = historyData;
      // const history = this.apiTestUtil.getTestDataFromHistory(historyData);
    }
    this.message.get().subscribe(({ type, data }) => {
      if (type === 'ws-test-history') {
        this.model = data;
      }
    });
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
  async handleConnect(bool = false) {
    if (this.socket == null) {
      console.log('communication is not ready');
      return;
    }
    const { responseTabIndex, requestTabIndex, ...data } = this.model;
    if (!bool) {
      // * save to test history
      const res = await this.testService.addHistory(data, Date.now().toString().slice(-5));
      if (res) {
        this.message.send({ type: 'updateHistory', data: {} });
      }
      this.socket.emit('ws-server', { type: 'ws-disconnect', content: {} });
      this.socket.off('ws-client');
      this.isConnect = false;
      return;
    }
    const wsUrl = this.model.request.uri;
    if (wsUrl === '') {
      console.log('Websocket URL is empty');
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-connect', content: data });
    this.listen();
  }
  handleSendMsg() {
    // * 通过 SocketIO 通知后端
    // send a message to the server
    if (!this.msg) {
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-message', content: { message: this.msg } });
    this.model.response.responseBody.push({ type: 'send', msg: this.msg });
    this.msg = '';
  }
  listen() {
    // * 无论是否连接成功，都清空发送历史
    this.model.response.responseBody = [];
    if (this.socket == null) {
      console.log('communication is no ready');
      return;
    }
    this.socket.on('ws-client', ({ type, status, content }) => {
      if (type === 'ws-connect-back' && status === 0) {
        this.isConnect = true;
        this.model.requestTabIndex = 2;
        const { reqHeader, resHeader } = content;
        const json2Array = (data) =>
          Object.entries(data).reduce((total, [name, value]) => [{ name, value }].concat(total), []);
        this.reqHeader = json2Array(reqHeader);
        this.resHeader = json2Array(resHeader);
      }
      if (type === 'ws-message-back' && status === 0) {
        this.model.response.responseBody.push({ type: 'get', msg: content });
      }
    });
  }
}
