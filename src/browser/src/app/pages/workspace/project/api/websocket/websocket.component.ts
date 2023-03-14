import { Component, OnInit, Output, OnDestroy, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { TabOperateService } from 'pc/browser/src/app/components/eo-ui/tab/tab-operate.service';
import { TabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { Protocol, ApiBodyType } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiParamsNumPipe } from 'pc/browser/src/app/pages/workspace/project/api/pipe/api-param-num.pipe';
import { syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models';
import { isEmptyObj } from 'pc/browser/src/app/shared/utils/index.utils';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { io } from 'socket.io-client';

import { ModalService } from '../../../../../services/modal.service';
import { ApiTestService } from '../http/test/api-test.service';

interface testViewModel {
  requestTabIndex: number;
  msg: string;
  request: ApiData;
  response: any;
}

const UIHash = new Map().set('requestHeaders', 'Request Headers').set('responseHeaders', 'Response Headers');
@Component({
  selector: 'websocket-content',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit, OnDestroy, TabViewComponent {
  @Input() bodyType = 'json';
  @Output() readonly modelChange = new EventEmitter<testViewModel>();
  @Output() readonly eoOnInit = new EventEmitter<testViewModel>();
  wsStatus: 'connected' | 'connecting' | 'disconnect' = 'disconnect';
  isSocketConnect = true;
  get isConnecting() {
    return ['connecting', 'connected'].includes(this.wsStatus);
  }
  Object = Object;
  socket = null;
  model: testViewModel;
  leaveModal: NzModalRef<any, any>;
  height = 300;
  WS_PROTOCOL = [{ value: 'ws', key: 'WS' }];
  editorConfig = {
    language: 'json'
  };
  validateForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private electron: ElectronService,
    private testService: ApiTestService,
    private modal: ModalService,
    private eoNgFeedbackMessageService: EoNgFeedbackMessageService,
    private store: StoreService,
    public tabOperate: TabOperateService
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
        this.model.requestTabIndex = 2;
      }
    }
    this.watchBasicForm();
    this.eoOnInit.emit(this.model);
    this.initBasicForm();
    this.initShortcutKey();
  }

  initShortcutKey() {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        const { ctrlKey, metaKey, code } = event;
        // 判断 Ctrl+S
        if ([ctrlKey, metaKey].includes(true) && code === 'Enter') {
          console.log('EO_LOG[postcat-websocket-test]: Ctrl + enter');
          this.handleSendMsg();
        }
      });
  }
  async ngOnInit() {
    // * 通过 SocketIO 通知后端
    try {
      const port = this.electron.isElectron ? await window.electron?.getWebsocketPort?.() : 13928;
      const url = !APP_CONFIG.production || this.electron.isElectron ? `ws://localhost:${port}` : APP_CONFIG.REMOTE_SOCKET_URL;
      this.socket = io(url, { path: '/socket.io', transports: ['websocket'], reconnectionAttempts: 2 });
      this.socket.on('connect_error', error => {
        // * conncet socketIO is failed
        console.log('connect_error', error);
        this.isSocketConnect = false;
      });
      this.socket.on('error', error => {
        // * conncet socketIO is failed
        console.log('error', error);
        this.isSocketConnect = false;
      });
    } catch (e) {
      console.log('Connect not allow', e);
      this.isSocketConnect = false;
    }
  }

  handleTestQueryTableClick = () => {
    if (this.isConnecting) {
      this.eoNgFeedbackMessageService.info('连接状态无法编辑');
    }
  };

  onResize({ height }: NzResizeEvent): void {
    this.height = height;
    // localStorage.setItem(API_TEST_DRAG_TOP_HEIGHT_KEY, String(height));
  }

  expandMessage(index) {
    console.log('this.model.response.responseBody', this.model.response.responseBody);
    const status = this.model.response.responseBody[index].isExpand || false;
    this.model.response.responseBody[index].isExpand = !status;
  }

  rawDataChange(e) {
    this.modelChange.emit(this.model);
  }
  changeQuery() {
    this.model.request.uri = syncUrlAndQuery(this.model.request.uri, this.model.request.requestParams.queryParams, {
      nowOperate: 'query',
      method: 'replace'
    }).url;
    console.log(this.model.request.uri);
  }
  changeUri() {
    this.model.request.requestParams.queryParams = syncUrlAndQuery(
      this.model.request.uri,
      this.model.request.requestParams.queryParams
    ).query;
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
          isExpand: false
        }
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
        msg: `Disconnect from ${this.getLink()}`,
        isExpand: false
      });
      const { requestTabIndex, msg, ...data } = this.model;
      if (this.store.isShare) {
        return;
      }
      await this.testService.addHistory(data);
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
      const {
        requestTabIndex,
        msg,
        request: {
          requestParams: { headerParams, ...requestParamsItem },
          ...requestItem
        },
        ...data
      } = this.model;
      // * For 'paramAttr.example' key
      this.socket.emit('ws-server', {
        type: 'ws-connect',
        content: {
          ...data,
          request: {
            ...requestItem,
            requestParams: {
              ...requestParamsItem,
              headerParams: headerParams.map(it => ({ ...it, paramAttr: { example: it['paramAttr.example'] || '' } }))
            }
          }
        }
      });
    }
    this.listen();
  }

  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }

  handleSendMsg() {
    // * 通过 SocketIO 通知后端
    // send a message to the server
    if (!this.model.msg || this.wsStatus !== 'connected') {
      return;
    }
    this.socket.emit('ws-server', { type: 'ws-message', content: { message: this.model.msg } });
    this.model.response.responseBody.unshift({ type: 'send', msg: this.model.msg, isExpand: false });
  }
  unListen() {
    this.socket.removeAllListeners('ws-client');
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
          console.log('reqHeader', reqHeader);
          this.model.response.responseBody.unshift({
            type: 'start',
            msg: {
              reqHeader: {
                label: 'Request Headers',
                content: Object.entries<string>(reqHeader).map(([key, value]) => ({
                  name: key,
                  value
                }))
              },
              resHeader: {
                label: 'Response Headers',
                content: Object.entries<string>(resHeader).map(([key, value]) => ({
                  name: key,
                  value
                }))
              }
            },
            title: `Connected to ${this.getLink()}`,
            isExpand: false
          });
        } else {
          this.model.response.responseBody.unshift({
            type: 'end',
            msg: content,
            title: $localize`Connect to ${this.getLink()} is failed`,
            isExpand: false
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
            isExpand: false
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
    this.socket.close();
    this.unListen();
  }
  checkTabCanLeave = closeTarget => {
    if (this.leaveModal) {
      return false;
    }
    const isCloseOther = closeTarget?.uuid && closeTarget.uuid !== this.tabOperate.getCurrentTab().uuid;
    if (this.wsStatus === 'disconnect' || isCloseOther) {
      return true;
    }
    return new Promise(resolve => {
      this.leaveModal = this.modal.create({
        nzTitle: $localize`Do you want to leave the page?`,
        nzContent: $localize`After leaving, the current long connection is no longer maintained, whether to confirm to leave?`,
        nzClosable: false,
        nzFooter: [
          {
            label: $localize`Cancel`,
            onClick: () => {
              this.leaveModal.destroy();
              this.leaveModal = null;
              resolve(false);
            }
          },
          {
            label: $localize`Leave`,
            type: 'primary',
            onClick: () => {
              this.leaveModal.destroy();
              this.leaveModal = null;
              // * disconnect ws connect
              this.handleConnect('disconnect');
              resolve(true);
            }
          }
        ]
      });
    });
  };
  private getLink() {
    const { uri, protocol } = this.model.request;
    const link = /^(wss:\/{2})|(ws:\/{2})\S+$/m.test(uri.trim()) ? uri.trim() : `${protocol}://${uri.trim().replace('//', '')}`;
    // console.log('link', link);
    return link;
  }
  private resetModel(): testViewModel {
    return {
      requestTabIndex: 2,
      msg: '',
      request: {
        name: '',
        uri: '',
        protocol: Protocol.WEBSOCKET,
        apiAttrInfo: {
          contentType: ApiBodyType.Raw
        },
        requestParams: { headerParams: [], bodyParams: [], queryParams: [], restParams: [] },
        responseList: []
      },
      response: {
        requestHeaders: [],
        responseHeaders: [],
        responseBody: []
      }
    };
  }
  private checkForm(): boolean {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    return this.validateForm.status !== 'INVALID';
  }
  private watchBasicForm() {
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      Promise.resolve().then(() => {
        this.modelChange.emit(this.model);
      });
    });
  }
  private initBasicForm() {
    //Prevent init error
    if (!this.model) {
      this.model = this.resetModel();
    }
    this.validateForm = this.fb.group(
      ['uri'].reduce(
        (total, it) => ({
          ...total,
          [it]: [this.model.request[it], [Validators.required]]
        }),
        {}
      )
    );
  }
  private switchEditStatus() {
    const bool = this.wsStatus !== 'disconnect';
    ['uri'].forEach(name => {
      bool ? this.validateForm.controls[name].disable() : this.validateForm.controls[name].enable();
    });
  }
}
