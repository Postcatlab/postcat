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
import { objectToArray } from '../../../utils';

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
  @Output() modelChange = new EventEmitter<ApiTestData>();
  @Output() afterSaved = new EventEmitter<ApiData>();
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

  isRequestBodyLoaded = false;
  testResult: any = {
    response: {},
    request: {},
  };
  initHeight = localStorage.getItem(API_TEST_DRAG_TOP_HEIGHT_KEY) || '45%';
  testServer: TestServerLocalNodeService | TestServerServerlessService | TestServerRemoteService;
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);
  private originModel;

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
    this.testServer = this.testServerService.instance;
    this.testServer.init((message) => {
      this.receiveMessage(message);
    });
    this.status$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((status) => {
      this.changeStatus(status);
    });
  }
  async init() {
    if (!this.model) {
      this.model = {} as ApiTestData;
      const id = Number(this.route.snapshot.queryParams.uuid);
      const result = await this.apiTest.getApi({
        id,
      });
      //Storage origin api data
      this.originModel = structuredClone(result);
      this.model = result;
    } else {
      //API data form outside,such as tab cache
      this.originModel = structuredClone(this.model);
    }
    console.log(this.model);
    this.validateForm.patchValue(this.model);
    this.initContentType();
    this.modelChange.emit(this.model);
  }
  clickTest() {
    //manual set dirty in case user submit directly without edit
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === 'INVALID') {
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
    const apiData = this.apiTestUtil.formatSavingApiData({
      history: this.testResult,
      testData: this.model,
    });
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.router.navigate(['home/api/edit'], {
      queryParams: { pageID: Date.now() },
    });
    this.afterSaved.emit(apiData);
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
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  /**
   * Judge has edit manualy
   */
  isFormChange(): boolean {
    //Has exist api can't save
    if (this.model.uuid) {
      return false;
    }

    if (!this.originModel || !this.model) {
      return false;
    }
    console.log('origin:', this.originModel, 'after:', this.apiTestUtil.formatEditingApiData(this.model));
    if (JSON.stringify(this.originModel) !== JSON.stringify(this.apiTestUtil.formatEditingApiData(this.model))) {
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
  ngOnInit(): void {
    this.init();
    this.initBasicForm();
    this.watchEnvChange();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.testServer.close();
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
    const controls = {};
    ['protocol', 'method', 'uri'].forEach((name) => {
      controls[name] = [this.model[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
