export enum TabOperate {
  closeOther = 'closeOther',
  closeAll = 'closeAll',
  closeLeft = 'closeLeft',
  closeRight = 'closeRight'
}
export type storageTab = {
  selectedIndex: number;
  tabOrder: number[];
  tabsByID: { [key: number]: TabItem };
};
/**
 * Tab item.
 */
export type TabItem = {
  /**
   * Tab id,timestamp
   */
  uuid: number;
  /**
   * Unique id,used for identify content
   */
  id: string;
  isFixed?: boolean;
  /**
   * Preview page or edit page
   */
  type: string | 'preview' | 'edit';
  /**
   * In edit page,value will be set true when content change
   */
  hasChanged?: boolean;

  isLoading: boolean;
  /**
   * Tab title
   *
   * @type {string}
   */
  title: string;
  /**
   * Router path
   *
   * @type {string}
   */
  pathname: string;

  /**
   * Query params
   */
  params: any;
  /**
   * Content Icon
   */
  icon?: string;
  /**
   * Extend key
   */
  extends?: any;
  /**
   * Save base model used by judge form is change
   * Only exist in tab[type='edit']
   */
  baseContent?: any;
  /**
   * Tab content
   */
  content: any;
};
