import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { reaction } from 'mobx';
import { TabViewComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { ElectronService } from 'pc/browser/src/app/core/services';
import { ApiBodyType } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { StoreService } from 'pc/browser/src/app/store/state.service';

import { enumsToObject } from '../../../../../../shared/utils/index.utils';
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
    public globalStore: StoreService,
    public store: ApiStoreService
  ) {
    this.watchEnvChange();
  }
  watchEnvChange() {
    reaction(
      () => this.store.getCurrentEnv,
      (env: any) => {
        this.url = this.getEnvUrl(this.model.uri);
      }
    );
  }
  private getEnvUrl(url) {
    if (!this.store.getCurrentEnv?.hostUri) return url;
    try {
      const isUrl = new URL(url);
      if (isUrl.origin) {
        return url;
      }
      return this.store.getCurrentEnv.hostUri + url;
    } catch (e) {
      return this.store.getCurrentEnv.hostUri + url;
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
