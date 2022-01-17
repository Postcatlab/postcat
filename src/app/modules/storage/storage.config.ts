import { InjectionToken } from '@angular/core';
import { StorageInterface } from './storage.interface';

export const STORAGE_CONFIG = new InjectionToken<StorageConfig>('STORAGE_CONFIG_PARAMS');

/**
 * 存储服务结构
 */
export interface StorageSetting {
  // 数据库名称
  name?: string;
  // 数据库版本号
  version: number;
  // 数据表结构
  schema: {[tableName: string]: string|null};
  // 初始化数据
  initData?: Array<object>;
}

/**
 * 存储对象配置结构
 */
export interface StorageConfig {
  // 数据操作服务，可配置替换
  service?: StorageInterface;
  // 存储服务结构
  setting: StorageSetting;
}

/**
 * 初始数据结构对象
 */
export interface InitTableData {
  // 表格名称
  name: string;
  // 数据{key:value, ...}
  items: Array<object>;
}

/**
 * 排序类型
 */
export enum QueryOrder {
  ASC,
  DESC
}

/**
 * 排序条件
 */
export interface QuerySort {
  key?: string;
  order?: QueryOrder
}

/**
 * 模型查询
 */
export interface Query {
  where?: {[key: string]: string|number|null};
  sort?: QuerySort;
}
