/**
 * Group tree item.
 */
export interface GroupTreeItem {
  /**
   * Name
   *
   * @type {string}
   */
  title: string;

  /**
   * Primary key
   *
   * @type {string}
   */
  key: string;

  /**
   * Weight
   *
   * @type {number}
   */
  weight: number;

  /**
   * Parent item id
   *
   * @type {string }
   */
  parentID: string;

  /**
   * Item or folder
   * If true, it means api data.
   *
   * @type {boolean}
   */
  isLeaf: boolean;

  /**
   * Api data request method. only for display.
   *
   * @type {string}
   */
  method?: string;

  /**
   * Child items
   *
   * @type {GroupTreeItem}
   */
  children?: Array<GroupTreeItem>;
}

/**
 * Group & Api Data
 */
export interface GroupApiDataModel {
  group: Array<any>;
  api: Array<any>;
}
