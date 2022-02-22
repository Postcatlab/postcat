import { Component, OnInit, Inject, LOCALE_ID, EventEmitter, Input, Output } from '@angular/core';
import { formatDate } from '@angular/common';

import { ApiTestHistoryService } from '../../../../shared/services/api-test-history/api-test-history.service';
import { ApiTestService } from '../api-test.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiTestHistory, ApiTestHistoryFrame } from '../../../../shared/services/api-test-history/api-test-history.model';
@Component({
  selector: 'eo-api-test-history',
  templateUrl: './api-test-history.component.html',
  styleUrls: ['./api-test-history.component.scss'],
})
export class ApiTestHistoryComponent implements OnInit {
  listConf = {};
  model: ApiTestHistory[] | object[];
  @Input() apiID: number;
  @Output() clickItem: EventEmitter<any> = new EventEmitter();
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private apiTestHistory: ApiTestHistoryService,
    private nzMessageService: NzMessageService,
    private apiTest: ApiTestService
  ) {
    this.initListConf();
  }
  add(history: ApiTestHistoryFrame,apiID) {
    this.apiTestHistory
      .create({
        projectID: 1,
        apiDataID: apiID,
        ...history,
      })
      .subscribe({
        next: (item: ApiTestHistory) => {
          this.parseItem(item);
          this.model.unshift(item);
        },
        error: console.error,
      });
  }
  deleteAll() {
    this.apiTestHistory.bulkRemove(this.model.map((val) => val.uuid)).subscribe({
      next: (res) => {
        this.model = [];
        this.nzMessageService.success('删除成功');
      },
      error: console.error,
    });
  }
  ngOnChanges(changes) {
    if (changes && changes.apiID && changes.apiID.currentValue !== undefined) {
      this.getList();
    }
  }
  ngOnInit(): void {}
  private initListConf() {
    this.listConf = {
      setting: {
        munalHideOperateColumn: true,
        trClass: 'cp',
      },
      baseFun: {
        trClick: (inArg) => {
          this.clickItem.emit(inArg.item);
        },
      },
      tdList: [
        {
          thKey: '测试时间',
          type: 'text',
          modelKey: 'testTime',
          class: 'pl20 w_180',
        },
        {
          thKey: '请求地址',
          type: 'html',
          html: '<span class="method_text_{{item.request.method}} method_label mr5">{{item.request.method}}</span>{{item.request.uri}}',
        },
        {
          thKey: '返回状态',
          type: 'html',
          class: 'w_100',
          html: `<span class="{{item.codeClass}}">{{item.response.statusCode}}</span>`,
        },
        {
          thKey: '请求时长(ms)',
          type: 'html',
          html: '{{item.response.testDeny}}',
          class: 'w_120',
        },
        {
          type: 'btn',
          class: 'w_100',
          btnList: [
            {
              key: '删除',
              operateName: 'delete',
              fun: (inArg) => {
                this.delete(inArg);
              },
            },
          ],
        },
      ],
    };
  }
  private delete(inArg) {
    this.apiTestHistory.remove(inArg.item.uuid).subscribe({
      next: (res) => {
        this.model.splice(inArg.$index, 1);
        this.nzMessageService.success('删除成功');
      },
      error: console.error,
    });
  }
  private getList() {
    this.apiTestHistory.loadAllByApiDataID(this.apiID).subscribe({
      next: (res) => {
        res.forEach((val: any) => {
          this.parseItem(val);
        });
        this.model = res || [];
      },
      error: console.error,
    });
  }
  private parseItem(item) {
    item.codeClass = this.apiTest.getHTTPStatus(item.response.statusCode).fontClass;
    item.testTime = formatDate(item.createdAt, 'YYYY-MM-dd HH:mm:ss', this.locale);
  }
}
