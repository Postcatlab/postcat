import { Component, OnInit, Output, OnDestroy, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';

import { io } from 'socket.io-client';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { MessageService } from '../../../shared/services/message';
import { ApiTestService } from '../../../pages/api/http/test/api-test.service';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../shared/services/modal.service';
import { isEmptyObj } from 'eo/workbench/browser/src/app/utils/index.utils';
import { ApiParamsNumPipe } from '../../../shared/pipes/api-param-num.pipe';

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
  wsStatus: 'connected' | 'connecting' | 'disconnect' = 'disconnect';
  isSocketConnect = true;
  Object = Object;
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
    private electron: ElectronService,
    private testService: ApiTestService,
    private modal: ModalService,
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
      // console.log(this.model);
    }
    this.watchBasicForm();
    this.eoOnInit.emit(this.model);
    this.initBasicForm();
  }
  async ngOnInit() {
    // * 通过 SocketIO 通知后端
    try {
      const port = await window.eo?.getWebsocketPort();
      this.socket = io(
        `${
          APP_CONFIG.production && !this.electron.isElectron
            ? APP_CONFIG.REMOTE_SOCKET_URL
            : `ws://localhost:${port || 13928}`
        }`,
        { transports: ['websocket'] }
      );
      this.socket.on('connect_error', (error) => {
        // * conncet socketIO is failed
        console.log('connect_error', error);
        this.isSocketConnect = false;
      });
      this.socket.on('error', (error) => {
        // * conncet socketIO is failed
        console.log('error', error);
        this.isSocketConnect = false;
      });
    } catch (e) {
      console.log('Connect not allow', e);
      this.isSocketConnect = false;
    }
  }

  expandMessage(index) {
    const status = this.model.response.responseBody[index].isExpand;
    this.model.response.responseBody[index].isExpand = status == null ? true : !status;
  }
  renderStatus(status) {
    const hash = new Map()
      .set('connected', 'Connected')
      .set('disconnect', 'Disconnect')
      .set('connecting', 'Connecting');
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
  changeUri() {
    this.model.request.queryParams = transferUrlAndQuery(this.model.request.uri, this.model.request.queryParams, {
      base: 'url',
      replaceType: 'replace',
    }).query;
  }
  emitChangeFun(where) {
    if (where === 'queryParams') {
      this.changeQuery();
    }
    this.modelChange.emit(this.model);
  }

  async handleConnect(bool = 'disconnect') {
    const isOK = this.checkForm();
    if (!isOK) {
      return;
    }
    if (this.socket == null) {
      console.log('communication is not ready');
      return;
    }
    if (!this.isSocketConnect) {
      this.model.response.responseBody = [
        {
          type: 'end',
          msg: 'The test service connection failed, please submit an Issue to contact the community',
          isExpand: false,
        },
      ];
      return;
    }
    if (bool === 'disconnect') {
      this.socket.emit('ws-server', { type: 'ws-disconnect', content: {} });
      this.socket.off('ws-client');
      this.wsStatus = 'disconnect';
      this.switchEditStatus();
      // * save to test history
      this.model.response.responseBody.unshift({
        type: 'end',
        msg: 'Disconnect from ' + this.getLink(),
        isExpand: false,
      });
      const { requestTabIndex, msg, ...data } = this.model;
      const res = await this.testService.addHistory(data, 0);
      if (res) {
        this.message.send({ type: 'updateHistory', data: {} });
      }
      return;
    }
    // * connecting
    this.wsStatus = 'connecting';
    this.unListen();
    const wsUrl = this.model.request.uri;
    if (wsUrl === '') {
      console.log('Websocket URL is empty');
      return;
    }
    {
      const { requestTabIndex, msg, ...data } = this.model;
      this.socket.emit('ws-server', { type: 'ws-connect', content: data });
    }
    this.listen();
  }

  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }

  handleSendMsg() {
    // * 通过 SocketIO 通知后端
    // send a message to the server
    if (!this.model.msg) {
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-message', content: { message: this.model.msg } });
    this.model.response.responseBody.unshift({ type: 'send', msg: this.model.msg, isExpand: false });
  }
  unListen() {
    this.socket.off('ws-client');
  }
  listen() {
    // * 无论是否连接成功，都清空发送历史
    this.model.response.responseBody = [];
    this.switchEditStatus();
    if (this.socket == null) {
      console.log('communication is no ready');
      return;
    }
    this.socket.on('ws-client', ({ type, status, content }) => {
      this.isSocketConnect = true;
      if (type === 'ws-connect-back') {
        if (status === 0) {
          this.wsStatus = 'connected';
          this.model.requestTabIndex = 2;
          const { reqHeader, resHeader } = content;
          this.model.response.responseBody.unshift({
            type: 'start',
            msg: {
              'Request Headers': Object.entries<string>(reqHeader).map(([key, value]) => ({
                name: key,
                value,
              })),
              'Response Headers': Object.entries<string>(resHeader).map(([key, value]) => ({
                name: key,
                value,
              })),
            },
            title: 'Connected to ' + this.getLink(),
            isExpand: false,
          });
        } else {
          this.model.response.responseBody.unshift({
            type: 'end',
            msg: content,
            title: 'Connect to ' + this.getLink() + ` is failed`,
            isExpand: false,
          });
          this.wsStatus = 'disconnect';
          this.switchEditStatus();
        }
      }
      if (type === 'ws-message-back') {
        if (status === 0) {
          const { type: msgType } = this.model.response.responseBody.at();
          if (msgType === 'end') {
            // * If the last message is disconnect type, then do not push new message to list
            return;
          }
          this.model.response.responseBody.unshift({ type: 'get', msg: content, isExpand: false });
        } else {
          this.model.response.responseBody.unshift({
            type: 'end',
            msg: `Error by ${this.getLink()}`,
            isExpand: false,
          });
          this.wsStatus = 'disconnect';
          this.switchEditStatus();
          this.unListen();
        }
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
  checkTabCanLeave = () => {
    if (this.wsStatus === 'disconnect') {
      return true;
    }
    return new Promise((resolve) => {
      const modal = this.modal.create({
        nzTitle: $localize`Do you want to leave the page?`,
        nzContent: $localize`After leaving, the current long connection is no longer maintained, whether to confirm to leave?`,
        nzClosable: false,
        nzFooter: [
          {
            label: $localize`Leave`,
            type: 'primary',
            onClick: () => {
              modal.destroy();
              // * disconnect ws connect
              this.handleConnect('disconnect');
              resolve(true);
            },
          },
          {
            label: $localize`Cancel`,
            onClick: () => {
              modal.destroy();
              resolve(false);
            },
          },
        ],
      });
    });
  };
  private getLink() {
    const { uri, protocol } = this.model.request;
    const link = /^(wss:\/{2})|(ws:\/{2})\S+$/m.test(uri.trim())
      ? uri.trim()
      : protocol + '://' + uri.trim().replace('//', '');
    // console.log('link', link);
    return link;
  }
  private resetModel(): testViewModel {
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
  private switchEditStatus() {
    const bool = this.wsStatus !== 'disconnect';
    ['uri', 'protocol'].forEach((name) => {
      if (bool) {
        // wsStatus !== 'disconnect'
        this.validateForm.controls[name].disable();
      } else {
        this.validateForm.controls[name].enable();
      }
    });
  }
}
