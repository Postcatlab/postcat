import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { ApiBodyType } from 'eo/workbench/browser/src/app/shared/services/storage/db/enums/api.enum';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { cloneDeep } from 'lodash-es';

import { reverseObj } from '../../../../../../utils/index.utils';
import { ProjectApiService } from '../../api.service';
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
    BODY_TYPE: reverseObj(ApiBodyType)
  };
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  constructor(
    private route: ActivatedRoute,
    private projectApi: ProjectApiService,
    public electron: ElectronService,
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
      const uuid = this.route.snapshot.queryParams.uuid;
      if (uuid) {
        this.model = await this.projectApi.get(uuid);
        this.originModel = cloneDeep(this.model);
      } else {
        console.error(`Can't no find api`);
      }
    }
    this.eoOnInit.emit(this.model);
  }
}
