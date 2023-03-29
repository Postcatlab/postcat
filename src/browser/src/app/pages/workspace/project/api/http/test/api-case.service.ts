import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiTabsUniqueName, BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';

import { ApiEffectService } from '../../store/api-effect.service';

@Injectable()
export class ApiCaseService {
  constructor(
    private router: Router,
    private effect: ApiEffectService,
    private modalService: ModalService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {}
  toDetail(model: ApiCase) {
    // * jump to api detail page
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpCase]], {
      queryParams: { uuid: model.apiCaseUuid, apiUuid: model.apiUuid }
    });
  }
  toAdd(apiUuid) {
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpCase]], {
      queryParams: { apiUuid, pageID: Date.now() }
    });
  }
  toEdit(id) {
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpCase]], {
      queryParams: { uuid: id }
    });
  }
  toDelete(model: ApiCase) {
    this.modalService.confirm({
      nzTitle: $localize`Deletion Confirmation?`,
      nzContent: $localize`Are you sure you want to delete the data <strong title="${model.name}">${
        model.name.length > 50 ? `${model.name.slice(0, 50)}...` : model.name
      }</strong> ? You cannot restore it once deleted!`,
      nzOnOk: () => {
        this.effect.deleteCase(model.apiCaseUuid);
      }
    });
  }
  copy(id) {}
}
