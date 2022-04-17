import { Injectable } from '@angular/core';
import { StorageHandleResult, StorageHandleStatus } from '../../../../../../../../platform/browser/IndexedDB';
/**
 * @description
 * A storage service with IndexedDB.
 */
@Injectable()
export class StorageService {
  constructor() {}

  /**
   * Handle data from IndexedDB
   *
   * @param args 
   */
  run(action: string, params: Array<any>): StorageHandleResult {
    if (window && window.eo && window.eo.storageRemote) {
      return window.eo.storageRemote({
        action: action,
        params: params
      });
    }
    return {
      status: StorageHandleStatus.invalid,
      data: 'Please run in electron mode.' 
    };
  }

}
