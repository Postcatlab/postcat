import { Injectable } from '@angular/core';
import { action, computed, makeObservable, reaction, observable } from 'mobx';
import { StorageUtil } from 'eo/workbench/browser/src/app/utils/storage/Storage';

/** is show switch success tips */
export const IS_SHOW_DATA_SOURCE_TIP = 'IS_SHOW_DATA_SOURCE_TIP';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // * observable data
  @observable shareId = StorageUtil.get('shareId') || '';
  @observable userProfile = StorageUtil.get('userProfile') || null;
  @observable.shallow
  env = {
    hostUri: '',
    parameters: [],
    frontURI: '',
  };

  @observable.shallow loginInfo = {
    accessToken: StorageUtil.get('accessToken') || null,
    refreshToken: StorageUtil.get('refreshToken') || null,
  };

  // * computed data
  @computed
  get getEnv() {
    return this.env;
  }

  @computed get isLogin() {
    return !!this.userProfile?.username;
  }

  @computed get getUserProfile() {
    return this.userProfile;
  }

  @computed get getLoginInfo() {
    return this.loginInfo;
  }

  constructor() {
    makeObservable(this); // don't forget to add this if the class has observable fields
  }

  // * actions
  @action setEnv(data) {
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

  @action setUserProfile(data: API.User = null) {
    this.userProfile = data;
    StorageUtil.set('userProfile', data);
  }

  @action setLoginInfo(data = null) {
    this.loginInfo = data;
    StorageUtil.set('accessToken', data.accessToken);
    StorageUtil.set('refreshToken', data.refreshToken);
  }

  @action clearAuth() {
    this.setUserProfile(null);
    this.setLoginInfo({ accessToken: '', refreshToken: '' });
  }
}
