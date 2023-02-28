import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { TabViewComponent } from 'eo/workbench/browser/src/app/modules/eo-ui/tab/tab.model';
import { ApiStoreService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/store/api-state.service';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { cloneDeep } from 'lodash-es';

import { enumsToObject } from '../../../../../../utils/index.utils';
import { ProjectApiService } from '../../api.service';
@Component({
  selector: 'pc-api-http-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss']
})
export class ApiDetailComponent implements TabViewComponent {
  @Input() model: ApiData | any;
  @Output() readonly eoOnInit = new EventEmitter<ApiData>();
  originModel: ApiData | any;
  CONST = {
    BODY_TYPE: enumsToObject(ApiBodyType)
  };
  url: string = '';
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  constructor(
    private route: ActivatedRoute,
    private projectApi: ProjectApiService,
    public electron: ElectronService,
    public store: StoreService,
    public apiStore: ApiStoreService
  ) {}
  private getEnvUrl(url) {
    if (!this.apiStore.getCurrentEnv?.hostUri) return url;
    try {
      const isUrl = new URL(url);
      if (isUrl.origin) {
        return url;
      }
      return this.apiStore.getCurrentEnv.hostUri + url;
    } catch (e) {
      return this.apiStore.getCurrentEnv.hostUri + url;
    }
  }
  async init() {
    if (!this.model) {
      this.model = {} as ApiData;
      const { uuid } = this.route.snapshot.queryParams;
      if (uuid) {
        this.model = await this.projectApi.get(uuid);
        this.originModel = cloneDeep(this.model);
      } else {
        console.error(`Can't no find api`);
      }
    }

    this.url = this.getEnvUrl(this.model.uri);
    this.eoOnInit.emit(this.model);
  }
}
