import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';

import {
  ApiBodyType,
  ApiData,
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

const API_TEST_DRAG_TOP_HEIGHT_KEY = 'API_TEST_DRAG_TOP_HEIGHT';
@Component({
  selector: 'eo-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit, OnDestroy {
  @Input() model: ApiTestData | any;
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: ApiData;
  @Input() testResult: any = {
    response: {},
    request: {},
  };
  @Output() modelChange = new EventEmitter<ApiTestData>();
  @Output() afterInit = new EventEmitter<ApiData>();
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
    private route: ActivatedRoute,
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
  async init() {
    this.initTimes++;
    if (!this.model || isEmptyObj(this.model)) {
      this.model = {} as ApiTestData;
      const id = Number(this.route.snapshot.queryParams.uuid);
      const initTimes = this.initTimes;
      const result = await this.apiTest.getApi({
        id,
      });
      //!Prevent await async ,replace current  api data
      if (initTimes >= this.initTimes) {
        this.model = result;
      }
    }
    //Storage origin api data
    if (!this.initialModel) {
      this.initialModel = structuredClone(this.model);
    }
    console.log('api test inti', this.model, isEmptyObj(this.model));
    this.initBasicForm();
    //! Set this two function to reset form
    this.validateForm.markAsPristine();
    this.validateForm.markAsUntouched();

    this.validateForm.patchValue(this.model);
    this.watchBasicForm();
    this.initContentType();
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
      history: this.testResult,
      testData: this.model,
    });
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.messageService.send({ type: 'saveApiFromTest', data: {} });
    this.router.navigate(['home/api/edit'], {
      queryParams: { pageID: Date.now() },
    });
  }
  changeQuery(queryParams) {
    this.model.uri = this.apiTestUtil.transferUrlAndQuery(this.model.uri, queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
  }
  changeUri() {
    this.model.queryParams = this.apiTestUtil.transferUrlAndQuery(this.model.uri, this.model.queryParams, {
      base: 'url',
      replaceType: 'replace',
    }).query;
  }
  watchBasicForm() {
    this.validateForm.valueChanges.subscribe((x) => {
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
    // if (this.model.uuid) {
    //   return false;
    // }
    if (!this.initialModel || !this.model) {
      return false;
    }
    // console.log(
    //   'api test origin:',
    //   this.apiTestUtil.formatEditingApiData(this.initialModel),
    //   'after:',
    //   this.apiTestUtil.formatEditingApiData(this.model)
    // );
    const originText = JSON.stringify(this.apiTestUtil.formatEditingApiData(this.initialModel));
    const afterText = JSON.stringify(this.apiTestUtil.formatEditingApiData(this.model));
    if (originText !== afterText) {
      // console.log('api test formChange true!', originText.split(afterText));
      return true;
    }
    return false;
  }

  changeContentType(contentType) {
    this.model.requestHeaders = this.apiTestUtil.addOrReplaceContentType(contentType, this.model.requestHeaders);
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
      data: this.testServer.formatRequestData(this.model, {
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
    this.testResult = tmpHistory;
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
    this.addHistory(message.history, this.model.uuid);
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
    if (this.model.requestBodyType === ApiBodyType.Raw) {
      this.contentType = this.apiTestUtil.getContentType(this.model.requestHeaders) || ContentTypeByAbridge.Text;
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
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    //Prevent init error
    if (!this.model) {
      this.model = {} as ApiData;
    }
    const controls = {};
    ['protocol', 'method', 'uri'].forEach((name) => {
      controls[name] = [this.model?.[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
