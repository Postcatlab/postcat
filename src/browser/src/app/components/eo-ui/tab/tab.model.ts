import type { EventEmitter } from '@angular/core';

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
export declare interface TabViewComponent {
  /**
   * View Component model
   * Usually restored model from tab cache
   */
  model?: any;

  /**
   * Initial model for check form is change
   */
  initialModel?: any;

  /**
   * Emit view component data has init event for initial tab title data/loading..
   */
  eoOnInit: EventEmitter<any>;

  /**
   * Emit view component data has been saved
   */
  afterSaved?: EventEmitter<any>;
  /**
   * Emit view component data has changed event
   */
  modelChange?: EventEmitter<any>;

  /**
   * A callback method that performs custom init tab-ui, invoked immediately after tab has initialized.
   */
  init?(): void;

  /**
   * Edit page tab judge model has changed
   */
  isFormChange?(): boolean;
}
/**
 * Tab item.
 */
export type TabItem = {
  /**
   * Tab id,timestamp
   */
  uuid: number | string;
  /**
   * Unique id,used for identify content
   */
  id: string;
  isFixed?: boolean;
  /**
   * If true,will not cache tab content
   */
  disabledCache?: boolean;
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
