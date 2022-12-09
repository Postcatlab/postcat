import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { JsonRootType, ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
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
  rightExtras = [];
  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    public electron: ElectronService,
    private http: RemoteService,
    public store: StoreService,
    private webExtensionService: WebExtensionService,
    private message: EoNgFeedbackMessageService
  ) {}
  ngOnInit(): void {
    this.init();
    this.initExtensionExtra();
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
  async initExtensionExtra() {
    const apiPreviewTab = this.webExtensionService.getFeatures('apiPreviewTab');
    await apiPreviewTab?.forEach(async (value, key) => {
      if (!this.webExtensionService?.isEnable(key)) {
        return;
      }
      const module = await window.eo?.loadFeatureModule?.(key);
      const rightExtra = value.rightExtra?.reduce((prev, curr) => {
        const eventObj = curr.events?.reduce((event, currEvent) => {
          event[currEvent.name] = (...rest) => {
            module?.[currEvent.handler]?.(...rest);
          };
          return event;
        }, {});
        prev.push({
          ...curr,
          ...eventObj
        });
        return prev;
      }, []);
      this.rightExtras.push(...rightExtra);
    });
    this.rightExtras.forEach(val => {
      //TODO remove after 2023.02
      if (val.icon === 'file-text-one') {
        val.icon = 'file-text';
      }
      console.log(val);
    });
    // console.log('this.rightExtras', this.rightExtras);
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
