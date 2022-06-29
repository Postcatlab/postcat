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
      nzTitle: $localize`Deletion Confirmation?`,
      nzContent: $localize`Are you sure you want to delete the data <strong title="${name}">${
        name.length > 50 ? name.slice(0, 50) + '...' : name
      }</strong> ? You cannot restore it once deleted!`,
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
