import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiService } from 'pc/browser/src/app/services/storage/api.service';
import { ApiCase, Group } from 'pc/browser/src/app/services/storage/db/models';
import { ApiData } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { eoDeepCopy, JSONParse } from 'pc/browser/src/app/shared/utils/index.utils';
import { PCTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';

import { ApiStoreService } from './api-state.service';

@Injectable({
  providedIn: 'root'
})
export class ApiEffectService {
  constructor(
    private store: ApiStoreService,
    private globalStore: StoreService,
    private api: ApiService,
    private trace: TraceService,
    private feedback: EoNgFeedbackMessageService
  ) {}
  async deleteMock(id) {
    // * delete mock
    const [, err] = await this.api.api_mockDelete({
      id: id
    });
    if (err) {
      return;
    }
    // * update API
  }

  //? History
  async createHistory(params) {
    params.request = JSON.stringify(params.request);
    params.response = JSON.stringify(params.response);
    params.general = '{}';
    const [data] = await this.api.api_apiTestHistoryCreate(params);
    this.store.setHistory([...this.store.getTestHistory, data]);
    return data;
  }
  async getHistory(id) {
    const [res, err] = await this.api.api_apiTestHistoryDetail({ id: Number(id) });
    if (err) {
      return;
    }
    res.request = JSONParse(res.request);
    res.response = JSONParse(res.response);
    return res;
  }

  async getHistoryList() {
    const [res, err] = await this.api.api_apiTestHistoryList({ page: 1, pageSize: 200 });
    if (err) {
      return;
    }
    this.store.setHistory(res?.items);
  }
  // *** Data engine

  async deleteHistory() {
    const [, err] = await this.api.api_apiTestHistoryDelete({
      ids: this.store.getTestHistory.map(it => it.id)
    });
    if (err) {
      this.feedback.error($localize`Delete history failed`);
      return;
    }
    this.store.setHistory([]);
  }
  //? Group
  async getGroupList(params = {}) {
    // * get group list data
    const [groupList = [], gErr] = await (this.globalStore.isShare
      ? this.api.api_shareGroupList({
          sharedUuid: this.globalStore.getShareID
        })
      : this.api.api_groupList({}));
    if (gErr) {
      return;
    }
    if (!groupList?.length) {
      pcConsole.error(`Can't get root group,groupList is empty`);
      return;
    }
    const rootGroup = groupList.at(0);
    rootGroup.name = $localize`Root Group`;
    this.store.setRootGroup(rootGroup);

    // * set api & group list
    this.store.setGroupList(rootGroup.children);
    Reflect.deleteProperty(rootGroup, 'children');
    // * for mock service
    // this.store.setApiList(items);
  }
  async addGroup(groups: Group[] = []) {
    // * create group
    const [data, err] = await this.api.api_groupCreate(
      groups.map(n => ({
        ...n,
        projectUuid: this.globalStore.getCurrentProjectID,
        workSpaceUuid: this.globalStore.getCurrentWorkspaceUuid
      }))
    );
    if (err) {
      return [null, err];
    }
    const group = data[0];
    //* Transfer array proxy to real object
    const tree = new PCTree(this.store.getGroupList, {
      rootGroupID: this.store.getRootGroup.id
    });
    tree.add(group);
    this.store.setGroupList(tree.getList());
    return [group, err];
  }
  async sortGroup(group) {
    // * update group
    const [data, err] = await this.api.api_groupUpdate(group);
    if (err) {
      return [null, err];
    }
    this.getGroupList();
  }
  async updateGroup(group) {
    // * update group
    const [data, err] = await this.api.api_groupUpdate(group);
    if (err) {
      return [null, err];
    }

    // * update group list
    const tree = new PCTree(this.store.getGroupList, {
      rootGroupID: this.store.getRootGroup.id
    });
    tree.update(group);
    this.store.setGroupList(tree.getList());
    return [data, err];
  }
  // * delete group and api
  async deleteGroup(group) {
    // * delete group
    const [data, err] = await this.api.api_groupDelete(group);
    if (err) {
      return [null, err];
    }

    // * update group list
    const tree = new PCTree(this.store.getGroupList, {
      rootGroupID: this.store.getRootGroup.id
    });
    tree.delete(group);
    this.store.setGroupList(tree.getList());

    return [data, err];
  }

  //? API
  async addAPI(apiData: ApiData) {
    // * Unsaved auth Info
    apiData = eoDeepCopy(apiData);
    Reflect.deleteProperty(apiData, 'authInfo');

    const [result, err] = await this.api.api_apiDataCreate({ apiList: [].concat([apiData]) });
    if (err) {
      return [null, err];
    }
    this.getGroupList();
    return [result[0], err];
  }
  async getAPI(uuid) {
    const [result, err] = await (this.globalStore.isShare
      ? this.api.api_shareApiDataDetail({ apiUuids: [uuid], withParams: 1, sharedUuid: this.globalStore.getShareID })
      : this.api.api_apiDataDetail({ apiUuids: [uuid], withParams: 1 }));
    if (err || !result?.[0]) {
      console.error(err);
      return [null, `cant'find this api:${err}`];
    }
    //Handle Auth
    if (result[0]?.authInfo?.authInfo) {
      result[0].authInfo.authInfo = JSONParse(result[0].authInfo.authInfo);
    }

    return [result[0], err];
  }
  async updateAPI(apiData) {
    apiData = eoDeepCopy(apiData);
    Reflect.deleteProperty(apiData, 'authInfo');
    const [result, err] = await this.api.api_apiDataUpdate({ api: apiData });
    if (err) {
      return [null, err];
    }
    this.getGroupList();
    return [result, err];
  }
  async deleteAPI(uuid) {
    const [result, err] = await this.api.api_apiDataDelete({ apiUuids: [uuid] });
    if (err) {
      this.feedback.error($localize`Failed to delete API`);
      return [null, err];
    }
    this.feedback.success($localize`Successfully deleted`);
    this.getGroupList();
    return [result, err];
  }
  //? Case
  async detailCase(uuid) {
    const [res, err] = this.globalStore.isShare
      ? await this.api.api_shareCaseDetail({
          sharedUuid: this.globalStore.getShareID,
          apiCaseUuids: [uuid]
        })
      : await this.api.api_apiCaseDetail({ apiCaseUuids: [uuid] });
    if (err || !res?.[0]) {
      return [null, `cant'find this case:${err}`];
    }
    return [res[0], err];
  }
  async addCase(model: ApiCase) {
    // * Unsaved auth Info/response
    model = eoDeepCopy(model);
    Reflect.deleteProperty(model, 'authInfo');
    Reflect.deleteProperty(model, 'scriptList');
    Reflect.deleteProperty(model, 'responseList');

    const [data, err] = await this.api.api_apiCaseCreate({
      apiCaseList: [model]
    });
    if (err || !data?.[0]) {
      return [null, `cant'find this case:${err}`];
    }
    this.trace.report('add_case_success');
    this.getGroupList();
    return [data[0], err];
  }
  async updateCase(model: Partial<ApiCase>) {
    // * Unsaved auth Info
    model = eoDeepCopy(model);
    Reflect.deleteProperty(model, 'authInfo');
    Reflect.deleteProperty(model, 'scriptList');
    const [data, err] = await this.api.api_apiCaseUpdate(model as ApiCase);
    if (err) {
      return [null, err];
    }
    this.getGroupList();
    return [data, err];
  }

  async deleteCase(apiCaseUuid) {
    const [, err] = await this.api.api_apiCaseDelete({ apiCaseUuids: [apiCaseUuid] });
    if (err) {
      this.feedback.error($localize`Failed to delete`);
      return;
    }
    this.feedback.success($localize`Successfully deleted`);
    this.getGroupList();
  }

  //? Env
  async addEnv(env) {
    const [data, err] = await this.api.api_environmentCreate(env);
    if (err) {
      return [null, err];
    }
    this.updateEnvList();
    return [data, err];
  }
  async updateEnv(env) {
    const [data, err] = await this.api.api_environmentUpdate(env);
    if (err) {
      return [null, err];
    }
    this.updateEnvList();
    return [data, err];
  }

  async deleteEnv(id) {
    const [, err] = await this.api.api_environmentDelete({ id });
    if (err) {
      return;
    }
    const envList = this.store.getEnvList.filter(it => it.id !== id);
    this.store.setEnvList(envList);
  }
  async updateEnvList() {
    if (this.globalStore.isShare) {
      const [data, err] = await this.api.api_shareEnvironmentList({
        sharedUuid: this.globalStore.getShareID
      });
      if (err) {
        return [];
      }
      this.store.setEnvList(data || []);
      return data || [];
    }
    const [envList, err] = await this.api.api_environmentList({});
    if (err) {
      return;
    }
    this.store.setEnvList(envList || []);
    return envList;
  }

  async deleteMockDetail() {
    this.getGroupList();
  }

  async createMock() {
    this.getGroupList();
  }

  async editMock() {
    this.getGroupList();
  }
}
