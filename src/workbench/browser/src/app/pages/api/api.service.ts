import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiData, StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { ExportApiComponent } from '../../shared/components/export-api/export-api.component';
import { MessageService } from '../../shared/services/message';
import { StorageService } from '../../shared/services/storage';
@Injectable()
export class ApiService {
  constructor(
    private nzModalService: NzModalService,
    private messageService: MessageService,
    private storage: StorageService
  ) {}

  copy({ uuid, createdAt, ...data }: ApiData): void {
    data.name += ' Copy';
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(data));
    this.messageService.send({ type: 'copyApi', data });
  }

  delete({ name, uuid }: ApiData): void {
    this.nzModalService.confirm({
      nzTitle: $localize`删除确认?`,
      nzContent: $localize`确认要删除数据 <strong title="${name}">${
        name.length > 50 ? name.slice(0, 50) + '...' : name
      }</strong> 吗？删除后不可恢复！`,
      nzOnOk: () => {
        this.storage.run('apiDataRemove', [uuid], (result: StorageRes) => {
          if (result.status === StorageResStatus.success) {
            this.messageService.send({ type: 'deleteApiSuccess', data: { uuid } });
          }
        });
      },
    });
  }
  bulkDelete(apis) {
    this.storage.run('apiDataBulkRemove', [apis], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.messageService.send({ type: 'bulkDeleteApiSuccess', data: { uuids: apis } });
      }
    });
  }
}
