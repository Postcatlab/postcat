import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';
import { BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiEffectService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-effect.service';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { Group } from 'pc/browser/src/app/services/storage/db/models';

@Injectable({
  providedIn: 'any'
})
export class ApiGroupService {
  constructor(
    private feedback: EoNgFeedbackMessageService,
    private router: Router,
    private effect: ApiEffectService,
    private store: ApiStoreService,
    private modalService: ModalService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {}

  navigate2group(queryParams) {
    this.router.navigate([this.tabsConfig.pathByName[PageUniqueName.GroupEdit]], {
      queryParams
    });
  }
  toDetail(id) {
    this.navigate2group({ uuid: id });
  }
  toAdd(groupID = this.store.getRootGroup.id) {
    this.navigate2group({ parentId: groupID });
    this.feedback.success('Add Group successfully');
  }
  toDelete(group: Group) {
    const modelRef = this.modalService.confirm({
      nzTitle: $localize`Deletion Confirmation?`,
      nzContent: $localize`Are you sure you want to delete the data <strong title="${group.name}">${
        group.name.length > 50 ? `${group.name.slice(0, 50)}...` : group.name
      }</strong>`,
      nzOnOk: async () => {
        const [, err] = await this.effect.deleteGroup(group);
        if (err) {
          this.feedback.error('Failed to delete');
          modelRef.destroy();
          return;
        }
        this.feedback.success('Successfully deleted');
        modelRef.destroy();
      }
    });
  }
  async copy(id: string) {}
  toEdit(id) {
    this.navigate2group({ uuid: id });
  }
}
