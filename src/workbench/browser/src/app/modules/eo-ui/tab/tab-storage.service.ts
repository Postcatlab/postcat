import { Injectable } from '@angular/core';

import { storageTab, TabItem } from './tab.model';

@Injectable()
/**
 * Storage tab data
 * All data chagne in this service
 */
export class TabStorageService {
  tabOrder: number[] = [];
  tabStorageKey: string;
  tabsByID = new Map<number, TabItem>();
  constructor() {}
  init(inArg: { tabStorageKey: string }) {
    this.tabOrder = [];
    this.tabsByID = new Map();
    this.tabStorageKey = inArg.tabStorageKey;
  }
  addTab(tabItem) {
    if (this.tabsByID.has(tabItem.uuid)) {
      throw new Error(`EO_ERROR: can't add same id tab`);
    }
    this.tabOrder.push(tabItem.uuid);
    this.tabsByID.set(tabItem.uuid, tabItem);
  }
  updateTab(index, tabItem) {
    this.tabsByID.delete(this.tabOrder[index]);
    this.tabOrder[index] = tabItem.uuid;
    this.tabsByID.set(tabItem.uuid, tabItem);
  }
  resetTabsByOrdr(order) {
    const tabs = new Map();
    this.tabsByID.forEach((value, key) => {
      if (!order.includes(key)) {
        return;
      }
      tabs.set(key, value);
    });
    this.tabsByID = tabs;
    this.tabOrder = order;
  }
  closeTab(index) {
    const uuid = this.tabOrder[index];
    this.tabsByID.delete(uuid);
    this.tabOrder.splice(index, 1);
  }
  /**
   * Storage tab data in runtime object
   *
   * @param tab
   * @param data
   */
  setPersistenceStorage(selectedIndex, opts) {
    let tabsByID = Object.fromEntries(this.tabsByID);
    Object.values(tabsByID).forEach(val => {
      if (val.type === 'preview') {
        ['baseContent', 'content'].forEach(keyName => {
          val[keyName] = null;
        });
      }
    });
    if (opts.handleDataBeforeCache) {
      tabsByID = opts.handleDataBeforeCache(tabsByID);
    }
    window.localStorage.setItem(
      this.tabStorageKey,
      JSON.stringify({
        selectedIndex,
        tabOrder: this.tabOrder,
        tabsByID
      })
    );
  }

  getPersistenceStorage(): storageTab {
    let result: any = null;
    try {
      result = JSON.parse(window.localStorage.getItem(this.tabStorageKey) as string);
    } catch (e) {}
    return result;
  }
}
