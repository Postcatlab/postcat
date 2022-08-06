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
  tabsByID = new Map<number, TabItem>();
  private cacheName = `${this.dataSource.dataSourceType}_TabCache`;
  constructor(private dataSource: RemoteService) {}
  addTab(tabItem) {
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
  setPersistenceStorage(selectedIndex) {
    window.localStorage.setItem(
      this.cacheName,
      JSON.stringify({
        selectedIndex,
        tabOrder: this.tabOrder,
        tabsByID:Object.fromEntries(this.tabsByID),
      })
    );
  }
  getPersistenceStorage(): storageTab {
    let result: any = null;
    try {
      result = JSON.parse(window.localStorage.getItem(this.cacheName) as string);
    } catch (e) {}
    return result;
  }
}
