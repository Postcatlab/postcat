import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiData,
  ApiBodyType,
  JsonRootType,
  StorageRes,
  StorageResStatus,
} from '../../../../shared/services/storage/index.model';
import { treeToListHasLevel } from '../../../../utils/tree/tree.utils';
import { reverseObj } from '../../../../utils/index.utils';
import { StorageService } from '../../../../shared/services/storage';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { ShareService } from 'eo/workbench/browser/src/app/shared/services/share.service';
import { WebExtensionService } from 'eo/workbench/browser/src/app/shared/services/web-extension/webExtension.service';
import { cloneDeep } from 'lodash-es';
@Component({
  selector: 'api-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss'],
})
export class ApiDetailComponent implements OnInit {
  @Input() model: ApiData | any;
  @Output() eoOnInit = new EventEmitter<ApiData>();
  originModel: ApiData | any;
  CONST = {
    BODY_TYPE: reverseObj(ApiBodyType),
    JSON_ROOT_TYPE: reverseObj(JsonRootType),
  };
  mockListColumns = [
    { title: $localize`Name`, slot: 'name', width: '20%' },
    { title: $localize`Created Type`, slot: 'createWay', width: '18%' },
    { title: 'URL', slot: 'url', width: '42%' },
  ];
  rightExtras = [];
  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    private status: StatusService,
    public electron: ElectronService,
    private http: RemoteService,
    private share: ShareService,
    private webExtensionService: WebExtensionService
  ) {}
  ngOnInit(): void {
    this.init();
    this.initExtensionExtra();
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
    console.log('apiPreviewTab', apiPreviewTab);
    apiPreviewTab?.forEach(async (value, key) => {
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
          ...eventObj,
        });
        return prev;
      }, []);
      this.rightExtras.push(...rightExtra);
    });
    console.log('this.rightExtras', this.rightExtras);
  }
  handleClick() {
    console.log('click icon');
  }
  getApiByUuid(id: number) {
    return new Promise(async (resolve) => {
      if (this.status.isShare) {
        const [data, err]: any = await this.http.api_shareDocGetApiDetail({
          apiDataUUID: id,
          uniqueID: this.share.shareId,
        });
        if (err) {
          return;
        }
        this.originModel = cloneDeep(data);
        ['requestBody', 'responseBody'].forEach((tableName) => {
          if (['xml', 'json'].includes(data[`${tableName}Type`])) {
            data[tableName] = treeToListHasLevel(data[tableName]);
          }
        });
        this.model = data;
        resolve(this.model);
        return;
      }
      this.storage.run('apiDataLoad', [id], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.originModel = cloneDeep(result.data);
          ['requestBody', 'responseBody'].forEach((tableName) => {
            if (['xml', 'json'].includes(result.data[`${tableName}Type`])) {
              result.data[tableName] = treeToListHasLevel(result.data[tableName]);
            }
          });
          this.model = result.data;
          resolve(this.model);
        }
      });
    });
  }
}
