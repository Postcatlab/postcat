import Dexie, { Table } from 'dexie';
import { StorageItem, StorageResStatus } from './index.model';

export type ResultType<T = any> = {
  status: StorageResStatus.success;
  data: T;
};

/**
 * @description
 * A storage service with IndexedDB.
 */
export default class localStorage extends Dexie {
  private resProxy(data): ResultType {
    const result = {
      status: StorageResStatus.success,
      data,
    };
    return result as ResultType;
  }

  create(table: Table, items: Array<StorageItem>): object {
    const time = Date.now();
    const result = table.bulkAdd(
      items.map((item: StorageItem) => ({
        createdAt: time,
        updatedAt: time,
        ...item,
      }))
    );
    return this.resProxy(result);
  }

  remove(table: Table, uuids: Array<number | string>): object {
    const result = table.bulkDelete(uuids);
    return this.resProxy(result);
  }

  load(table: Table, uuids: Array<number | string>): object {
    return new Promise((resolve, reject) => {
      table
        .bulkGet(uuids)
        .then((result) => {
          resolve(this.resProxy(result));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  update(table: Table, items: Array<StorageItem>): object {
    const time = Date.now();
    const list: any = items.map((item: StorageItem) => ({
      ...item,
      updatedAt: time,
    }));
    return new Promise((resolve, reject) => {
      table
        .bulkGet(list)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
