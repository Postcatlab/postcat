import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';
import { JsonRootType, ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { copy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { cloneDeep } from 'lodash-es';

import { ApiData } from '../../../../../../shared/services/storage/index.model';
import { reverseObj } from '../../../../../../utils/index.utils';
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
    private apiService: ProjectApiService,
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
      const id = Number(this.route.snapshot.queryParams.uuid);
      if (id) {
        this.model = await this.apiService.get(id);
        this.originModel = cloneDeep(this.model);
      } else {
        console.error(`Can't no find api`);
      }
    }
    this.eoOnInit.emit(this.model);
  }
}
