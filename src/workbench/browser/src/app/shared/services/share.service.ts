import { Injectable } from '@angular/core';
import { StorageUtil } from '../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  shareID;
  constructor() {
    this.shareID = this.getshareID() || '';
  }
  setshareID(data) {
    this.shareID = data;
    StorageUtil.set('shareID', data);
  }
  getshareID() {
    return StorageUtil.get('shareID');
  }
  resetshareID() {
    StorageUtil.set('shareID', '');
  }
}
