import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ImportApiComponent } from 'pc/browser/src/app/components/extension-select/import-api/import-api.component';
import { SyncApiComponent } from 'pc/browser/src/app/components/extension-select/sync-api/sync-api.component';
import { ApiTabsUniqueName, BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ModalService } from 'pc/browser/src/app/services/modal.service';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';

import { ApiService } from '../../../../services/storage/api.service';
import { StoreService } from '../../../../shared/store/state.service';
import { ApiEffectService } from './store/api-effect.service';

@Injectable()
export class ProjectApiService {
  actionComponent = {
    sync: SyncApiComponent,
    import: ImportApiComponent
  };

  constructor(
    private feedback: EoNgFeedbackMessageService,
    private router: Router,
    private effect: ApiEffectService,
    private api: ApiService,
    private globalStore: StoreService,
    private modalService: ModalService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {}
  async get(uuid): Promise<ApiData> {
    const [result, err] = await (this.globalStore.isShare
      ? this.api.api_shareApiDataDetail({ apiUuids: [uuid], withParams: 1, sharedUuid: this.globalStore.getShareID })
      : this.api.api_apiDataDetail({ apiUuids: [uuid], withParams: 1 }));
    if (err || !result?.[0]) {
      console.error(err);
      this.feedback.error($localize`Can't find this API`);
      return;
    }
    const apiData = result[0];
    apiData.apiAttrInfo ??= {};
    apiData.responseList ??= [
      {
        responseParams: {
          headerParams: [],
          bodyParams: []
        }
      }
    ];
    apiData.responseList[0].responseParams ??= {
      responseParams: {
        headerParams: [],
        bodyParams: []
      }
    };
    return apiData;
  }
  async edit(apiData: ApiData) {
    return await this.api.api_apiDataUpdate({ api: apiData });
  }
  async add(apiData: ApiData) {
    return await this.api.api_apiDataCreate({ apiList: [].concat([apiData]) });
  }
  async delete(id) {
    // * delete API
    const [, err] = await this.api.api_apiDataDelete({
      apiUuids: [id]
    });
    if (err) {
      this.feedback.error($localize`Delete API failed`);
      return;
    }
    this.feedback.success($localize`Deleted API Successfully`);
    this.effect.getGroupList();
  }
  toDetail(id) {
    // * jump to api detail page
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpDetail]], {
      queryParams: { uuid: id }
    });
  }
  toAdd(groupID?) {
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpEdit]], {
      queryParams: { groupId: groupID, pageID: Date.now() }
    });
  }
  toEdit(id) {
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpEdit]], {
      queryParams: { uuid: id }
    });
  }
  toDelete(apiInfo: ApiData) {
    this.modalService.confirm({
      nzTitle: $localize`Deletion Confirmation?`,
      nzContent: $localize`Are you sure you want to delete the data <strong title="${apiInfo.name}">${
        apiInfo.name.length > 50 ? `${apiInfo.name.slice(0, 50)}...` : apiInfo.name
      }</strong> ? You cannot restore it once deleted!`,
      nzOnOk: () => {
        this.delete(apiInfo.apiUuid);
      }
    });
  }
  async copy(inApiUuid: string) {
    const { apiUuid, id, ...apiData } = await this.get(inApiUuid);
    apiData.name += ' Copy';
    const [result, err] = await this.add(apiData);
    if (err) {
      console.log(err);
      this.feedback.error($localize`Copy API failed`);
      return;
    }
    this.router.navigate([this.tabsConfig.pathByName[ApiTabsUniqueName.HttpEdit]], {
      queryParams: { pageID: Date.now(), uuid: result[0].apiUuid }
    });
    this.effect.getGroupList();
  }

  importProject(type: keyof typeof this.actionComponent, title) {
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: this.actionComponent[type],
      nzComponentParams: {},
      nzFooter: [
        {
          label: $localize`Cancel`,
          onClick: () => modal.destroy()
        },
        {
          label: this.actionComponent[type] === SyncApiComponent ? $localize`Save and Sync` : $localize`Confirm`,
          disabled: () => !modal.componentInstance?.isValid,
          type: 'primary',
          onClick: () => {
            return new Promise(resolve => {
              modal.componentInstance.submit(status => {
                if (!status) {
                  this.feedback.error($localize`Failed to ${title},Please upgrade extension or try again later`);
                  return resolve(true);
                }
                if (status === 'stayModal') {
                  return resolve(true);
                }
                // Import API
                this.effect.getGroupList();
                this.feedback.success($localize`${title} successfully`);
                resolve(true);
                modal.destroy();
              }, modal);
            });
          }
        }
      ]
    });
  }
}
