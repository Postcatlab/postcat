import { Inject, Injectable } from '@angular/core';
import { StorageConfig, STORAGE_CONFIG, Query } from './storage.config';
import { StorageInterface } from './storage.interface';
import { StorageIndexedDB } from './storage.indexedDB';
import { Observable } from 'rxjs';

@Injectable()
export class StorageService {
  private service: StorageInterface;
  private _tableName: string;

  constructor(@Inject(STORAGE_CONFIG) config: StorageConfig) {
    console.log('StorageService init');
    if (config.service) {
      this.service = config.service;
    } else {
      this.service = new StorageIndexedDB(config.setting);
    }
    this.service.init(config.setting);
  }

  public db(): any {
    return this.service.db();
  }

  public table(tableName: string): StorageService {
    console.log('set table' + tableName);
    this._tableName = tableName;
    return this;
  }

  public setTable(tableName: string): StorageInterface {
    if (tableName) {
      this._tableName = tableName;
    }
    if (!this._tableName) {
      throw new Error('StorageService: Please bind the table first.');
    }

    return this.service.table(this._tableName);
  }

  create(data: object, tableName?: string): Observable<object> {
    return this.setTable(tableName).create(data);
  }

  bulkCreate(data: Array<object>, tableName?: string): Observable<object> {
    return this.setTable(tableName).bulkCreate(data);
  }

  update(data: object, uuid: number|string, tableName?: string): Observable<object> {
    return this.setTable(tableName).update(data, uuid);
  }

  bulkUpdate(data: Array<object>, tableName?: string): Observable<object> {
    return this.setTable(tableName).bulkUpdate(data);
  }

  remove(uuid: number|string, tableName?: string): Observable<boolean> {
    return this.setTable(tableName).remove(uuid);
  }

  bulkRemove(uuids: Array<number|string>, tableName?: string): Observable<boolean> {
    return this.setTable(tableName).bulkRemove(uuids);
  }

  load(uuid: number|string, tableName?: string): Observable<object> {
    return this.setTable(tableName).load(uuid);
  }

  loadBy(query: {[key: string]: string | number | null}, tableName?: string): Observable<object> {
    return this.setTable(tableName).loadBy(query);
  }

  bulkLoad(uuids: Array<number>, tableName?: string): Observable<Array<object>> {
    return this.setTable(tableName).bulkLoad(uuids);
  }

  loadAll(query?: Query, tableName?: string): Observable<Array<object>> {
    return this.setTable(tableName).loadAll(query)
  }

  loadAllBy(query: Query, tableName?: string): Observable<Array<object>> {
    return this.setTable(tableName).loadAllBy(query);
  }

}
