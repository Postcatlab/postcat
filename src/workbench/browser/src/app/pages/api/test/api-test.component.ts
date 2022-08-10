import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';

import {
  ApiBodyType,
  ApiTestData,
  ApiTestHistoryFrame,
  RequestMethod,
  RequestProtocol,
} from '../../../shared/services/storage/index.model';
import { MessageService } from '../../../shared/services/message';

import { interval, Subscription, Observable, Subject } from 'rxjs';
import { take, takeUntil, distinctUntilChanged } from 'rxjs/operators';

import { TestServerService } from '../../../shared/services/api-test/test-server.service';
import { ApiTestUtilService } from './api-test-util.service';
import { isEmptyObj, objectToArray } from '../../../utils';

import { EnvState } from '../../../shared/store/env.state';
import { ApiParamsNumPipe } from '../../../shared/pipes/api-param-num.pipe';
import { ApiTestService } from './api-test.service';
import { TestServerLocalNodeService } from '../../../shared/services/api-test/local-node/test-connect.service';
import { TestServerServerlessService } from '../../../shared/services/api-test/serverless-node/test-connect.service';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/shared/services/api-test/remote-node/test-connect.service';
import { ApiTestRes } from 'eo/workbench/browser/src/app/shared/services/api-test/test-server.model';
import {
  BEFORE_DATA,
  AFTER_DATA,
  beforeScriptCompletions,
  afterScriptCompletions,
} from 'eo/workbench/browser/src/app/shared/components/api-script/constant';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ContentTypeByAbridge } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.model';
import { AnyRecord } from 'dns';

const API_TEST_DRAG_TOP_HEIGHT_KEY = 'API_TEST_DRAG_TOP_HEIGHT';
interface testViewModel {
  request: ApiTestData;
  testResult: {
    request: any;
    response: any;
  };
}
@Component({
  selector: 'eo-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit, OnDestroy {
  @Input() model: testViewModel = this.resetModel();
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: testViewModel;
  @Output() modelChange = new EventEmitter<testViewModel>();
  @Output() afterInit = new EventEmitter<testViewModel>();
  @Select(EnvState) env$: Observable<any>;
  validateForm!: FormGroup;
  env: any = {
    parameters: [],
    hostUri: '',
  };
  contentType: ContentTypeByAbridge;
  BEFORE_DATA = BEFORE_DATA;
  AFTER_DATA = AFTER_DATA;

  beforeScriptCompletions = beforeScriptCompletions;
  afterScriptCompletions = afterScriptCompletions;
  beforeScript = '';
  afterScript = '';

  nzSelectedIndex = 1;
  status: 'start' | 'testing' | 'tested' = 'start';
  waitSeconds = 0;
  responseTabIndexRes = 0;
  initTimes = 0;

  isRequestBodyLoaded = false;
  initHeight = localStorage.getItem(API_TEST_DRAG_TOP_HEIGHT_KEY) || '45%';
  testServer: TestServerLocalNodeService | TestServerServerlessService | TestServerRemoteService;
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);

  private status$: Subject<string> = new Subject<string>();
  private timer$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private apiTest: ApiTestService,
    private apiTestUtil: ApiTestUtilService,
    private testServerService: TestServerService,
    private messageService: MessageService,
    private lang: LanguageService
  ) {
    this.initBasicForm();
    this.testServer = this.testServerService.instance;
    this.testServer.init((message) => {
      this.receiveMessage(message);
    });
    this.status$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((status) => {
      this.changeStatus(status);
    });
  }
  /**
   * Restore data from history
   *
   */
  restoreResponseFromHistory(response) {
    this.beforeScript = response?.beforeScript || '';
    this.afterScript = response?.afterScript || '';
    this.responseTabIndexRes = 0;
    this.model.testResult = response;
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
          id,
        });
        this.model.testResult = {
          response: {},
          request: {},
        };
      }
      //!Prevent await async ,replace current  api data
      if (initTimes >= this.initTimes) {
        this.model.request = requestInfo;
      }else{
        return;
      }
      this.initContentType();
    }
    this.initBasicForm();
    //! Set this two function to reset form
    this.validateForm.markAsPristine();
    this.validateForm.markAsUntouched();

    this.validateForm.patchValue(this.model.request);
    this.watchBasicForm();
    //Storage origin api data
    if (!this.initialModel) {
      this.initialModel = structuredClone(this.model);
    }
    this.afterInit.emit(this.model);
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
      testData: Object.assign({}, this.model.request),
    });
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    console.log(JSON.stringify(apiData));
    this.router.navigate(['/home/api/edit'], {
      queryParams: {
        pageID: Number(this.route.snapshot.queryParams.pageID),
      },
    });
  }
  changeQuery() {
    this.model.request.uri = this.apiTestUtil.transferUrlAndQuery(
      this.model.request.uri,
      this.model.request.queryParams,
      {
        base: 'query',
        replaceType: 'replace',
      }
    ).url;
  }
  changeUri() {
    this.model.request.queryParams = this.apiTestUtil.transferUrlAndQuery(
      this.model.request.uri,
      this.model.request.queryParams,
      {
        base: 'url',
        replaceType: 'replace',
      }
    ).query;
  }
  watchBasicForm() {
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((x) => {
      // Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      setTimeout(() => {
        this.modelChange.emit(this.model);
      }, 0);
    });
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
    // if (this.model.request.uuid) {
    //   return false;
    // }
    if (!this.initialModel.request || !this.model.request) {
      return false;
    }
    console.log(
      'api test origin:',
      this.apiTestUtil.formatEditingApiData(this.initialModel.request),
      'after:',
      this.apiTestUtil.formatEditingApiData(this.model.request)
    );
    const originText = JSON.stringify(this.apiTestUtil.formatEditingApiData(this.initialModel.request));
    const afterText = JSON.stringify(this.apiTestUtil.formatEditingApiData(this.model.request));
    if (originText !== afterText) {
      // console.log('api test formChange true!', originText.split(afterText));
      return true;
    }
    return false;
  }

  changeContentType(contentType) {
    this.model.request.requestHeaders = this.apiTestUtil.addOrReplaceContentType(
      contentType,
      this.model.request.requestHeaders
    );
  }
  changeBodyType($event) {
    this.initContentType();
  }
  handleEoDrag([leftEl]: [HTMLDivElement, HTMLDivElement]) {
    if (leftEl.style.height) {
      localStorage.setItem(API_TEST_DRAG_TOP_HEIGHT_KEY, leftEl.style.height);
    }
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
      // id: this.apiTab.tabID,
      action: 'ajax',
      data: this.testServer.formatRequestData(this.model.request, {
        env: this.env,
        globals: this.apiTestUtil.getGlobals(),
        beforeScript: this.beforeScript,
        afterScript: this.afterScript,
        lang: this.lang.systemLanguage === 'zh-Hans' ? 'cn' : 'en',
      }),
    });
    this.status$.next('testing');
  }
  private abort() {
    this.testServer.send('unitTest', {
      // id: this.apiTab.tabID,
      action: 'abort',
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
    // console.log('[api test componnet]receiveMessage', message);
    const tmpHistory = {
      general: message.general,
      request: message.report?.request,
      response: message.response,
    };
    this.model.testResult = tmpHistory;
    this.modelChange.emit(this.model);
    this.status$.next('tested');
    if (message.status === 'error') {
      return;
    }

    //set globals
    this.apiTestUtil.setGlobals(message.globals);

    //If test sucess,addHistory
    //Only has statusCode need save report
    if (!message.response.statusCode) {
      return;
    }
    // TODO Other tab test finish,support multiple tab test same time
    this.addHistory(message.history, this.model.request.uuid);
  }
  /**
   * Change test status
   *
   * @param status - 'start'|'testing'|'tested'
   */
  private changeStatus(status) {
    this.status = status;
    const that = this;
    switch (status) {
      case 'testing': {
        this.timer$ = interval(1000)
          .pipe(take(60))
          .subscribe({
            next(val) {
              console.log('next');
              that.waitSeconds = val + 1;
            },
            complete() {
              that.changeStatus('tested');
            },
          });
        break;
      }
      case 'tested': {
        this.timer$.unsubscribe();
        this.waitSeconds = 0;
        this.responseTabIndexRes = 0;
        this.ref.detectChanges();
        break;
      }
    }
  }
  private initContentType() {
    if (this.model.request.requestBodyType === ApiBodyType.Raw) {
      this.contentType =
        this.apiTestUtil.getContentType(this.model.request.requestHeaders) || ContentTypeByAbridge.Text;
    }
  }
  private watchEnvChange() {
    this.env$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const { env } = data;
      if (env) {
        this.env = env;
        if (env.uuid) {
          this.validateForm.controls.uri.setValidators([]);
          this.validateForm.controls.uri.updateValueAndValidity();
        } else {
          this.validateForm.controls.uri.setValidators([Validators.required]);
        }
      }
    });
  }
  private resetModel() {
    return {
      request: {},
      testResult: {
        response: {},
        request: {},
      },
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
    ['protocol', 'method', 'uri'].forEach((name) => {
      controls[name] = [this.model.request?.[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
