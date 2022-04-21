import { Injectable } from '@angular/core';
import { StorageHandleResult, StorageHandleStatus } from '../../../../../../../platform/browser/IndexedDB';
import { storage } from '../../../../../../../platform/browser/IndexedDB/lib';
import { isNotEmpty } from '../../../../../../../shared/common/common';

/**
 * @description
 * A storage service with IndexedDB.
 */
@Injectable()
export class StorageService {
  constructor() {
    console.log('StorageService init');
  }

  /**
   * Handle data from IndexedDB
   *
   * @param args
   */
  run(action: string, params: Array<any>, callback): void {
    const handleResult = {
      status: StorageHandleStatus.invalid,
      data: undefined,
      callback: callback,
    };
    storage[action](...params).subscribe(
      (result: any) => {
        handleResult.data = result;
        if (isNotEmpty(result)) {
          handleResult.status = StorageHandleStatus.success;
        } else {
          handleResult.status = StorageHandleStatus.empty;
        }
        callback(handleResult);
      },
      (error: any) => {
        handleResult.status = StorageHandleStatus.error;
        callback(handleResult);
      }
    );
  }
}
