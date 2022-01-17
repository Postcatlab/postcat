import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Query } from './storage.config';
import { StorageModel } from './storage.model';

/**
 * 数据基础模型服务
 */
@Injectable()
export class StorageModelService {
  /**
   * 表名
   * @type {string}
   */
  protected tableName:string;

  constructor(protected storage: StorageService) {}

  /**
   * 创建数据
   * @param {StorageModel} data 创建的数据
   * @return {object} 当前创建的对象
   */
  create(data: StorageModel): Observable<object> {
    if (!data.createdAt) {
      data.createdAt = new Date();
    }
    data.updatedAt = data.createdAt;
    return this.storage.setTable(this.tableName).create(data);
  }

  /**
   * 批量创建数据
   * @param data 批量创建的数据数组
   */
  bulkCreate(data: Array<StorageModel>): Observable<object> {
    data = data.map(item => {
      if (!item.createdAt) {
        item.createdAt = new Date();
      }
      item.updatedAt = item.createdAt;
      return item;
    });
    return this.storage.setTable(this.tableName).bulkCreate(data);
  }

  /**
   * 更新数据
   * @param data 更新的数据
   * @param uuid 主键
   */
  update(data: StorageModel, uuid: number|string): Observable<object> {
    if (!data.updatedAt) {
      data.updatedAt = new Date();
    }
    return this.storage.setTable(this.tableName).update(data, uuid);
  }

  /**
   * 批量更新数据, uuid附属在数组内
   * @param data 批量更新的数据数组
   */
  bulkUpdate(data: Array<object>): Observable<object> {
    data = data.map(item => {
      if (!item.hasOwnProperty('updatedAt')) {
        item['updatedAt'] = new Date();
      }
      return item;
    });
    return this.storage.setTable(this.tableName).bulkUpdate(data);
  }

  /**
   * 删除数据
   * @param uuid 主键
   */
  remove(uuid: number|string): Observable<boolean> {
    return this.storage.setTable(this.tableName).remove(uuid);
  }

  /**
   * 批量删除数据
   * @param uuids 主键数组
   */
  bulkRemove(uuids: Array<number|string>): Observable<boolean> {
    return this.storage.setTable(this.tableName).bulkRemove(uuids);
  }

  /**
   * 加载数据
   * @param uuid 主键
   */
  load(uuid: number|string): Observable<object> {
    return this.storage.setTable(this.tableName).load(uuid);
  }

  /**
   * 根据条件加载数据
   * @param query 查询条件对象
   */
  loadBy(query: {[key: string]: string | number | null}): Observable<object> {
    return this.storage.setTable(this.tableName).loadBy(query);
  }

  /**
   * 根据主键数组批量加载数据
   * @param uuids 主键数组
   */
  bulkLoad(uuids: Array<number>): Observable<Array<object>> {
    return this.storage.setTable(this.tableName).bulkLoad(uuids);
  }

  /**
   * 批量加载所有数据
   * @param query 查询条件对象
   */
  loadAll(query?: Query): Observable<Array<object>> {
    return this.storage.setTable(this.tableName).loadAll(query)
  }

  /**
   * 根据条件批量加载所有数据
   * @param query 查询条件对象
   */
  loadAllBy(query: Query): Observable<Array<object>> {
    return this.storage.setTable(this.tableName).loadAllBy(query);
  }
}
