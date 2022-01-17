import { StorageModel } from '../../../modules/storage/storage.model';

/**
 * 环境对象接口
 */
export interface Environment extends StorageModel {
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
   * 前置url
   * @type {string}
   */
  hostUri: string;

  /**
   * 环境变量（可选）
   * @type {object}
   */
  parameters?: object;
}
