import { Injectable } from '@angular/core';
import _ from 'lodash-es';
import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { Group } from 'pc/browser/src/app/services/storage/db/models';
import { eoDeepCopy, JSONParse } from 'pc/browser/src/app/shared/utils/index.utils';
import StorageUtil from 'pc/browser/src/app/shared/utils/storage/storage.utils';
import { genApiGroupTree, getPureGroup, hangGroupToApi } from 'pc/browser/src/app/shared/utils/tree/tree.utils';

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
  @computed get getGroupList() {
    return this.groupList;
  }
  @computed get getGroupTree() {
    return getPureGroup(
      eoDeepCopy([
        {
          ...this.rootGroup,
          children: this.groupList
        }
      ])
    );
  }
  @computed get getApiGroupTree() {
    return genApiGroupTree(this.groupList);
  }

  @computed get getTestHistory() {
    return toJS(this.testHistory).sort((a, b) => b.createTime - a.createTime);
  }

  constructor() {
    pcConsole.log('init ApiStoreService');
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
