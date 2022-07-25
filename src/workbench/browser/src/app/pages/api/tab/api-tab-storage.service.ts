import { Injectable } from '@angular/core';
import { TabItem } from './tab.model';

@Injectable()
/**
 * Storage api tab data
 */
export class ApiTabStorageService {
  storage = {};
  constructor() {}
  add(tab: TabItem, data: any) {
    this.storage[tab.uuid] = data;
  }
  remove(tabID) {
    if (!this.storage.hasOwnProperty(tabID)) {
      return;
    }
    delete this.storage[tabID];
  }
  destroy() {
    this.storage = {};
  }
}
