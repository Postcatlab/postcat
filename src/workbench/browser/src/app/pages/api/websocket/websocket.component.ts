import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { io } from 'socket.io-client';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { MessageService } from '../../../shared/services/message';
import { ApiTestService } from '../../../pages/api/http/test/api-test.service';

@Component({
  selector: 'websocket-content',
  template: `<div class="h-full">
    <header class="flex p-[10px]">
      <div>
        <nz-select class="!w-[106px]" [disabled]="isConnect" [(ngModel)]="model.request.protocol">
          <nz-option *ngFor="let item of WS_PROTOCOL" [nzLabel]="item.key" [nzValue]="item.value"></nz-option>
        </nz-select>
      </div>
      <form nz-form [formGroup]="validateForm" class="flex-1">
        <nz-form-item nz-col>
          <nz-form-control
            [nzValidateStatus]="this.validateForm.controls.uri"
            i18n-nzErrorTip
            nzErrorTip="Please enter URL"
          >
            <input
              type="text"
              i18n-placeholder
              placeholder="Enter URL"
              formControlName="uri"
              [disabled]="isConnect"
              [(ngModel)]="model.request.uri"
              class="left-1"
              name="uri"
              nz-input
            />
          </nz-form-control>
        </nz-form-item>
      </form>

      <div class="flex px-1">
        <button class="mx-1 w-28" *ngIf="isConnect === false" nz-button nzType="primary" (click)="handleConnect(true)">
          Connect
        </button>
        <button class="mx-1 w-28" *ngIf="isConnect === null" nz-button nzType="default" (click)="handleConnect(null)">
          Connecting
        </button>
        <button
          class="mx-1 w-28"
          *ngIf="isConnect === true"
          nz-button
          nzDanger
          nzType="default"
          (click)="handleConnect(false)"
        >
          Disconnect
        </button>
      </div>
    </header>

    <eo-split-panel [topStyle]="{ height: '300px' }" style="height: calc(100% - 56px)">
      <div top class="h-full ">
        <nz-tabset
          [nzTabBarStyle]="{ 'padding-left': '10px' }"
          [nzAnimated]="false"
          [(nzSelectedIndex)]="model.requestTabIndex"
          class="h-full"
        >
          <!-- Request Headers -->
          <nz-tab [nzTitle]="headerTitleTmp" [nzForceRender]="true">
            <ng-template #headerTitleTmp>
              <span
                i18n="@@RequestHeaders"
                nz-tooltip
                [nzTooltipTitle]="isConnect ? 'Editable only before connection' : ''"
                >Headers</span
              >
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
              <span i18n nz-tooltip [nzTooltipTitle]="isConnect ? 'Editable only before connection' : ''"
                >Query Params</span
              >
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
      <section bottom class="h-full">
        <div class="flex items-center justify-between p-3">
          <span class="font-bold">Messages</span>
          <span class="font-semibold px-2 py-1 status" [ngClass]="'status_' + renderStatus(isConnect)">{{
            renderStatus(isConnect)
          }}</span>
        </div>
        <ul class="p-2   overflow-auto" style="height: calc(100% - 48px)">
          <li *ngFor="let item of model.response.responseBody; let index = index" class="block w-full">
            <div (click)="expandMessage(index)" class="flex flex-col top-line w-full text-gray-500">
              <div
                *ngIf="item.type === 'send'"
                class="inline-flex items-center py-3 px-2 truncate hover:bg-gray-100 hover:cursor-pointer"
              >
                <span class="h-5 w-5 flex shrink-0 items-cente justify-center rounded send_icon">
                  <eo-iconpark-icon name="arrow-up" size="10"></eo-iconpark-icon>
                </span>
                <div class="px-2">{{ item.msg }}</div>
              </div>
              <div
                *ngIf="item.type === 'get'"
                class="inline-flex items-center py-3 px-2 truncate hover:bg-gray-100 hover:cursor-pointer"
              >
                <span class="h-5 w-5 flex shrink-0 items-cente justify-center rounded get_icon">
                  <eo-iconpark-icon name="arrow-down" size="10"></eo-iconpark-icon>
                </span>
                <div class="px-2">{{ item.msg }}</div>
              </div>
              <div
                *ngIf="item.type === 'start'"
                class="inline-flex items-center py-3 px-2 hover:bg-gray-100 hover:cursor-pointer"
              >
                <span class="h-5 w-5 flex items-cente justify-center box-border rounded-full start_icon">
                  <eo-iconpark-icon name="check-small" size="10"></eo-iconpark-icon>
                </span>
                <div class="px-2">{{ item.title }}</div>
              </div>
              <div
                *ngIf="item.type === 'end'"
                class="inline-flex items-center py-3 px-2 hover:bg-gray-100 hover:cursor-pointer"
              >
                <span class="h-5 w-5 flex items-cente justify-center box-border rounded-full end_icon">
                  <eo-iconpark-icon name="close-small" size="10"></eo-iconpark-icon>
                </span>
                <div class="px-2">{{ item.title || item.msg }}</div>
              </div>
            </div>

            <eo-monaco-editor
              *ngIf="item.isExpand"
              [code]="item.msg"
              [disabled]="true"
              [config]="{
                language: 'json',
                readOnly: true
              }"
              [maxLine]="20"
              [eventList]="['type', 'format', 'copy', 'search']"
              (codeChange)="rawDataChange($event)"
            >
            </eo-monaco-editor>
          </li>
        </ul>
      </section>
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
  model: any = this.resetModel();
  WS_PROTOCOL = [
    { value: 'ws', key: 'WS' },
    { value: 'wss', key: 'WSS' },
  ];
  editorConfig = {
    language: 'json',
  };
  validateForm!: FormGroup;
  constructor(
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private testService: ApiTestService,
    private message: MessageService
  ) {}
  async ngOnInit() {
    {
      const id = this.route.snapshot.queryParams.uuid;
      if (id && id.includes('history_')) {
        const historyData = await this.testService.getHistory(Number(id.replace('history_', '')));
        this.model = historyData;
        // const history = this.apiTestUtil.getTestDataFromHistory(historyData);
      }
    }
    this.message.get().subscribe(async ({ type, data }) => {
      if (type === 'ws-test-history') {
        const id = this.route.snapshot.queryParams.uuid;
        if (id && id.includes('history_')) {
          const historyData = await this.testService.getHistory(Number(id.replace('history_', '')));
          this.model = historyData;
          // const history = this.apiTestUtil.getTestDataFromHistory(historyData);
        }
        this.model = data;
      }
    });
    this.validateForm = this.fb.group({
      uri: [this.model.request.uri, [Validators.required]],
    });
    // * 通过 SocketIO 通知后端
    this.socket = io('ws://localhost:3008', { transports: ['websocket'] });
    // receive a message from the server
    this.socket.on('ws-client', (...args) => {});
  }
  private resetModel() {
    return {
      requestTabIndex: 2,
      request: {
        requestHeaders: [],
        requestBodyJsonType: '',
        requestBody: '',
        method: 'WS',
        protocol: 'ws',
        uri: '',
      },
      response: {
        responseHeaders: [],
        responseBodyType: 'string',
        responseBody: [],
      },
      queryParams: [],
    };
  }
  private checkForm(): boolean {
    console.log(this.validateForm);
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === 'INVALID') {
      return false;
    }
    return true;
  }
  expandMessage(index) {
    const status = this.model.response.responseBody[index].isExpand;
    this.model.response.responseBody[index].isExpand = status == null ? true : !status;
  }
  renderStatus(status) {
    const hash = new Map().set(true, 'Connected').set(false, 'Disconnect').set(null, 'Connecting');
    return hash.get(status);
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
    const isOK = this.checkForm();
    if (!isOK) {
      return;
    }
    if (bool == null) {
      this.isConnect = null;
      return;
    }
    if (this.socket == null) {
      console.log('communication is not ready');
      return;
    }
    const { requestTabIndex, ...data } = this.model;
    if (!bool) {
      // * save to test history
      const res = await this.testService.addHistory(data, Date.now().toString().slice(-5));
      if (res) {
        this.message.send({ type: 'updateHistory', data: {} });
      }
      this.socket.emit('ws-server', { type: 'ws-disconnect', content: {} });
      this.socket.off('ws-client');
      this.model.response.responseBody.unshift({
        type: 'end',
        msg: 'Disconnect from ' + this.model.request.uri,
        isExpand: false,
      });
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
    this.model.response.responseBody.unshift({ type: 'send', msg: this.msg, isExpand: false });
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
      if (type === 'ws-connect-back') {
        if (status === 0) {
          this.isConnect = true;
          this.model.requestTabIndex = 2;
          const { reqHeader, resHeader } = content;
          this.model.response.responseBody.unshift({
            type: 'start',
            msg: JSON.stringify(
              {
                'Request Headers': reqHeader,
                'Response Headers': resHeader,
              },
              null,
              2
            ),
            title: 'Connected to ' + this.model.request.uri,
            isExpand: false,
          });
        } else {
          this.model.response.responseBody.unshift({
            type: 'end',
            msg: content,
            title: 'Connected to ' + this.model.request.uri + ` is failed`,
            isExpand: false,
          });
        }
      }
      if (type === 'ws-message-back' && status === 0) {
        this.model.response.responseBody.unshift({ type: 'get', msg: content, isExpand: false });
      }
    });
  }
}
