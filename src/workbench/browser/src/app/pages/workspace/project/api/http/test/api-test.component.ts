import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import {
  BEFORE_DATA,
  AFTER_DATA,
  beforeScriptCompletions,
  afterScriptCompletions
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-script/constant';
import {
  ApiTestData,
  ApiTestHistoryFrame,
  ContentType
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
import { ApiTestResultResponseComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/result-response/api-test-result-response.component';
import { getGlobals, setGlobals } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/api-test.utils';
import { ApiTestRes } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/test-server.model';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { generateRestFromUrl, transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { isEmpty } from 'lodash-es';
import { reaction } from 'mobx';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { interval, Subscription, Subject, fromEvent } from 'rxjs';
import { takeUntil, distinctUntilChanged, takeWhile, finalize } from 'rxjs/operators';

import { ApiParamsNumPipe } from '../../../../../../modules/api-shared/api-param-num.pipe';
import { ApiTestUtilService } from '../../../../../../modules/api-shared/api-test-util.service';
import { ApiBodyType, RequestMethod, RequestProtocol } from '../../../../../../modules/api-shared/api.model';
import { MessageService } from '../../../../../../shared/services/message';
import { eoDeepCopy, isEmptyObj, objectToArray } from '../../../../../../utils/index.utils';
import { TestServerService } from '../../service/api-test/test-server.service';
import { ApiTestService } from './api-test.service';

const API_TEST_DRAG_TOP_HEIGHT_KEY = 'API_TEST_DRAG_TOP_HEIGHT';
const localHeight = Number.parseInt(localStorage.getItem(API_TEST_DRAG_TOP_HEIGHT_KEY));

interface testViewModel {
  request: ApiTestData;
  beforeScript: string;
  afterScript: string;
  testStartTime?: number;
  contentType: ContentType;
  autoSetContentType: boolean;
  requestTabIndex: number;
  responseTabIndex: number;
  testResult: {
    request: any;
    response: any;
  };
}
@Component({
  selector: 'eo-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss']
})
export class ApiTestComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() model: testViewModel = this.resetModel();
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: testViewModel;
  @Output() readonly modelChange = new EventEmitter<testViewModel>();
  @Output() readonly afterTested = new EventEmitter<any>();
  @Output() readonly eoOnInit = new EventEmitter<testViewModel>();
  @ViewChild(ApiTestResultResponseComponent) apiTestResultResponseComponent: ApiTestResultResponseComponent; // 通过组件类型获取
  validateForm!: FormGroup;
  BEFORE_DATA = BEFORE_DATA;
  AFTER_DATA = AFTER_DATA;

  beforeScriptCompletions = beforeScriptCompletions;
  afterScriptCompletions = afterScriptCompletions;

  status: 'start' | 'testing' | 'tested' = 'start';
  waitSeconds = 0;
  responseContainerHeight: number;

  isRequestBodyLoaded = false;
  REQUEST_METHOD = objectToArray(RequestMethod);
  MAX_TEST_SECONDS = 60;
  isEmpty = isEmpty;

  get isEmptyTestPage(): boolean {
    const { uuid } = this.route.snapshot.queryParams;
    return !this.store.isShare && (!uuid || uuid.includes('history_'));
  }

  private initTimes = 0;
  private status$: Subject<string> = new Subject<string>();
  private timer$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public store: StoreService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private apiTest: ApiTestService,
    private apiTestUtil: ApiTestUtilService,
    private testServer: TestServerService,
    private messageService: MessageService,
    private lang: LanguageService,
    private elementRef: ElementRef
  ) {
    this.initBasicForm();
    this.testServer.init(message => {
      this.receiveMessage(message);
    });
    this.status$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(status => {
      this.changeStatus(status);
    });
  }

  ngAfterViewInit() {
    this.initShortcutKey();
    queueMicrotask(() => {
      const height = this.elementRef.nativeElement.parentElement.offsetHeight;
      this.responseContainerHeight = Number.isNaN(localHeight) ? height / 2 : localHeight;
    });
  }

  initShortcutKey() {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: KeyboardEvent) => {
        const { ctrlKey, metaKey, code } = event;
        // 判断 Ctrl+S
        if (this.isEmptyTestPage && [ctrlKey, metaKey].includes(true) && code === 'KeyS') {
          console.log('EO_LOG[eo-api-test]: Ctrl + s');
          // 或者 return false;
          event.preventDefault();
          this.saveApi();
        }
      });
  }

  /**
   * Restore data from history
   */
  restoreResponseFromHistory(response) {
    this.model.beforeScript = response?.beforeScript || '';
    this.model.afterScript = response?.afterScript || '';
    this.model.responseTabIndex = 0;
    this.model.testResult = response;
    this.model.testResult.request ??= {};
    this.model.testResult.response ??= {};
  }
  async init() {
    this.initTimes++;
    if (!this.model || isEmptyObj(this.model)) {
      this.model = this.resetModel();
      let id = this.route.snapshot.queryParams.uuid;
      const initTimes = this.initTimes;
      let requestInfo = null;
      if (id && id.includes('history_')) {
        id = Number(id.replace('history_', ''));
        const historyData = await this.apiTest.getHistory(id);
        const history = this.apiTestUtil.getTestDataFromHistory(historyData);
        requestInfo = history.testData;
        this.restoreResponseFromHistory(history.response);
      } else {
        id = Number(id);
        requestInfo = await this.apiTest.getApi({
          id
        });
        this.model.testResult = {
          response: {},
          request: {}
        };
      }
      //!Prevent await async ,replace current  api data
      if (initTimes >= this.initTimes) {
        this.model.request = requestInfo;
      } else {
        return;
      }
      this.initContentType();
      this.waitSeconds = 0;
      this.status = 'start';
    } else {
      if (this.timer$ && this.model.testStartTime) {
        this.waitSeconds = Math.round((Date.now() - this.model.testStartTime) / 1000);
        this.status$.next('testing');
      } else {
        this.waitSeconds = 0;
        this.status$.next('start');
      }
    }
    this.initBasicForm();
    this.validateForm.patchValue(this.model.request);
    this.watchBasicForm();
    //Storage origin api data
    if (!this.initialModel) {
      this.initialModel = eoDeepCopy(this.model);
    }
    this.eoOnInit.emit(this.model);
    this.cdRef.detectChanges();
  }
  clickTest() {
    if (!this.checkForm()) {
      return;
    }
    if (this.status === 'testing') {
      this.abort();
      return;
    }
    this.test();
  }
  /**
   * Save api test data to api
   * ? Maybe support saving test case in future
   */
  saveApi() {
    if (!this.checkForm()) {
      return;
    }
    const apiData = this.apiTestUtil.formatSavingApiData({
      history: this.model.testResult,
      testData: { ...this.model.request }
    });
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.router.navigate(['/home/workspace/project/api/http/edit'], {
      queryParams: {
        pageID: Number(this.route.snapshot.queryParams.pageID)
      }
    });
  }
  changeQuery() {
    this.model.request.uri = transferUrlAndQuery(this.model.request.uri, this.model.request.queryParams, {
      base: 'query'
    }).url;
  }
  watchBasicForm() {
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      setTimeout(() => {
        this.modelChange.emit(this.model);
      }, 0);
    });
  }
  updateParamsbyUri(url) {
    this.model.request.queryParams = transferUrlAndQuery(this.model.request.uri, this.model.request.queryParams, {
      base: 'url'
    }).query;
    this.model.request.restParams = [...generateRestFromUrl(this.model.request.uri, this.model.request.restParams)];
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  /**
   * Judge has edit manualy
   */
  isFormChange(): boolean {
    //Has exist api can't save
    //TODO If has test case,test data will be saved to test case
    if (this.model.request.uuid) {
      return false;
    }
    if (!this.initialModel.request || !this.model.request) {
      return false;
    }
    // console.log(
    //   'api test origin:',
    //   this.apiTestUtil.formatEditingApiData(this.initialModel.request),
    //   'after:',
    //   this.apiTestUtil.formatEditingApiData(this.model.request)
    // );
    const originText = JSON.stringify(this.apiTestUtil.formatEditingApiData(this.initialModel.request));
    const afterText = JSON.stringify(this.apiTestUtil.formatEditingApiData(this.model.request));
    if (
      originText !== afterText ||
      this.initialModel.beforeScript !== this.model.beforeScript ||
      this.initialModel.afterScript !== this.model.afterScript
    ) {
      // console.log('api test formChange true!', originText.split(afterText));
      return true;
    }
    return false;
  }

  changeContentType(contentType) {
    this.model.request.requestHeaders = this.apiTestUtil.addOrReplaceContentType(contentType, this.model.request.requestHeaders);
  }
  changeBodyType($event) {
    this.initContentType();
  }
  handleBottomTabSelect(tab) {
    if (tab.index === 2) {
      this.isRequestBodyLoaded = true;
    }
  }
  emitChangeFun(where) {
    if (where === 'queryParams') {
      this.changeQuery();
    }
    this.modelChange.emit(this.model);
  }
  ngOnInit(): void {
    this.watchEnvChange();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.testServer.close();
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
  private test() {
    this.testServer.send('unitTest', {
      id: JSON.stringify(this.route.snapshot.queryParams),
      action: 'ajax',
      data: this.testServer.formatRequestData(this.model.request, {
        env: this.store.getCurrentEnv,
        globals: getGlobals(),
        beforeScript: this.model.beforeScript,
        afterScript: this.model.afterScript,
        lang: this.lang.systemLanguage === 'zh-Hans' ? 'cn' : 'en'
      })
    });
    this.model.testStartTime = Date.now();
    this.status$.next('testing');
  }
  private abort() {
    this.testServer.send('unitTest', {
      id: this.route.snapshot.queryParams.pageID,
      action: 'abort'
    });
    this.status$.next('tested');
  }
  private async addHistory(histoy: ApiTestHistoryFrame, id) {
    await this.apiTest.addHistory(histoy, id);
    this.messageService.send({ type: 'updateHistory', data: {} });
  }
  /**
   * Receive Test Server Message
   */
  private receiveMessage(message: ApiTestRes) {
    console.log('[api test componnet]receiveMessage', message);
    const tmpHistory = {
      general: message.general,
      request: message.history.request || {},
      response: message.response || {}
    };
    let queryParams: { pageID: string; uuid?: string };
    try {
      queryParams = JSON.parse(message.id);
    } catch (e) {}
    if (queryParams.pageID !== this.route.snapshot.queryParams.pageID) {
      //* Other tab test finish,support multiple tab test same time
      this.afterTested.emit({
        id: queryParams.pageID,
        url: '/home/workspace/project/api/http/test',
        model: {
          testStartTime: 0,
          testResult: tmpHistory
        }
      });
    } else {
      this.model.testResult = tmpHistory;
      this.status$.next('tested');
    }
    if (message.status === 'error') {
      return;
    }

    //set globals
    setGlobals(message.globals);

    //If test sucess,addHistory
    //Only has statusCode need save report
    if (!message.response.statusCode || this.store.isShare) {
      return;
    }
    this.addHistory(message.history, Number(queryParams.uuid));
  }
  setTestSecondsTimmer() {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
    this.timer$ = interval(1000)
      .pipe(
        takeWhile(() => this.waitSeconds < this.MAX_TEST_SECONDS),
        finalize(() => this.changeStatus('tested'))
      )
      .subscribe(() => this.waitSeconds++);
  }
  downloadFile() {
    this.apiTestResultResponseComponent.downloadResponseText();
  }

  onResize({ height }: NzResizeEvent): void {
    this.responseContainerHeight = height;
    localStorage.setItem(API_TEST_DRAG_TOP_HEIGHT_KEY, String(height));
  }
  /**
   * Change test status
   *
   * @param status - 'start'|'testing'|'tested'
   */
  private changeStatus(status) {
    this.status = status;
    switch (status) {
      case 'testing': {
        this.setTestSecondsTimmer();
        break;
      }
      case 'tested': {
        this.model.testStartTime = 0;
        this.modelChange.emit(this.model);
        this.timer$.unsubscribe();
        this.waitSeconds = 0;
        this.model.responseTabIndex = 0;
        this.ref.detectChanges();
        // 测试完自动帮用户将返回高度调到 40%
        const height = this.elementRef.nativeElement.parentElement.offsetHeight * 0.5;
        if (this.responseContainerHeight < height) {
          this.responseContainerHeight = height;
        }
        break;
      }
    }
  }
  private initContentType() {
    if (this.model.request.requestBodyType === ApiBodyType.Raw) {
      this.model.contentType = this.apiTestUtil.getContentType(this.model.request.requestHeaders) || 'text/plain';
    }
  }
  private watchEnvChange() {
    reaction(
      () => this.store.getCurrentEnv,
      (env: any) => {
        if (env.uuid) {
          this.validateForm.controls.uri.setValidators([]);
          this.validateForm.controls.uri.updateValueAndValidity();
        } else {
          this.validateForm.controls.uri.setValidators([Validators.required]);
        }
      }
    );
  }
  private resetModel() {
    return {
      contentType: 'text/plain',
      requestTabIndex: 1,
      responseTabIndex: 0,
      request: {},
      beforeScript: '',
      afterScript: '',
      testResult: {
        response: {},
        request: {}
      }
    } as testViewModel;
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    //Prevent init error
    if (!this.model) {
      this.model = this.resetModel();
    }
    const controls = {};
    ['method', 'uri'].forEach(name => {
      controls[name] = [this.model.request[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
