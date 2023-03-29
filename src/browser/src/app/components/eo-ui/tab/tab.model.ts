import type { EventEmitter } from '@angular/core';
import { PageUniqueName } from 'pc/browser/src/app/pages/workspace/project/api/api-tab.service';

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
declare interface TabViewComponent {
  /**
   * Emit view component data has init event for initial tab title data/loading..
   */
  eoOnInit: EventEmitter<any>;

  /**
   * Check the page can leave,if false will not switch tab
   */
  checkTabCanLeave?(closeTarget: TabItem): Promise<boolean>;
  beforeTabClose?(): Promise<any>;
}
export declare interface PreviewTabViewComponent extends TabViewComponent {}
export declare interface EditTabViewComponent extends TabViewComponent {
  /**
   * View Component model
   * Usually restored model from tab cache
   */
  model: any;
  /**
   * A callback method that performs custom init tab-ui, invoked immediately after tab has initialized.
   */
  afterTabActivated(): void;

  /**
   * Emit view component data has changed event
   */
  modelChange: EventEmitter<any>;

  //*  If tab content can't not be saved,these value can be null
  /**
   * Edit page tab judge model has changed
   */
  isFormChange?(): boolean;

  /**
   * Initial model for check form is change
   */
  initialModel?: any;
  /**
   * Emit view component data has been saved
   */
  afterSaved?: EventEmitter<any>;
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
  uniqueName: string | PageUniqueName;
  /**
   * If the tab is fixed, it will not be replaced by other tab
   *
   *  You can use double-click to fixed the tab prevent it from being replaced
   */
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
