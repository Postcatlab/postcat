import { Injectable } from '@angular/core';

import { ExtensionInfo } from '../../models/extension-manager';

@Injectable({
  providedIn: 'root'
})
export class ExtensionStoreService {
  private extensionList: ExtensionInfo[];
  constructor() {}
  setExtensionList(list) {
    this.extensionList = list;
  }
  get getExtensionList() {
    return this.extensionList;
  }
}
