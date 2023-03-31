import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { toJS } from 'mobx';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { ApiCase } from 'pc/browser/src/app/services/storage/db/models';
import { TraceService } from 'pc/browser/src/app/services/trace.service';

import { ApiEffectService } from '../../store/api-effect.service';

@Injectable()
export class ApiCaseService {
  constructor(
    private router: Router,
    private effect: ApiEffectService,
    private trace: TraceService,
    private feedback: EoNgFeedbackMessageService,
    private modalService: ModalService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {}
  toDetail(model: ApiCase) {
    // * jump to api detail page
    this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpCase]], {
      queryParams: { uuid: model.apiCaseUuid, apiUuid: model.apiUuid }
    });
  }
  toAdd(apiUuid) {
    this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpCase]], {
      queryParams: { apiUuid, pageID: Date.now() }
    });
  }
  toEdit(id) {
    this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.HttpCase]], {
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
  async copy(id) {
    const [res, err] = await this.effect.detailCase(id);
    if (err) {
      this.feedback.error(`${$localize`Failed to copy`} ${err.message}`);
      return;
    }
    res.name = `${res.name} Copy`;
    const [addRes, addErr] = await this.effect.addCase(res);
    if (addErr) {
      this.feedback.error(`${$localize`Failed to copy`} ${addErr.message}`);
      return;
    }
    if (addRes) {
      this.feedback.success(`${$localize`Copied successfully`}`);
      this.toEdit(addRes.apiCaseUuid);
    }
  }
}
