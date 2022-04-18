import { ipcRenderer, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { StorageHandleResult, StorageHandleStatus, StorageHandleArgs, StorageProcessType } from '../../../platform/browser/IndexedDB';
import { storage } from '../../../platform/browser/IndexedDB/lib';
import { isNotEmpty } from '../../../shared/common/common';
class StorageService {
  private ipcRenderer: typeof ipcRenderer;
  private app: typeof app;
  private fs: typeof fs;
  private path: typeof path;
  constructor() {
    console.log('test');
    this.ipcRenderer = window.require('electron').ipcRenderer;
    this.app= window.require('electron').app;
    this.fs = window.require('fs');
    this.path= window.require('path');
    this.storageListen();
  }

  /**
   * 存储监听处理
   * @param args 
   */
  private storageListenHandle(args: StorageHandleArgs): void {
    console.log(args);
    const action: string = args.action || undefined;
    const handleResult: StorageHandleResult = {
      status: StorageHandleStatus.invalid,
      data: undefined 
    };
    if (storage && storage[action] && typeof storage[action] === 'function') {
      console.log('storage run');
      storage[action](...args.params).subscribe((result: any) => {
        handleResult.data = result;
        if (isNotEmpty(result)) {
          handleResult.status = StorageHandleStatus.success;
        } else {
          handleResult.status = StorageHandleStatus.empty;
        }
        this.storageListenHandleNotify(args.type, handleResult);
      }, (error: any) => {
        handleResult.status = StorageHandleStatus.error;
        this.storageListenHandleNotify(args.type, handleResult);
      });
    } else {
      this.storageListenHandleNotify(args.type, handleResult);
    }
  }

  /**
   * 数据存储监听通知返回 
   * @param type 
   * @param result 
   */
  private storageListenHandleNotify(type: string, result: StorageHandleResult): void {
    try {
      if (StorageProcessType.default === type) {
        this.ipcRenderer.send('eo-storage', {type: 'result', result: result});
      } else if (StorageProcessType.sync === type) {
        const storageTemp = this.path.join(this.app.getPath('home'), '.eo', 'tmp.storage');
        this.fs.writeFileSync(storageTemp, JSON.stringify(result));
      } else if (StorageProcessType.remote === type) {
        window.require('@electron/remote').getGlobal('shareObject').storageResult = result;
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  /**
   * 开启数据存储监听
   * @returns 
   */
  private storageListen(): void {
    this.ipcRenderer.on('eo-storage', (event, args: StorageHandleArgs) => this.storageListenHandle(args));
  }       

  isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
}

new StorageService();