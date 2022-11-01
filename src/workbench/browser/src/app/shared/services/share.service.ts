import { Injectable } from '@angular/core';
import { StorageUtil } from '../../utils/storage/Storage';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  shareId;
  constructor() {
    this.shareId = this.getShareId() || '';
  }
  setShareId(data) {
    this.shareId = data;
    StorageUtil.set('shareId', data);
  }
  getShareId() {
    return StorageUtil.get('shareId');
  }
  resetShareId() {
    StorageUtil.set('shareId', '');
  }
}
