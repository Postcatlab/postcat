import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { JsonRootType, ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { cloneDeep } from 'lodash-es';

import { ApiData, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';
import { reverseObj } from '../../../../utils/index.utils';
@Component({
  selector: 'api-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss']
})
export class ApiDetailComponent implements OnInit {
  @Input() model: ApiData | any;
  @Output() readonly eoOnInit = new EventEmitter<ApiData>();
  originModel: ApiData | any;
  CONST = {
    BODY_TYPE: reverseObj(ApiBodyType),
    JSON_ROOT_TYPE: reverseObj(JsonRootType)
  };
  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    public electron: ElectronService,
    private http: RemoteService,
    public store: StoreService,
    private message: EoNgFeedbackMessageService
  ) {}
  ngOnInit(): void {
    this.init();
  }
  handleCopy(link) {
    if (!link) {
      return;
    }
    const isOk = copy(link);
    if (isOk) {
      this.message.success($localize`Copied`);
    }
  }
  async init() {
    if (!this.model) {
      this.model = {} as ApiData;
      const id = Number(this.route.snapshot.queryParams.uuid);
      if (id) {
        this.model = (await this.getApiByUuid(Number(id))) as ApiData;
      } else {
        console.error(`Can't no find api`);
      }
    }
    this.eoOnInit.emit(this.model);
  }

  getApiByUuid(id: number) {
    return new Promise(async resolve => {
      if (this.store.isShare) {
        const [data, err]: any = await this.http.api_shareDocGetApiDetail({
          apiDataUUID: id,
          uniqueID: this.store.getShareID
        });
        if (err) {
          return;
        }
        this.originModel = cloneDeep(data);
        this.model = data;
        resolve(this.model);
        return;
      }
      this.storage.run('apiDataLoad', [id], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.originModel = cloneDeep(result.data);
          this.model = result.data;
          resolve(this.model);
        }
      });
    });
  }
}
