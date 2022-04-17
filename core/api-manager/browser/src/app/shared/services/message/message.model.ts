/**
 * 消息对象接口
 */

export interface Message {
  /**
   * 消息类型
   * @type {string}
   */
  type: string;

  /**
   * 消息数据
   * @data {object}
   */
  data: any;
}
