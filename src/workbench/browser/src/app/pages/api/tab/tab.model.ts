export enum TabOperate {
  closeOther = 'closeOther',
  closeAll = 'closeAll',
  closeLeft = 'closeLeft',
  closeRight = 'closeRight',
}
/**
 * Tab item.
 */
export type TabItem = {
  /**
   * Tab id,timestamp
   */
  uuid: number;
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
   * Tab content
   */
  content: any;
};
