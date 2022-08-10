import Dexie, { Table } from 'dexie';
import { StorageItem, StorageResStatus } from './index.model';

type uuidType = string | number | string[] | number[];

const toArray = (data: uuidType) => {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
};

const tranform = (source, data) => {
  if (Array.isArray(data)) {
    return source;
  }
  return source[0] || null;
};

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

  create(table: Table, items: Array<StorageItem>): Promise<ResultType> {
    const time = Date.now();
    const result = table.bulkAdd(
      items.map((item: StorageItem) => ({
        createdAt: time,
        updatedAt: time,
        ...item,
      }))
    );
    return Promise.resolve(this.resProxy(tranform(result, items)));
  }

  remove(table: Table, { uuid }): Promise<ResultType> {
    const result = table.bulkDelete(toArray(uuid));
    return Promise.resolve(this.resProxy(tranform(result, uuid)));
  }

  load(
    table: Table,
    {
      uuid,
      projectID = 1,
      apiDataID = 1,
    }: { uuid?: number | string; projectID?: string | number; apiDataID?: string | number }
  ): Promise<ResultType> {
    return new Promise((resolve, reject) => {
      table
        .bulkGet(toArray(uuid))
        .then((result) => resolve(this.resProxy(tranform(result, uuid))))
        .catch((error) => reject(error));
    });
  }

  search(table: Table, condition = {}): Promise<ResultType> {
    return new Promise((resolve, reject) => {
      table
        .where(condition)
        .toArray()
        .then((result) => resolve(this.resProxy(result)))
        .catch((error) => reject(error));
    });
  }

  update(table: Table, items: any): Promise<ResultType> {
    const time = Date.now();
    const list: any = [items].map((item: any) => ({
      ...item,
      updatedAt: time,
    }));
    return new Promise((resolve, reject) => {
      table
        .bulkPut(list)
        .then((result) => resolve(this.resProxy(tranform(result, items))))
        .catch((err) => reject(err));
    });
  }
}
