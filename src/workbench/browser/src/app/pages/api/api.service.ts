import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiData, StorageHandleResult, StorageHandleStatus } from '../../../../../../platform/browser/IndexedDB';
import { ExportApiComponent } from '../../shared/components/export-api/export-api.component';
import { MessageService } from '../../shared/services/message';
import { ModalService } from '../../shared/services/modal.service';
import { StorageService } from '../../shared/services/storage';
@Injectable()
export class ApiService {
  constructor(
    private nzModalService: NzModalService,
    private modalService: ModalService,
    private messageService: MessageService,
    private storage: StorageService
  ) {}

  copy(apiData: ApiData): void {
    delete apiData.uuid;
    delete apiData.createdAt;
    apiData.name += ' Copy';
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.messageService.send({ type: 'copyApi', data: apiData });
  }

  delete(apiData: ApiData): void {
    this.nzModalService.confirm({
      nzTitle: '删除确认?',
      nzContent: `确认要删除数据 <strong title="${apiData.name}">${
        apiData.name.length > 50 ? apiData.name.slice(0, 50) + '...' : apiData.name
      }</strong> 吗？删除后不可恢复！`,
      nzOnOk: () => {
        this.storage.run('apiDataRemove', [apiData.uuid], (result: StorageHandleResult) => {
          if (result.status === StorageHandleStatus.success) {
            this.messageService.send({ type: 'deleteApi', data: { uuid: apiData.uuid } });
          }
        });
      },
    });
  }
  bulkDelete(apis) {
    this.storage.run('apiDataBulkRemove', [apis], (result: StorageHandleResult) => {
      if (result.status === StorageHandleStatus.success) {
        this.messageService.send({ type: 'bulkDeleteApi', data: { uuids: apis } });
      }
    });
  }
  export(apiData: ApiData) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: "导出 API",
      nzContent: ExportApiComponent,
      nzClosable: false,
      nzComponentParams:{},
      nzOnOk() {
        modal.componentInstance.submit();
      },
    });
  }
  bulkExport(groups) {}
}
