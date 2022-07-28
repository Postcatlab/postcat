import { Injectable } from '@angular/core';
import { TabItem } from './tab.model';

@Injectable()
/**
 * Storage tab data
 * All data chagne in this service
 */
export class ApiTabStorageService {
  tabs: Array<TabItem> = new Proxy([], {
    set(target, key, value) {
      console.log('set','target');
      target[key] = value;
      return true;
    },
  });
  storage = {};
  constructor() {}
  addTab(tabItem) {
    this.tabs.push(tabItem);
  }
  setTabs(tabs) {
    this.tabs = tabs;
  }
  closeTab(index) {
    this.tabs.splice(index, 1);
    this.removeStorage(this.tabs[index].uuid);
  }
  setStorage(tab: TabItem, data: any) {
    this.storage[tab.uuid] = data;
  }
  removeStorage(tabID) {
    if (!this.storage.hasOwnProperty(tabID)) {
      return;
    }
    delete this.storage[tabID];
  }
  destroy() {
    this.storage = {};
  }
}
