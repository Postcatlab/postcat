import { Injectable } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiData } from 'eoapi-core';
import { StorageService } from '../../shared/services/storage.service';
import { MessageService } from '../../shared/services/message';

@Injectable()
export class ApiService {
  constructor(
    private storage: StorageService,
    private modalService: NzModalService,
    private messageService: MessageService
  ) {}

  copy(apiData: ApiData): void {
    delete apiData.uuid;
    delete apiData.createdAt;
    apiData.name += ' Copy';
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.messageService.send({ type: 'copyApi', data: apiData });
  }

  delete(apiData: ApiData): void {
    this.modalService.confirm({
      nzTitle: '删除确认?',
      nzContent: `确认要删除数据 <strong title="${apiData.name}">${
        apiData.name.length > 50 ? apiData.name.slice(0, 50) + '...' : apiData.name
      }</strong> 吗？删除后不可恢复！`,
      nzOnOk: () => {
        this.storage.storage.apiDataRemove(apiData.uuid).subscribe((result: boolean) => {
          this.messageService.send({ type: 'deleteApi', data: { uuid: apiData.uuid } });
        });
      },
    });
  }
  bulkDelete(apis) {
    this.storage.storage.apiDataBulkRemove(apis).subscribe((result) => {
      this.messageService.send({ type: 'bulkDeleteApi', data: { uuids: apis } });
    });
  }
}
