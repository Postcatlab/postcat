import { StorageModel } from '../../../modules/storage/storage.model';

/**
 * 项目对象接口
 */
export interface Project extends StorageModel {
  /**
   * 名称
   * @type {string}
   */
  name: string;
}
