import { Component, OnInit, Inject, LOCALE_ID, EventEmitter, Input, Output } from '@angular/core';
import { formatDate } from '@angular/common';
import { ApiTestService } from '../api-test.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StorageService } from '../../../../shared/services/storage';
import {
  ApiTestHistory,
  ApiTestHistoryFrame,
  StorageHandleResult,
  StorageHandleStatus,
} from '../../../../../../../../platform/browser/IndexedDB';

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
    private nzMessageService: NzMessageService,
    private apiTest: ApiTestService,
    private storage: StorageService
  ) {
    this.initListConf();
  }

  add(history: ApiTestHistoryFrame, apiID) {
    this.storage.run(
      'apiTestHistoryCreate',
      [
        {
          projectID: 1,
          apiDataID: apiID,
          ...history,
        },
      ],
      (result: StorageHandleResult) => {
        if (result.status === StorageHandleStatus.success) {
          this.parseItem(result.data);
          this.model.unshift(result.data);
        } else {
          console.error(result.data);
        }
      }
    );
  }

  deleteAll() {
    this.storage.run('apiTestHistoryBulkRemove', [this.model.map((val) => val.uuid)], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        this.model = [];
        this.nzMessageService.success('删除成功');
      } else {
        this.nzMessageService.success('删除失败');
        console.error(result.data);
      }
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
    this.storage.run('apiTestHistoryRemove', [inArg.item.uuid], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        this.model.splice(inArg.$index, 1);
        this.nzMessageService.success('删除成功');
      } else {
        this.nzMessageService.success('删除失败');
        console.error(result.data);
      }
    });
  }

  private getList() {
    this.storage.run('apiTestHistoryLoadAllByApiDataID', [this.apiID], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        console.log(result.data)
        result.data.forEach((val: any) => {
          this.parseItem(val);
        });
        this.model = result.data || [];
      } else {
        console.error(result.data);
      }
    });
  }

  private parseItem(item) {
    item.codeClass = this.apiTest.getHTTPStatus(item.response.statusCode).fontClass;
    item.testTime = item.createdAt ? formatDate(item.createdAt, 'YYYY-MM-dd HH:mm:ss', this.locale) : null;
  }
}
