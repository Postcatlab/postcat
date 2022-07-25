/**
 * Tab item.
 */
export interface TabItem {
  /**
   * Tab id,timestamp
   */
  uuid: number;
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
   * Preview page or edit page
   */
  type: string | 'preview' | 'edit';
  /**
   * In edit page,value will be set true when content change
   */
  hasChanged?: boolean;
  /**
   * Extend key
   */
  extends?: any;
}
