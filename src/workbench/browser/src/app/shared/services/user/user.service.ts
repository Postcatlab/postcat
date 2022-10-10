import { Injectable } from '@angular/core';
import { StorageUtil } from '../../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLogin = false;
  userProfile;
  accessToken = StorageUtil.get('accessToken');
  refreshToken = StorageUtil.get('refreshToken');
  accessTokenExpiresAt = 0;
  refreshTokenExpiresAt = 0;

  constructor() {
    this.setUserProfile(StorageUtil.get('userProfile'));
  }

  getLoginInfo() {
    return {
      accessToken: StorageUtil.get('accessToken'),
      refreshToken: StorageUtil.get('refreshToken'),
    };
  }

  setLoginInfo(data: API.LoginToken) {
    StorageUtil.set('accessToken', data.accessToken, (data.accessTokenExpiresAt - Date.now()) / 1000);
    StorageUtil.set('refreshToken', data.refreshToken, (data.refreshTokenExpiresAt - Date.now()) / 1000);
  }

  setUserProfile(userProfile: API.User) {
    this.userProfile = userProfile;
    this.setLoginStatus();
    StorageUtil.set('userProfile', userProfile);
  }
  private setLoginStatus() {
    this.isLogin = !!this.userProfile?.username;
  }

  clearAuth() {
    this.isLogin = false;
    this.userProfile = null;
    this.accessToken = this.refreshToken = '';
    StorageUtil.remove('accessToken');
    StorageUtil.remove('refreshToken');
    StorageUtil.remove('userInfo');
  }
}
