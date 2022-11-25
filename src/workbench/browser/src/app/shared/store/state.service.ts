import { Injectable } from '@angular/core';
import { action, computed, makeObservable, reaction, observable } from 'mobx';
import { StorageUtil } from 'eo/workbench/browser/src/app/utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // * observable data
  @observable.shallow env = {
    hostUri: '',
    parameters: [],
    frontURI: '',
  };

  @observable shareId = StorageUtil.get('shareId') || '';

  // * computed data
  @computed
  get getEnv() {
    return this.env;
  }

  constructor() {
    makeObservable(this); // don't forget to add this if the class has observable fields
  }

  // * actions
  @action changeEnv(data) {
    this.env =
      data == null
        ? {
            hostUri: '',
            parameters: [],
            frontURI: '',
          }
        : data;
  }

  @action setShareId(data = '') {
    this.shareId = data;
    StorageUtil.set('shareId', data);
  }
}
