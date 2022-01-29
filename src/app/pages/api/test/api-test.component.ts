import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';

import { ApiData, RequestMethod, RequestProtocol } from 'eoapi-core';
import { EOService } from '../../../shared/services/eo.service';
import { MessageService } from '../../../shared/services/message';

import { interval, Subscription, Observable, of, Subject } from 'rxjs';
import { take, takeUntil, distinctUntilChanged, pairwise, filter } from 'rxjs/operators';

import { ApiTestHistoryComponent } from './history/api-test-history.component';

import { TestServerService } from '../../../shared/services/api-test/test-server.service';
import { ApiTestService } from './api-test.service';
import { ApiTabService } from '../tab/api-tab.service';
import { objectToArray } from '../../../utils';

import { EnvState } from '../../../shared/store/env.state';
import { ApiParamsNumPipe } from '../../../shared/pipes/api-param-num.pipe';

@Component({
  selector: 'eo-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit, OnDestroy {
  @ViewChild('historyComponent') historyComponent: ApiTestHistoryComponent;
  @Select(EnvState) env$: Observable<any>;
  validateForm!: FormGroup;
  apiData: any;
  env: any = {
    parameters: [],
    hostUri: '',
  };
  status: 'start' | 'testing' | 'tested' = 'start';
  waitSeconds = 0;
  tabIndexRes: number = 0;
  testResult: any = {
    response: {},
    request: {},
  };
  testServer;
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);

  private status$: Subject<string> = new Subject<string>();
  private timer$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private eo: EOService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private apiTest: ApiTestService,
    private apiTab: ApiTabService,
    private testServerService: TestServerService,
    private messageService: MessageService
  ) {
    this.testServer = this.testServerService.getService();
    this.testServer.init((message) => {
      this.receiveMessage(message);
    });
    this.status$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((status) => {
      this.changeStatus(status);
    });
  }
  clickTest() {
    switch (this.status) {
      case 'testing': {
        this.abort();
        break;
      }
      default: {
        this.messageService.send({ type: 'clear', data: null });
        this.test();
        break;
      }
    }
  }
  /**
   * click history to restore data from history
   * @param item  test history data
   */
  restoreHistory(item) {
    let result = this.apiTest.getTestDataFromHistory(item);
    //restore request
    this.apiData = result.testData;
    this.changeUri();
    //restore response
    this.tabIndexRes = 0;
    this.testResult = result.response;
  }
  getApi(id) {
    this.eo.getStorage().apiDataLoad(id).subscribe((result: ApiData) => {
      this.apiData = this.apiTest.getTestDataFromApi(result);
      this.validateForm.patchValue(this.apiData);
    });
  }
  saveTestDataToApi() {
    let apiData = this.apiTest.getApiFromTestData({
      history: this.testResult,
      testData: this.apiData,
    });
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.apiTab.apiEvent$.next({ action: 'addApiFromTest', data: apiData });
  }
  changeQuery() {
    this.apiData.uri = this.apiTest.transferUrlAndQuery(this.apiData.uri, this.apiData.queryParams, {
      priority: 'query',
      replaceType: 'replace',
    }).url;
  }
  changeUri() {
    this.apiData.queryParams = this.apiTest.transferUrlAndQuery(this.apiData.uri, this.apiData.queryParams, {
      priority: 'url',
      replaceType: 'replace',
    }).query;
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  ngOnInit(): void {
    this.initApi(Number(this.route.snapshot.queryParams.uuid));
    this.watchTabChange();
    this.watchEnvChange();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.testServer.close();
  }
  private test() {
    this.testServer.send('unitTest', {
      id: this.apiTab.tabID,
      action: 'ajax',
      data: this.testServer.formatRequestData(this.apiData, {
        env: this.env,
      }),
    });
    this.status$.next('testing');
  }
  private abort() {
    this.testServer.send('unitTest', {
      id: this.apiTab.tabID,
      action: 'abort',
    });
    this.status$.next('tested');
  }
  private addHistory(message, id) {
    //Only has statusCode need save report
    if (message.report.response.statusCode) {
      this.historyComponent.add(message.history, id);
    }
  }
  /**
   * Receive Test Server Message
   */
  private receiveMessage(message) {
    // other tab test finish,support multiple tab test same time
    if (message.id && this.apiTab.tabID !== message.id) {
      this.apiTab.tabCache[message.id].testResult = message.report;
      let tab = this.apiTab.tabs.find((val) => val.uuid === message.id);
      if (tab) {
        this.addHistory(message, tab.key);
      }
      return;
    }
    this.testResult = message.report;
    this.addHistory(message, this.apiData.uuid);
    this.status$.next('tested');
  }
  /**
   * Change test status
   * @param status - 'start'|'testing'|'tested'
   */
  private changeStatus(status) {
    this.status = status;
    switch (status) {
      case 'testing': {
        this.timer$ = interval(1000)
          .pipe(take(5))
          .subscribe((val) => {
            this.waitSeconds = val + 1;
          });
        break;
      }
      case 'tested': {
        this.timer$.unsubscribe();
        this.waitSeconds = 0;
        this.tabIndexRes = 0;
        this.ref.detectChanges();
        break;
      }
    }
  }
  private initApi(id) {
    this.resetForm();
    this.initBasicForm();
    //recovery from tab
    if (this.apiTab.currentTab && this.apiTab.tabCache[this.apiTab.tabID]) {
      let tabData = this.apiTab.tabCache[this.apiTab.tabID];
      this.apiData = tabData.apiData;
      this.testResult = tabData.testResult;
      return;
    }
    if (!id) {
      Object.assign(this.apiData, {
        uuid: 0,
        requestBodyType: 'json',
        requestBodyJsonType: 'object',
        requestBody: [],
        queryParams: [],
        restParams: [],
        requestHeaders: [],
      });
    } else {
      this.getApi(id);
    }
  }
  private watchEnvChange() {
    this.env$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const { env } = data;
      if (env) {
        this.env = env;
      }
    });
  }
  private watchTabChange() {
    this.apiTab.tabChange$
      .pipe(
        pairwise(),
        //actually change tab,not init tab
        filter((data) => data[0].uuid !== data[1].uuid),
        takeUntil(this.destroy$)
      )
      .subscribe(([nowTab, nextTab]) => {
        this.apiTab.saveTabData$.next({
          tab: nowTab,
          data: {
            apiData: this.apiData,
            testResult: this.testResult,
          },
        });
        this.initApi(nextTab.key);
      });
  }
  /**
   * Init API data structure
   */
  private resetForm() {
    this.apiData = {
      projectID: 1,
      uri: '/',
      protocol: RequestProtocol.HTTP,
      method: RequestMethod.POST,
    };
    this.testResult = {
      response: {},
      request: {},
    };
    this.status$.next('start');
    if (this.timer$) this.timer$.unsubscribe();
    this.waitSeconds = 0;
    this.tabIndexRes = 0;
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    const controls = {};
    ['protocol', 'method', 'uri'].forEach((name) => {
      controls[name] = [this.apiData[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
