import { Injectable } from '@angular/core';
import { StorageUtil } from '../../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  accessToken = '';
  refreshToken = '';
  accessTokenExpiresAt = 0;
  refreshTokenExpiresAt = 0;

  constructor() {}

  login() {
    StorageUtil.set();
  }
}
