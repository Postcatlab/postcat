import { Component, OnInit, Output, OnDestroy, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

import { io } from 'socket.io-client';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { MessageService } from '../../../shared/services/message';
import { ApiTestService } from '../../../pages/api/http/test/api-test.service';
import { Subject, takeUntil } from 'rxjs';
import { isEmptyObj } from 'eo/workbench/browser/src/app/utils';
import { ApiTestHeaders, ApiTestQuery } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.model';
interface testViewModel {
  requestTabIndex: number;
  protocol: string;
  msg: string;
  request: {
    requestHeaders: ApiTestHeaders[];
    uri: string;
    protocol: 'ws' | 'wss' | string;
    queryParams: ApiTestQuery[];
  };
  response: {
    requestHeaders: ApiTestHeaders[];
    responseHeaders: ApiTestHeaders[];
    responseBody: any;
  };
}
@Component({
  selector: 'websocket-content',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnInit, OnDestroy {
  @Input() bodyType = 'json';
  @Output() modelChange = new EventEmitter<testViewModel>();
  @Output() eoOnInit = new EventEmitter<testViewModel>();
  isConnect = false;
  socket = null;
  model: testViewModel;
  WS_PROTOCOL = [
    { value: 'ws', key: 'WS' },
    { value: 'wss', key: 'WSS' },
  ];
  editorConfig = {
    language: 'json',
  };
  validateForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private testService: ApiTestService,
    private message: MessageService
  ) {
    this.initBasicForm();
  }
  async init() {
    if (!this.model || isEmptyObj(this.model)) {
      this.model = this.resetModel();
      const id = this.route.snapshot.queryParams.uuid;
      if (id && id.includes('history_')) {
        const historyData: unknown = await this.testService.getHistory(Number(id.replace('history_', '')));
        this.model = historyData as testViewModel;
      }
      console.log(this.model);
    }
    this.watchBasicForm();
    this.eoOnInit.emit(this.model);
  }
  async ngOnInit() {
    // * 通过 SocketIO 通知后端
    this.socket = io(APP_CONFIG.SOCKETIO_URL, { transports: ['websocket'] });
    // receive a message from the server
    this.socket.on('ws-client', (...args) => {});
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
    this.modelChange.emit(this.model);
  }
  changeQuery() {
    this.model.request.uri = transferUrlAndQuery(this.model.request.uri, this.model.request.queryParams, {
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
    if (this.socket == null) {
      console.log('communication is not ready');
      return;
    }
    const { requestTabIndex, msg, ...data } = this.model;
    if (bool === false) {
      // * save to test history
      const res = await this.testService.addHistory(data, 0);
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
    // * connecting
    this.isConnect = null;
    this.unListen();
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
    if (!this.model.msg) {
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-message', content: { message: this.model.msg } });
    this.model.response.responseBody.unshift({ type: 'send', msg: this.model.msg, isExpand: false });
    this.model.msg = '';
  }
  unListen() {
    this.socket.off('ws-client');
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
          this.isConnect = false;
        }
      }
      if (type === 'ws-message-back' && status === 0) {
        this.model.response.responseBody.unshift({ type: 'get', msg: content, isExpand: false });
      }
    });
  }
  isFormChange() {
    return false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private resetModel() {
    return {
      requestTabIndex: 2,
      protocol: 'websocket',
      msg: '',
      request: {
        requestHeaders: [],
        uri: '',
        protocol: 'ws',
        queryParams: [],
      },
      response: {
        requestHeaders: [],
        responseHeaders: [],
        responseBody: [],
      },
    };
  }
  private checkForm(): boolean {
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
  private watchBasicForm() {
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((x) => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      setTimeout(() => {
        this.modelChange.emit(this.model);
      }, 0);
    });
  }
  private initBasicForm() {
    //Prevent init error
    if (!this.model) {
      this.model = this.resetModel();
    }
    const controls = {};
    ['uri', 'protocol'].forEach((name) => {
      controls[name] = [this.model.request[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
