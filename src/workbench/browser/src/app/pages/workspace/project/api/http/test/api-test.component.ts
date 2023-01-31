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
import { TabViewComponent } from 'eo/workbench/browser/src/app/modules/eo-ui/tab/tab.model';
import {
  BEFORE_DATA,
  AFTER_DATA,
  beforeScriptCompletions,
  afterScriptCompletions
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-script/constant';
import { ContentType } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
import { ApiTestResultResponseComponent } from 'eo/workbench/browser/src/app/pages/workspace/project/api/http/test/result-response/api-test-result-response.component';
import {
  ApiTestResData,
  TestServerRes
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';
import { generateRestFromUrl, syncUrlAndQuery } from 'eo/workbench/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ApiData, ApiTestHistory } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/storage.utils';
import { isEmpty } from 'lodash-es';
import { reaction } from 'mobx';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { interval, Subscription, Subject, fromEvent } from 'rxjs';
import { takeUntil, distinctUntilChanged, takeWhile, finalize } from 'rxjs/operators';

import { ApiBodyType, ContentType as ContentTypeEnum, RequestMethod } from '../../../../../../modules/api-shared/api.model';
import { ApiParamsNumPipe } from '../../../../../../modules/api-shared/pipe/api-param-num.pipe';
import { eoDeepCopy, isEmptyObj, enumsToArr, JSONParse } from '../../../../../../utils/index.utils';
import { ProjectApiService } from '../../api.service';
import { ApiTestUtilService } from '../../service/api-test-util.service';
import { ApiStoreService } from '../../service/store/api-state.service';
import { TestServerService } from '../../service/test-server/test-server.service';
import { ApiTestService } from './api-test.service';

const API_TEST_DRAG_TOP_HEIGHT_KEY = 'API_TEST_DRAG_TOP_HEIGHT';
const localHeight = Number.parseInt(localStorage.getItem(API_TEST_DRAG_TOP_HEIGHT_KEY));

const contentTypeMap = {
  0: 'application/json',
  1: 'text/plain',
  2: 'application/json',
  3: 'application/xml',
  6: 'application/json'
} as const;

interface testViewModel {
  testStartTime?: number;
  contentType: ContentType;
  autoSetContentType: boolean;
  requestTabIndex: number;
  responseTabIndex: number;
  request: Partial<ApiData>;
  testResult: ApiTestResData;
}
@Component({
  selector: 'eo-api-http-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss']
})
export class ApiTestComponent implements OnInit, AfterViewInit, OnDestroy, TabViewComponent {
  @Input() model: testViewModel = this.resetModel();
  /**
   * Intial model from outside,check form is change
   * * Usually restored from tab
   */
  @Input() initialModel: testViewModel;
  @Output() readonly modelChange = new EventEmitter<testViewModel>();
  @Output() readonly afterTested = new EventEmitter<{
    id: string;
    url: string;
    model: {
      testStartTime: number;
      testResult: ApiTestResData;
    };
  }>();
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
  REQUEST_METHOD = enumsToArr(RequestMethod);
  MAX_TEST_SECONDS = 60;
  isEmpty = isEmpty;
  $$contentType: ContentType = contentTypeMap[0];
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  get isEmptyTestPage(): boolean {
    const { uuid } = this.route.snapshot.queryParams;
    return !this.globalStore.isShare && (!uuid || uuid.includes('history_'));
  }
  get contentType(): ContentType {
    return contentTypeMap[this.model.request.apiAttrInfo.contentType];
  }
  set contentType(value) {
    this.$$contentType = value;
  }

  private initTimes = 0;
  private status$: Subject<string> = new Subject<string>();
  private timer$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private globalStore: StoreService,
    public store: ApiStoreService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private apiTest: ApiTestService,
    private apiTestUtil: ApiTestUtilService,
    private testServer: TestServerService,
    private projectApi: ProjectApiService,
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

  async init() {
    this.initTimes++;
    if (!this.model || isEmptyObj(this.model)) {
      this.model = {
        requestTabIndex: 1
      } as testViewModel;
      let uuid = this.route.snapshot.queryParams.uuid;
      const initTimes = this.initTimes;
      let requestInfo = null;
      if (uuid?.includes('history_')) {
        uuid = uuid.replace('history_', '');
        const history: ApiTestHistory = await this.apiTest.getHistory(uuid);
        this.model.request = history.request;
        this.model.testResult = history.response;
      } else {
        if (!uuid) {
          requestInfo = this.resetModel().request;
        } else {
          requestInfo = await this.projectApi.get(uuid);
        }
      }
      //!Prevent await async ,replace current  api data
      if (initTimes >= this.initTimes) {
        this.model.request = {
          ...this.model.request,
          ...requestInfo
        };
        this.model.request = this.apiTestUtil.getTestDataFromApi(this.model.request);
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
    const apiData = this.apiTestUtil.formatUIApiDataToStorage({
      request: this.model.request,
      response: this.model.testResult
    });
    StorageUtil.set('apiDataWillbeSave', apiData);
    this.router.navigate(['/home/workspace/project/api/http/edit'], {
      queryParams: {
        pageID: Number(this.route.snapshot.queryParams.pageID)
      }
    });
  }
  changeQuery() {
    this.model.request.uri = syncUrlAndQuery(this.model.request.uri, this.model.request.requestParams.queryParams, {
      nowOperate: 'query',
      method: 'replace'
    }).url;
  }
  watchBasicForm() {
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
      //? Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      this.modelChange.emit(this.model);
    });
  }
  updateParamsbyUri(url) {
    this.model.request.requestParams.queryParams = syncUrlAndQuery(
      this.model.request.uri,
      this.model.request.requestParams.queryParams
    ).query;
    this.model.request.requestParams.restParams = [
      ...generateRestFromUrl(this.model.request.uri, this.model.request.requestParams.restParams)
    ];
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
    if (this.model.request.apiUuid) {
      return false;
    }
    if (!this.initialModel?.request || !this.model.request) {
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
    if (originText !== afterText) {
      // console.log('api test formChange true!', originText.split(afterText));
      return true;
    }
    return false;
  }

  changeContentType(contentType) {
    this.model.request.requestParams.headerParams = this.apiTestUtil.addOrReplaceContentType(
      contentType,
      this.model.request.requestParams.headerParams
    );
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
    const testData = {
      id: JSON.stringify(this.route.snapshot.queryParams),
      action: 'ajax',
      data: this.testServer.formatRequestData(this.model.request, {
        env: this.store.getCurrentEnv,
        globals: this.apiTestUtil.getGlobals(),
        lang: this.lang.systemLanguage === 'zh-Hans' ? 'cn' : 'en'
      })
    };
    this.testServer.send('unitTest', testData);
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
  /**
   * Receive Test Server Message
   */
  private receiveMessage(message: TestServerRes) {
    pcConsole.log('[api test componnet]receiveMessage', message);
    let queryParams: { pageID: string; uuid?: string };
    queryParams = JSONParse(message.id);

    if (queryParams.pageID !== this.route.snapshot.queryParams.pageID) {
      //* Other tab test finish,support multiple tab test same time
      //* Update Test Result
      this.afterTested.emit({
        id: queryParams.pageID,
        url: '/home/workspace/project/api/http/test',
        model: {
          testStartTime: 0,
          testResult: message.response
        }
      });
    } else {
      this.model.testResult = message.response;
      this.status$.next('tested');
    }
    if (message.status === 'error') {
      return;
    }

    //set globals
    this.apiTestUtil.setGlobals(message.globals);

    //If test sucess,addHistory
    //Only has statusCode need save report
    if (!message.response.statusCode || this.globalStore.isShare) {
      return;
    }
    //Add test history
    this.apiTest.addHistory({
      apiUuid: this.model.request.apiUuid || '-1',
      request: this.model.request,
      response: message.response
    });
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
    const contentType = this.model.request?.apiAttrInfo?.contentType;
    if (contentType === ApiBodyType.Raw) {
      this.model.contentType = this.apiTestUtil.getContentType(this.model.request.requestParams.headerParams) || 'text/plain';
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
      requestTabIndex: 1,
      responseTabIndex: 0,
      request: {
        apiAttrInfo: {
          contentType: ContentTypeEnum.RAW,
          requestMethod: 0,
          beforeInject: '',
          afterInject: ''
        },
        requestParams: {
          queryParams: [],
          headerParams: [],
          restParams: [],
          bodyParams: [
            {
              binaryRawData: ''
            }
          ]
        }
      },
      testResult: {}
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
    controls['uri'] = [this.model.request.uri, [Validators.required]];
    controls['method'] = [this.model.request.apiAttrInfo?.requestMethod, [Validators.required]];
    this.validateForm = this.fb.group(controls);
  }

  private initShortcutKey() {
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
}
