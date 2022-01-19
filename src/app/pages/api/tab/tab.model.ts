/**
 * Tab item.
 */
export interface TabItem {
  uuid: number;
  /**
   * 标签标题
   *
   * @type {string}
   */
  title: string;

  /**
   * 标签对应的路径
   *
   * @type {string}
   */
  path: string;

  /**
   * 路径的主键参数
   *
   * @type {string | number}
   */
  key?: string | number;

  /**
   * 路径的分组参数
   *
   * @type {string | number}
   */
  groupID?: string | number;

  /**
   * 路径的项目参数
   *
   * @type {string | number}
   */
  projectID?: string | number;

  /**
   * 标签路径的请求类型，用于显示
   *
   * @type {string | number}
   */
  method?: string;

  /**
   * 实体类型，为后期加上其他类型到Tab预留，如Group
   *
   * @type {string}
   */
  entity?: string;
}
