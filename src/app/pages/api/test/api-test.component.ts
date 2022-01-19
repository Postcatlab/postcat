import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';

import { ApiData, RequestMethod, RequestProtocol } from '../../../shared/services/api-data/api-data.model';

import { MessageService } from '../../../shared/services/message';

import { interval, Subscription, Observable, of, Subject } from 'rxjs';
import { take, takeUntil, distinctUntilChanged, pairwise } from 'rxjs/operators';

import { ApiTestHistoryComponent } from './history/api-test-history.component';

import { TestServerService } from '../../../shared/services/api-test/test-server.service';
import { ApiDataService } from '../../../shared/services/api-data/api-data.service';
import { ApiTestService } from './api-test.service';
import { ApiTabService } from '../tab/api-tab.service';
import { objectToArray } from '../../../utils';

import { EnvState } from '../../../shared/store/env.state';

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
  private api$: Observable<object>;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private testServerService: TestServerService,
    private storage: ApiDataService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private ref: ChangeDetectorRef,
    private apiTest: ApiTestService,
    private apiTab: ApiTabService
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
    this.storage.load(id).subscribe((result: ApiData) => {
      this.apiData = this.apiTest.getTestDataFromApi(result);
      this.validateForm.patchValue(this.apiData);
    });
  }
  saveTestDataToApi() {
    let apiData = this.apiTest.getApiFromTestData({
      history: this.testResult,
      testData: this.apiData,
    });
    window.sessionStorage.setItem('testDataToAPI', JSON.stringify(apiData));
    this.router.navigate(['/home/api/edit']);
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
  ngOnInit(): void {
    console.log('ngOnInit');
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
      id: 1,
      action: 'ajax',
      data: this.testServer.formatRequestData(this.apiData, {
        env: this.env,
      }),
    });
    this.status$.next('testing');
  }
  private abort() {
    this.testServer.send('unitTest', {
      id: 1,
      action: 'abort',
    });
    this.status$.next('tested');
  }
  /**
   * Receive Test Server Message
   */
  private receiveMessage(message) {
    this.testResult = message.report;
    //Only has statusCode need save report
    if (this.testResult.response.statusCode) {
      this.historyComponent.add(message.history);
    }
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
    this.resetApi();
    this.initBasicForm();
    //recovery from tab
    if (this.apiTab.currentTab && this.apiTab.tabs[this.apiTab.currentTab.uuid]) {
      this.apiData = this.apiTab.tabs[this.apiTab.currentTab.uuid];
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
    this.apiTab.tabChange$.pipe(pairwise(), takeUntil(this.destroy$)).subscribe(([nowTab, nextTab]) => {
      this.apiTab.saveTabData$.next({ tab: nowTab, data: this.apiData });
      this.initApi(nextTab.key);
    });
  }
  /**
   * Init API data structure
   */
  private resetApi() {
    this.apiData = {
      projectID: 1,
      uri: '/',
      protocol: RequestProtocol.HTTP,
      method: RequestMethod.POST,
    };
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
