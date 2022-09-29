import { Injectable } from '@angular/core';
import { StorageUtil } from '../../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userProfile: API.User;
  accessToken = StorageUtil.get('accessToken');
  refreshToken = StorageUtil.get('refreshToken');
  accessTokenExpiresAt = 0;
  refreshTokenExpiresAt = 0;

  constructor() {}

  getLoginInfo() {
    return {
      accessToken: StorageUtil.get('accessToken'),
      refreshToken: StorageUtil.get('refreshToken'),
    };
  }

  setLoginInfo(data: API.LoginToken) {
    console.log(data);
    StorageUtil.set('accessToken', data.accessToken, (data.accessTokenExpiresAt - Date.now()) / 1000);
    StorageUtil.set('refreshToken', data.refreshToken, (data.refreshTokenExpiresAt - Date.now()) / 1000);
  }

  setUserProfile(userProfile: API.User) {
    this.userProfile = userProfile;
    StorageUtil.set('userInfo', JSON.stringify(userProfile));
  }

  clearAuth() {
    this.userProfile = null;
    this.accessToken = this.refreshToken = '';
    StorageUtil.remove('accessToken');
    StorageUtil.remove('refreshToken');
    StorageUtil.remove('userInfo');
  }
}
