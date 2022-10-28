import { Injectable } from '@angular/core';
import { ApiData, StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { MessageService } from '../../shared/services/message';
import { StorageService } from '../../shared/services/storage';
import { Router } from '@angular/router';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { ShareService } from 'eo/workbench/browser/src/app/shared/services/share.service';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private messageService: MessageService,
    private message: EoMessageService,
    private router: Router,
    private storage: StorageService,
    private status: StatusService,
    private http: RemoteService,
    private share: ShareService
  ) {}
  get(uuid): Promise<ApiData> {
    return new Promise(async (resolve) => {
      if (this.status.isShare) {
        const [data, err]: any = await this.http.api_shareDocGetAllApi({
          uniqueID: this.share.shareId,
        });
        if (err) {
          return;
        }
        return resolve(data);
      }
      this.storage.run('apiDataLoad', [uuid], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          this.message.error(`Can't find this Api`);
        }
      });
    });
  }
  getAll(projectID): Promise<StorageRes> {
    return new Promise((resolve) => {
      this.storage.run('apiDataLoadAllByProjectID', [projectID], resolve);
    });
  }
  add(apiData: ApiData): Promise<StorageRes> {
    return new Promise((resolve) => {
      this.storage.run('apiDataCreate', [apiData], resolve);
    });
  }
  async copy({ uuid, createdAt, ...apiData }: ApiData) {
    apiData.name += ' Copy';
    const result = await this.add(apiData);
    this.router.navigate(['/home/api/http/edit'], {
      queryParams: { pageID: Date.now(), uuid: result.data.uuid },
    });
    this.messageService.send({ type: 'copyApiSuccess', data: { uuids: [uuid] } });
  }
  delete(uuid): void {
    this.storage.run('apiDataRemove', [uuid], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.messageService.send({ type: 'deleteApiSuccess', data: { uuids: [uuid] } });
      }
    });
  }
  bulkDelete(apis) {
    this.storage.run('apiDataBulkRemove', [apis], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.messageService.send({ type: 'deleteApiSuccess', data: { uuids: apis } });
      }
    });
  }
}
