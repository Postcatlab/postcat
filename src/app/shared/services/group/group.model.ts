import { StorageModel } from '../../../modules/storage/storage.model';

/**
 * 分组对象接口
 */
export interface Group extends StorageModel {
  /**
   * 名称
   * @type {string}
   */
  name: string;

  /**
   * 项目主键ID
   * @type {string|number}
   */
  projectID: string|number;

  /**
   * 上级分组主键，最顶层是0
   * @type {string|number}
   */
  parentID?: string|number;

  /**
   * 分组排序号
   * @type {number}
   */
  weight?: number;
}
