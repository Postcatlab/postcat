import { Injectable } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiDataService } from '../../shared/services/api-data/api-data.service';
import { MessageService } from '../../shared/services/message';

@Injectable()
export class ApiService {
  constructor(
    private apiDataService: ApiDataService,
    private modalService: NzModalService,
    private messageService: MessageService
  ) {}
  /**
   * Copy api data.
   *
   * @param node NzTreeNode
   */
  copy(apiData): void {
    delete apiData.uuid;
    delete apiData.createdAt;
    apiData.name += ' Copy';
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.messageService.send({ type: 'copyApi', data: apiData });
  }

  /**
   * Delete api data.
   *
   * @param node NzTreeNode
   */
  delete(apiData): void {
    this.modalService.confirm({
      nzTitle: '删除确认?',
      nzContent: `确认要删除数据 <strong title="${apiData.title}">${
        apiData.title.length > 50 ? apiData.title.slice(0, 50) + '...' : apiData.title
      }</strong> 吗？删除后不可恢复！`,
      nzOnOk: () => {
        this.apiDataService.remove(apiData.key).subscribe((result: boolean) => {
          this.messageService.send({ type: 'deleteApi', data: { uuid: apiData.key } });
        });
      },
    });
  }
}
