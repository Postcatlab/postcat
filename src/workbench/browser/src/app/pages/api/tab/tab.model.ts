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
  isLoading: boolean;
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
   * Preview page or edit page
   */
  type: string | 'preview' | 'edit';
  /**
   * Query params
   */
  params: any;
  /**
   * In edit page,value will be set true when content change
   */
  hasChanged?: boolean;
  /**
   * Content Icon
   */
  icon?: string;
  /**
   * Extend key
   */
  extends?: any;
};
