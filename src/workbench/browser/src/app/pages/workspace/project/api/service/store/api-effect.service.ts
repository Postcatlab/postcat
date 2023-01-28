import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { JSONParse } from 'eo/workbench/browser/src/app/utils/index.utils';

import { ApiStoreService } from './api-state.service';

@Injectable()
export class ApiEffectService {
  constructor(private store: ApiStoreService, private globalStore: StoreService, private api: ApiService) {}
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
      return;
    }
    this.store.setHistory([]);
  }

  //? Group
  async getGroupList(params = {}) {
    // * get group list data
    const [groupList = [], gErr] = await (this.globalStore.isShare ? this.api.api_groupList({}) : this.api.api_groupList({}));
    if (gErr) {
      return;
    }
    const rootGroup = groupList.at(0);
    rootGroup.name = $localize`Root Group`;
    this.store.setRootGroup(rootGroup);

    // console.log('Group 数据', structuredClone(groupList));
    // * get api list data
    const [apiListRes, aErr] = await (this.globalStore.isShare
      ? this.api.api_apiDataList({ ...params, statuses: 0 })
      : this.api.api_apiDataList({ ...params, statuses: 0, order: 'order_num', sort: 'DESC' }));
    if (aErr) {
      return;
    }
    const { items, paginator } = apiListRes;
    // console.log('API 数据', items);
    // * set api & group list
    this.store.setGroupList(rootGroup.children);
    Reflect.deleteProperty(rootGroup, 'children');
    this.store.setApiList(items);
  }
  async createGroup(groups: any[] = []) {
    // * update group
    await this.api.api_groupCreate(
      groups.map(n => ({
        ...n
      }))
    );
    this.getGroupList();
  }
  async updateGroup(group) {
    // * update group
    // * update api list
    await this.api.api_groupUpdate(group);
    this.getGroupList();
  }
  // * delete group and api
  async deleteGroup(group) {
    // * delete group
    await this.api.api_groupDelete(group);
    this.getGroupList();
    // * call deleteAPI()
  }

  //? Env
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
      const [data, err] = await this.api.api_shareDocGetEnv({
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
}
