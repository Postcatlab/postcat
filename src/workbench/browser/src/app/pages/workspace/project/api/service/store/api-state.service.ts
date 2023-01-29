import { Injectable } from '@angular/core';
import { Group } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { JSONParse } from 'eo/workbench/browser/src/app/utils/index.utils';
import StorageUtil from 'eo/workbench/browser/src/app/utils/storage/storage.utils';
import { genApiGroupTree, hangGroupToApi } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import _ from 'lodash-es';
import { action, computed, makeObservable, observable, toJS } from 'mobx';

@Injectable({ providedIn: 'root' })
export class ApiStoreService {
  // ? group
  @observable private rootGroup: Group;
  @observable private groupList: Group[] = [];

  //? api
  @observable private apiList = [];

  // ? history
  @observable private testHistory = [];

  // ? env
  @observable private envList = [];
  @observable private envUuid = StorageUtil.get('env:selected') || null;

  @computed get getCurrentEnv() {
    const [data] = this.envList.filter(it => it.id === this.envUuid);
    return (
      data || {
        hostUri: '',
        parameters: [],
        frontURI: '',
        id: null
      }
    );
  }
  @computed get getEnvList() {
    return this.envList;
  }
  @computed get getEnvUuid() {
    return this.envUuid;
  }
  @computed get getRootGroup() {
    return this.rootGroup;
  }
  @computed get getApiList() {
    return this.apiList;
  }
  @computed get getGroupTree() {
    return genApiGroupTree([this.rootGroup, ...this.groupList], [], this.getRootGroup?.parentId);
  }
  @computed get getApiGroupTree() {
    return genApiGroupTree(this.groupList, [], this.getRootGroup?.id);
  }

  @computed get getTestHistory() {
    return toJS(this.testHistory).sort((a, b) => b.createTime - a.createTime);
  }

  constructor() {
    makeObservable(this); // don't forget to add this if the class has observable fields
  }

  // * actions
  // ? history
  @action setHistory(data = []) {
    data.forEach(history => {
      history.request = JSONParse(history.request, {});
      history.response = JSONParse(history.response, {});
    });
    this.testHistory = data;
  }

  // ? group
  @action setRootGroup(group: Group) {
    this.rootGroup = group;
  }

  @action setApiList(list = []) {
    this.apiList = list;
  }

  @action setGroupList(list = []) {
    console.log('list', list);
    console.log('hangGroupToApi list', hangGroupToApi(list));
    this.groupList = hangGroupToApi(list);
  }

  @action setEnvUuid(data) {
    this.envUuid = data;
    StorageUtil.set('env:selected', data);
  }

  @action setEnvList(data = []) {
    this.envList = data.map(val => {
      val.parameters = JSONParse(val.parameters, []);
      return val;
    });
    const isHere = data.find(it => it.id === this.envUuid);
    if (!isHere) {
      this.envUuid = null;
      //  for delete env
      StorageUtil.set('env:selected', null);
    }
  }
}
