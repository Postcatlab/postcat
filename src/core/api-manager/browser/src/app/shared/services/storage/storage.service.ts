import { Injectable } from '@angular/core';
import { StorageHandleStatus } from '../../../../../../../../platform/browser/IndexedDB';
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
  run(action: string, params: Array<any>, callback): void {
    if (window && window.eo && window.eo.storageRemote) {
      window.eo.storage({
        action: action,
        params: params
      }, callback);
    } else {
      callback({
        status: StorageHandleStatus.invalid,
        data: 'Please run in electron mode.' 
      });
    }
  }

}
