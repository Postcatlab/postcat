/**
 * 数据对象基础模型
 */
export interface StorageModel {
  /**
   * 主键UUID，字符串UUID或数值型
   * @type {string|number}
   */
  uuid?: string|number;

  /**
   * 名称
   * @type {string}
   */
  name?: string;

  /**
   * 备注信息
   * @type {string}
   */
  description?: string;

  /**
   * 创建时间，可为空
   * @type {Date}
   */
  createdAt?: Date;

  /**
   * 更新时间，可为空
   * @type {Date}
   */
  updatedAt?: Date;
}
