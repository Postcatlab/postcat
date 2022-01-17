import { StorageInterface } from './storage.interface';
import { InitTableData, Query, QueryOrder, StorageSetting } from './storage.config';
import Dexie, { Table } from 'dexie';
import { Observable } from 'rxjs';

/**
 * 默认数据库服务(IndexedDB)
 */
export class StorageIndexedDB implements StorageInterface {
  private config: StorageSetting;
  private _db: Dexie;
  private _tableName: string;

  constructor(setting?: StorageSetting) {
    if (setting) {
      this.init(setting);
    }
  }

  init(setting: StorageSetting): void {
    if (this.config) {
      return;
    }
    this.config = setting;
    if (!this.config.name) {
      this.config.name = 'eoapi_default';
    }
    this._db = new Dexie(this.config.name);
    this.db().version(this.config.version).stores(this.config.schema);
    this.db().open();
    this.db().on('populate', () => this.populate());
  }

  /**
   * 数据库初始创建时调用
   */
  private populate(): void {
    if (this.config.initData) {
      this.config.initData.forEach((data: InitTableData) => {
        this.bulkCreate(data.items, data.name).subscribe();
      });
    }
  }

  db(): Dexie {
    return this._db;
  }

  table(tableName: string): StorageInterface {
    this._tableName = tableName;
    return this;
  }

  setTable(tableName: string): Table {
    if (tableName) {
      this._tableName = tableName;
    }
    if (!this._tableName) {
      throw new Error('StorageIndexedDB: Please bind table first.');
    }
    return this.db().table(this._tableName);
  }

  create(data: object, tableName?: string): Observable<object> {
    return new Observable((obs) => {
      this.setTable(tableName).add(data).then((result) => {
        obs.next(Object.assign(data,{uuid: result}));
        obs.complete();
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  bulkCreate(data: Array<object>, tableName?: string): Observable<object> {
    return new Observable((obs) => {
      this.setTable(tableName).bulkAdd(data).then((result) => {
        obs.next({number: result});
        obs.complete();
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  update(data: object, uuid: number|string, tableName?: string): Observable<object> {
    return new Observable((obs) => {
      this.setTable(tableName).update(uuid, data).then(async (updated) => {
        if (updated) {
          let result = await this.setTable(tableName).get(uuid);
          obs.next(result);
          obs.complete();
        } else {
          obs.error(`Nothing was updated - there were no data with primary key: ${uuid}`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  bulkUpdate(data: Array<object>, tableName?: string): Observable<object> {
    return new Observable((obs) => {
      let uuids:Array<number|string> = [];
      let updateData = {};
      data.filter(x => x['uuid']).forEach(item => {
        let uuid = item['uuid'];
        uuids.push(uuid);
        delete item['uuid'];
        updateData[uuid] = item;
      });
      this.setTable(tableName).bulkGet(uuids).then((existItems) => {
        if (existItems) {
          let newItems: Array<object> = [];
          existItems.filter(x => x).forEach((item) => {
            newItems.push(Object.assign(item, (updateData[item['uuid']] || {})));
          });
          this.setTable(tableName).bulkPut(newItems).then((result) => {
            obs.next({number: result, items: newItems});
            obs.complete();
          }).catch((error) => {
            obs.error(error);
          });
        } else {
          obs.error(`Nothing found from table [${this._tableName}] with [${JSON.stringify(uuids)}].`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  remove(uuid: number|string, tableName?: string): Observable<boolean> {
    return new Observable((obs) => {
      this.setTable(tableName).delete(uuid).then(() => {
        obs.next(true);
        obs.complete();
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  bulkRemove(uuids: Array<number|string>, tableName?: string): Observable<boolean> {
    return new Observable((obs) => {
      this.setTable(tableName).bulkDelete(uuids).then(() => {
        obs.next(true);
        obs.complete();
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  load(uuid: number|string, tableName?: string): Observable<object> {
    return new Observable((obs) => {
      this.setTable(tableName).get(uuid).then((result) => {
        if (result) {
          obs.next(result);
          obs.complete();
        } else {
          obs.error(`Nothing found from table [${this._tableName}] with id [${uuid}].`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  loadBy(query: {[key: string]: string | number | null}, tableName?: string): Observable<object> {
    return new Observable((obs) => {
      this.setTable(tableName).get(query).then((result) => {
        if (result) {
          obs.next(result);
          obs.complete();
        } else {
          obs.error(`Nothing found from table [${this._tableName}] with query [${JSON.stringify(query)}].`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  bulkLoad(uuids: Array<number|string>, tableName?: string): Observable<Array<object>> {
    return new Observable((obs) => {
      this.setTable(tableName).bulkGet(uuids).then((result) => {
        if (result) {
          obs.next(result);
          obs.complete();
        } else {
          obs.error(`Nothing found from table [${this._tableName}] with uuids [${JSON.stringify(uuids)}].`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  loadAll(query?: Query, tableName?: string): Observable<Array<object>> {
    return query ? this.loadAllBy(query, tableName) : new Observable((obs) => {
      this.setTable(tableName).toArray().then((result) => {
        if (result) {
          obs.next(result);
          obs.complete();
        } else {
          obs.error(`Nothing found from table [${this._tableName}].`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

  loadAllBy(query: Query, tableName?: string): Observable<Array<object>> {
    return new Observable((obs) => {
      let m;
      if (query.where) {
        m = this.setTable(tableName).where(query.where);
      } else {
        m = this.setTable(tableName);
      }
      if (query.sort) {
        if (query.sort.order && query.sort.order === QueryOrder.DESC) {
          m = m.reverse();
        }
        m = (query.sort.key) ? m.sortBy(query.sort.key): m.toArray();
      } else {
        m = m.toArray();
      }
      m.then((result) => {
        if (result) {
          obs.next(result);
          obs.complete();
        } else {
          obs.error(`Nothing found from table [${this._tableName}] with query [${JSON.stringify(query)}].`);
        }
      }).catch((error) => {
        obs.error(error);
      });
    });
  }

}
