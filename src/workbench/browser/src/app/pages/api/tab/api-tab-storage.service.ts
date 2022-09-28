import { Injectable } from '@angular/core';
import { RemoteService } from '../../../shared/services/remote/remote.service';
import { storageTab, TabItem } from './tab.model';

@Injectable()
/**
 * Storage tab data
 * All data chagne in this service
 */
export class ApiTabStorageService {
  tabOrder: Array<number> = [];
  cacheName: string;
  tabsByID = new Map<number, TabItem>();
  constructor(private dataSource: RemoteService) {}
  init() {
    this.tabOrder = [];
    this.tabsByID = new Map();
    this.cacheName = `${this.dataSource.dataSourceType}_TabCache`;
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
    //! remote datasource may change
    // if (this.dataSource.dataSourceType === 'http') {return;}
    let tabsByID = Object.fromEntries(this.tabsByID);
    Object.values(tabsByID).forEach((val) => {
      if (val.type === 'preview') {
        ['baseContent', 'content'].forEach((keyName) => {
          val[keyName] = null;
        });
      }
    });
    if (opts.handleDataBeforeCache) {
      tabsByID = opts.handleDataBeforeCache(tabsByID);
    }
    window.localStorage.setItem(
      this.cacheName,
      JSON.stringify({
        selectedIndex,
        tabOrder: this.tabOrder,
        tabsByID,
      })
    );
  }
  parseChangeRouter(cache: storageTab) {
    const map = {
      '/home/api/edit': '/home/api/http/edit',
      '/home/api/test': '/home/api/http/test',
      '/home/api/detail': '/home/api/http/detail',
      '/home/api/mock': '/home/api/http/mock',
    };
    cache.tabOrder.forEach((id) => {
      const tabItem = cache.tabsByID[id];
      tabItem.pathname = map[tabItem.pathname] || tabItem.pathname;
    });
    return cache;
  }
  getPersistenceStorage(): storageTab {
    let result: any = null;
    try {
      result = JSON.parse(window.localStorage.getItem(this.cacheName) as string);
      result = this.parseChangeRouter(result);
    } catch (e) {}
    return result;
  }
}
