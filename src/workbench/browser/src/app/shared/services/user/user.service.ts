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

  async login() {
    // const data = await this.apiService.login('http://localhost:3008/auth/login');
    // if (data) {
    //   StorageUtil.set('accessToken', data.accessToken, data.accessTokenExpiresAt);
    //   StorageUtil.set('refreshToken', data.accessToken, data.refreshTokenExpiresAt);
    // }
  }

  async getUserProfile() {}
}
