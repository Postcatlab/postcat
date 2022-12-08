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
   * Api uri
   *
   * @type {string}
   */
  uri?: string;

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
   * Item or folder
   * If true, it means fixed group
   *
   * @type {boolean}
   */
  isFixed?: boolean;

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
  children?: GroupTreeItem[];
}

/**
 * Group & Api Data
 */
export interface GroupApiDataModel {
  group: any[];
  api: any[];
}
