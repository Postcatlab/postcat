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
  AfterViewInit,
  HostListener,
  OnChanges,
  Inject,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEmpty, isEqual } from 'lodash-es';
import { autorun, reaction } from 'mobx';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { LanguageService } from 'pc/browser/src/app/core/services/language/language.service';
import { AuthorizationExtensionFormComponent } from 'pc/browser/src/app/pages/workspace/project/api/components/authorization-extension-form/authorization-extension-form.component';
import { AuthIn, NONE_AUTH_OPTION } from 'pc/browser/src/app/pages/workspace/project/api/constants/auth.model';
import { ApiEditUtilService } from 'pc/browser/src/app/pages/workspace/project/api/http/edit/api-edit-util.service';
import {
  BEFORE_DATA,
  AFTER_DATA,
  beforeScriptCompletions,
  afterScriptCompletions
} from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-script/constant';
import {
  ContentType,
  CONTENT_TYPE_BY_ABRIDGE,
  FORMDATA_CONTENT_TYPE_BY_ABRIDGE,
  testViewModel
} from 'pc/browser/src/app/pages/workspace/project/api/http/test/api-test.model';
import { ApiTestResultResponseComponent } from 'pc/browser/src/app/pages/workspace/project/api/http/test/result-response/api-test-result-response.component';
import { ApiTestResData, TestServerRes } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { generateRestFromUrl, syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { ScriptType } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';
import { interval, Subscription, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, takeWhile } from 'rxjs/operators';

import { enumsToArr, JSONParse } from '../../../../../../shared/utils/index.utils';
import {
  ApiBodyType,
  ApiParamsType,
  ApiTabsUniqueName,
  BASIC_TABS_INFO,
  BodyContentType as ContentTypeEnum,
  RequestMethod,
  TabsConfig
} from '../../constants/api.model';
import { ApiParamsNumPipe } from '../../pipe/api-param-num.pipe';
import { ApiTestUtilService } from '../../service/api-test-util.service';
import { TestServerService } from '../../service/test-server/test-server.service';
import { ApiStoreService } from '../../store/api-state.service';

const API_TEST_DRAG_TOP_HEIGHT_KEY = 'API_TEST_DRAG_TOP_HEIGHT';
const localHeight = Number.parseInt(localStorage.getItem(API_TEST_DRAG_TOP_HEIGHT_KEY));

/**
 * Default Content Type
 */
export const ContentTypeMap: { [key in ApiBodyType]: ContentType } = {
  [ApiBodyType.FormData]: 'application/x-www-form-urlencoded',
  [ApiBodyType.Raw]: 'text/plain',
  [ApiBodyType.JSON]: 'application/json',
  [ApiBodyType.JSONArray]: 'application/json',
  [ApiBodyType.XML]: 'application/xml',
  //Binary content type need generate from file type
  [ApiBodyType.Binary]: '' as ContentType
} as const;

@Component({
  selector: 'eo-api-http-test-ui',
  templateUrl: './api-test-ui.component.html',
  styleUrls: ['./api-test-ui.component.scss']
})
export class ApiTestUiComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() model: testViewModel;
  @Input() extraButtonTmp: TemplateRef<HTMLDivElement>;
  @Output() readonly modelChange = new EventEmitter<testViewModel>();
  @Output() readonly afterTested = new EventEmitter<{
    id: string;
    url: string;
    model: {
      testStartTime: number;
      testResult: ApiTestResData;
    };
  }>();
  @ViewChild('authExtForm') authExtForm: AuthorizationExtensionFormComponent;
  @ViewChild(ApiTestResultResponseComponent) apiTestResultResponseComponent: ApiTestResultResponseComponent; // 通过组件类型获取
  validateForm!: FormGroup;
  BEFORE_DATA = BEFORE_DATA;
  AFTER_DATA = AFTER_DATA;
  noAuth = NONE_AUTH_OPTION;
  isDragging = false;
  isEmpty = isEmpty;
  beforeScriptCompletions = beforeScriptCompletions;
  afterScriptCompletions = afterScriptCompletions;

  status: 'start' | 'testing' | 'tested' = 'start';
  waitSeconds = 0;
  responseContainerHeight: number;

  isRequestBodyLoaded = false;
  REQUEST_METHOD = enumsToArr(RequestMethod);
  MAX_TEST_SECONDS = 60;

  currentEnv;
  private reactions = [];
  get uuid() {
    return this.route.snapshot.queryParams.uuid;
  }
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  get isEmptyTestPage(): boolean {
    const { uuid } = this.route.snapshot.queryParams;
    return !this.globalStore.isShare && (!uuid || uuid.includes('history_'));
  }
  get type(): AuthIn {
    const { uuid } = this.route.snapshot.queryParams;
    return uuid?.includes?.('history_') ? 'api-test-history' : 'api-test';
  }

  private status$: Subject<string> = new Subject<string>();
  private timer$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private globalStore: StoreService,
    private store: ApiStoreService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private effect: ApiEffectService,
    private ref: ChangeDetectorRef,
    private apiTestUtil: ApiTestUtilService,
    private testServer: TestServerService,
    private lang: LanguageService,
    private elementRef: ElementRef,
    private apiEdit: ApiEditUtilService,
    private trace: TraceService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.testServer.init(message => {
      this.receiveMessage(message);
    });
    this.status$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(status => {
      this.changeStatus(status);
    });
    this.reactions.push(
      reaction(
        () => this.store.getCurrentEnv,
        value => (this.currentEnv = value),
        { fireImmediately: true }
      )
    );
  }
  get beforeInject() {
    return this.getScript(1);
  }

  set beforeInject(value) {
    this.setScript(1, value);
  }

  get afterInject() {
    return this.getScript(2);
  }

  set afterInject(value) {
    this.setScript(2, value);
  }

  getScript(scriptType: number) {
    return this.model?.request?.scriptList?.find(item => item.scriptType === scriptType)?.data;
  }
  setScript(scriptType: number, value: string) {
    if (this.model?.request?.scriptList) {
      const scriptList = this.model.request.scriptList;
      const item = scriptList.find(item => item.scriptType === scriptType);
      item ? (item.data = value) : this.model.request.scriptList.push({ scriptType: scriptType, data: value });
    } else {
      const valueObj: ScriptType = { scriptType: scriptType, data: value };
      this.model.request.scriptList = [valueObj];
    }
  }

  ngAfterViewInit() {
    queueMicrotask(() => {
      const height = this.elementRef.nativeElement.parentElement.offsetHeight;
      this.responseContainerHeight = Number.isNaN(localHeight) ? height / 2 : localHeight;
    });
  }

  ngOnChanges(changes) {
    console.log(changes.model?.currentValue?.request?.apiAttrInfo);
    if (!changes.model?.currentValue?.request?.apiAttrInfo) return;
    console.log('api-test-ui ngOnChanges', changes.model.currentValue);
    this.initBasicForm();
    //initAuthInfo
    //initHeader/contentType
    //rest test status
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
    this.trace.report('click_api_test');
  }
  changeQuery() {
    this.model.request.uri = syncUrlAndQuery(this.model.request.uri, this.model.request.requestParams.queryParams, {
      nowOperate: 'query',
      method: 'replace'
    }).url;
  }
  updateParamsbyUri() {
    this.model.request.requestParams.queryParams = syncUrlAndQuery(
      this.model.request.uri,
      this.model.request.requestParams.queryParams
    ).query;
  }
  blurUri() {
    this.model.request.requestParams.restParams = [
      ...generateRestFromUrl(this.model.request.uri, this.model.request.requestParams.restParams)
    ];
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }

  /**
   * Return contentType header value by bodyType and userSelectedContentType
   *
   * @param bodyType
   * @returns
   */
  getContentTypeByBodyType(bodyType: ApiBodyType = this.model.request?.apiAttrInfo?.contentType): ContentType | string {
    switch (bodyType) {
      case ApiBodyType.Raw: {
        const isRawHeader = CONTENT_TYPE_BY_ABRIDGE.some(val => val.value === this.model?.userSelectedContentType);
        return isRawHeader ? this.model?.userSelectedContentType : ContentTypeMap[ApiBodyType.JSON];
      }
      case ApiBodyType.FormData: {
        //If params has file，dataType must be multiple/form-data
        if (this.model?.request?.requestParams?.bodyParams?.some(val => val.dataType === ApiParamsType.file)) return 'multiple/form-data';

        const isFormHeader = FORMDATA_CONTENT_TYPE_BY_ABRIDGE.some(val => val.value === this.model?.userSelectedContentType);
        return isFormHeader ? this.model?.userSelectedContentType : ContentTypeMap[ApiBodyType.FormData];
      }
      case ApiBodyType.Binary: {
        return '';
      }
    }
  }
  setHeaderContentType() {
    const bodyType = this.model.request?.apiAttrInfo?.contentType;

    if (bodyType !== ApiBodyType.Binary) {
      const contentType = this.getContentTypeByBodyType();
      this.model.request.requestParams.headerParams = this.apiTestUtil.addOrReplaceContentType(
        contentType,
        this.model.request.requestParams.headerParams
      );
      this.model.userSelectedContentType = contentType as ContentType;
      return;
    }

    //Binary unset request header
    const headerIndex = this.model.request.requestParams.headerParams.findIndex(val => val.name.toLowerCase() === 'content-type');
    if (headerIndex === -1) return;
    this.model.request.requestParams.headerParams.splice(headerIndex, 1);

    //Angular change value by onPush
    this.model.request.requestParams.headerParams = [...this.model.request.requestParams.headerParams];
  }
  changeBodyType($event) {
    StorageUtil.set('api_test_body_type', $event);
  }
  handleBottomTabSelect(tab) {
    if (tab.index === 2) {
      this.isRequestBodyLoaded = true;
    }
  }
  emitChangeFun(where) {
    switch (where) {
      case 'queryParams': {
        this.changeQuery();
        break;
      }
      case 'requestBody': {
        //When bodyType or params change,change header and content-type
        this.setHeaderContentType();
        break;
      }
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
    this.reactions.forEach(dispose => dispose());
  }
  public checkForm(): boolean {
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
        url: this.tabsConfig.pathByName[ApiTabsUniqueName.HttpTest],
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
    this.effect.createHistory({
      apiUuid: this.model.request.apiUuid,
      request: this.apiEdit.formatUIApiDataToStorage(this.model.request),
      response: message.response
    });
  }
  setTestSecondsTimmer() {
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
    this.timer$ = interval(1000)
      .pipe(
        takeWhile(() => {
          if (this.waitSeconds < this.MAX_TEST_SECONDS) return true;
          this.status$.next('tested');
          return false;
        })
      )
      .subscribe(() => this.waitSeconds++);
  }
  downloadFile() {
    this.apiTestResultResponseComponent.downloadResponseText();
  }

  onResizeEnd() {
    this.isDragging = false;
    this.trace.report('drag_test_response_height', { test_response_height: this.responseContainerHeight });
  }

  onResize({ height }: NzResizeEvent): void {
    this.isDragging = true;
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
        this.trace.report('api_test_finish');
        // 测试完自动帮用户将返回高度调到 40%
        const height = this.elementRef.nativeElement.parentElement.offsetHeight * 0.5;
        if (this.responseContainerHeight < height) {
          this.responseContainerHeight = height;
        }
        break;
      }
    }
  }
  setUserSelectedContentType($event = this.model.userSelectedContentType) {
    const bodyType = this.model.request?.apiAttrInfo?.contentType;
    if (bodyType === ApiBodyType.Binary) return;
    this.model.userSelectedContentType =
      this.apiTestUtil.getContentType(this.model.request.requestParams.headerParams) || this.getContentTypeByBodyType(bodyType);
  }
  private watchEnvChange() {
    // reaction(
    //   () => this.store.getCurrentEnv,
    //   (env: any) => {
    //     if (env.uuid) {
    //       this.validateForm.controls.uri.setValidators([]);
    //       this.validateForm.controls.uri.updateValueAndValidity();
    //     } else {
    //       this.validateForm.controls.uri.setValidators([Validators.required]);
    //     }
    //   }
    // );
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    //Init form by model data
    const controls = {};
    controls['uri'] = [this.model.request.uri, [Validators.required]];
    controls['method'] = [this.model.request.apiAttrInfo?.requestMethod, [Validators.required]];
    this.validateForm = this.fb.group(controls);

    //Watch uri changes
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
      //? Settimeout for next loop, when triggle valueChanges, apiData actually isn't the newest data
      this.modelChange.emit(this.model);
    });
  }
}
