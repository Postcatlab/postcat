import { Injectable } from '@angular/core';
import { StorageUtil } from '../../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userInfo: API.User;
  accessToken = '';
  refreshToken = '';
  accessTokenExpiresAt = 0;
  refreshTokenExpiresAt = 0;

  constructor() {}

  setLoginInfo(data: API.LoginToken) {
    StorageUtil.set('accessToken', data.accessToken, (Date.now() - data.accessTokenExpiresAt) / 1000);
    StorageUtil.set('refreshToken', data.refreshToken, (Date.now() - data.refreshTokenExpiresAt) / 1000);
  }

  setUserProfile(userInfo: API.User) {
    this.userInfo = userInfo;
    StorageUtil.set('userInfo', JSON.stringify(userInfo));
  }

  clearAuth() {
    this.userInfo = null;
    this.accessToken = this.refreshToken = '';
    StorageUtil.remove('accessToken');
    StorageUtil.remove('refreshToken');
    StorageUtil.remove('userInfo');
  }
}
