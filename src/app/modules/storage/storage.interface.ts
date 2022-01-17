import { Query, StorageSetting } from './storage.config';
import { Observable } from 'rxjs';

/**
 * 数据服务层接口
 */
export interface StorageInterface {
  /**
   * 初始化数据库
   * @param setting 数据库配置
   */
  init: (setting: StorageSetting)=>void;

  /**
   * 返回数据库实例，直接操作底层方法
   */
  db: ()=>any;

  /**
   * 返回当前对象
   * @param tableName 表名
   */
  table(tableName: string): StorageInterface;

  /**
   * 设置表格名称并返回模型对象
   * @param tableName 表名
   */
  setTable: (tableName: string)=>any;

  /**
   * 添加数据
   * @param data 数据对象{key:value, ...}
   * @param tableName 表名
   */
  create: (data: object, tableName?: string)=>Observable<object>;

  /**
   * 批量添加数据
   * @param data 数据对象组[{key:value, ...}, ...]
   * @param tableName 表名
   */
  bulkCreate: (data: Array<object>, tableName?: string)=>Observable<object>;

  /**
   * 更新数据
   * @param data 数据对象{key:value, ...}
   * @param uuid 主键
   * @param tableName 表名
   */
  update: (data: object, uuid: number|string, tableName?: string)=>Observable<object>;

  /**
   * 批量更新数据
   * @param data 数据对象组，主键包含在数据对象[{id:value, key:value, ...}, ...]
   * @param table 表名
   */
  bulkUpdate: (data: Array<object>, tableName?: string)=>Observable<object>;

  /**
   * 删除数据
   * @param uuid 主键
   * @param tableName 表名
   */
  remove: (uuid: number|string, tableName?: string)=>Observable<boolean>;

  /**
   * 批量删除数据
   * @param uuids 主键数组[uuid1, ...]
   * @param tableName 表名
   */
  bulkRemove: (uuids: Array<number|string>, tableName?: string)=>Observable<boolean>;

  /**
   * 根据主键加载数据
   * @param uuid 主键
   * @param tableName 表名
   */
  load: (uuid: number|string, tableName?: string)=>Observable<object>;

  /**
   * 根据条件加载数据
   * @param query 索引字段条件 {keyPath1: value1, keyPath2: value2, ...}
   * @param tableName 表名
   */
  loadBy: (query: {[key: string]: string | number | null}, tableName?: string)=>Observable<object>;

  /**
   * 根据主键批量加载数据
   * @param uuids 主键数组[uuid1, ...]
   * @param tableName 表名
   */
  bulkLoad: (uuids: Array<number|string>, tableName?: string)=>Observable<Array<object>>;

  /**
   * 加载所有数据
   * @param tableName 表名
   */
  loadAll: (query?: Query, tableName?: string)=>Observable<Array<object>>;

  /**
   * 根据条件加载所有数据
   * @param query 模型条件
   * @param tableName 表名
   */
  loadAllBy: (query?: Query, tableName?: string)=>Observable<Array<object>>;
}
