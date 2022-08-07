import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message';
import { debounceTime, of, Subject } from 'rxjs';
import { ApiTabComponent } from './tab/api-tab.component';
import { TabItem } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { isEmptyObj } from '../../utils';
@Injectable()
export class ApiTabService {
  componentRef;
  apiTabComponent: ApiTabComponent;
  // Set current tab type:'preview'|'edit' for  later judgment
  get currentTabType(): string {
    return Object.values(this.BASIC_TBAS).find((val) => val.pathname === window.location.pathname)?.type || 'preview';
  }
  private changeContent$: Subject<any> = new Subject();
  BASIC_TBAS = {
    test: { pathname: '/home/api/test', type: 'edit', title: $localize`New API`, extends: { method: 'POST' } },
    edit: { pathname: '/home/api/edit', type: 'edit', title: $localize`New API` },
    detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`Preview` },
    overview: { pathname: '/home/api/overview', type: 'preview', title: $localize`:@@API Index:Index`, icon: 'home' },
    mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock' },
  };
  constructor() {
    this.changeContent$.pipe(debounceTime(150)).subscribe((inData) => {
      this.afterContentChanged(inData);
    });
  }
  watchApiChange(inArg: Message) {
    switch (inArg.type) {
      case 'deleteApiSuccess': {
        //Close those tab who has been deleted
        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter((val) => inArg.data.uuids.includes(Number(val.params.uuid)))
          .map((val) => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
        break;
      }
      case 'saveApiFromTest': {
        //Close current test page
        const currentTab = this.apiTabComponent.getCurrentTab();
        this.apiTabComponent.batchCloseTab([currentTab.uuid]);
        break;
      }
      case 'tabContentInit': {
        this.updateChildView(window.location.pathname+window.location.search);
        break;
      }
    }
  }
  onChildComponentInit(componentRef) {
    console.log('onChildComponentInit');
    this.componentRef = componentRef;
    this.bindChildComponentChangeEvent();
  }
  /**
   * After tab component/child component  init
   */
  onAllComponentInit() {
    const url = window.location.pathname + window.location.search;
    if (!this.componentRef.init) {
      this.changeContent$.next({ when: 'init', url });
      throw new Error('EO_ERROR:Child componentRef need has init function for reflesh data when router change');
    }
    this.updateChildView(url);
  }
  private bindChildComponentChangeEvent() {
    if (!this.componentRef) {
      return;
    }
    const url = window.location.pathname + window.location.search;
    this.componentRef.modelChange = {
      emit: (model) => {
        this.changeContent$.next({ when: 'editing', url, model });
      },
    };
    this.componentRef.afterInit = {
      emit: (model) => {
        this.afterContentChanged({ when: 'init', url, model });
      },
    };
    if (this.currentTabType === 'edit') {
      this.componentRef.afterSaved = {
        emit: (model) => {
          this.afterContentChanged({ when: 'saved', url, model });
        },
      };
    }
  }
  /**
   * Before close tab,handle page content
   *
   * @param needSave  Do you want to save the changes?
   */
  beforeTabClose(needSave) {
    if (!needSave) {
      return;
    }
    this.componentRef.saveApi();
  }
    /**
     * Reflesh data after Tab init
     *
     * @param lastRouter
     * @param currentRouter
     * @returns
     */
  updateChildView(url) {
    if (!this.apiTabComponent) {return;}
    this.bindChildComponentChangeEvent();
    console.log('updateChildView', url);
    //Set tab cache
    //?Why should use getCurrentTab()?
    //Because maybe current tab  has't  finish init
    const currentTab = this.apiTabComponent.getTabByUrl(url);
    //! Filter child components that do not have a corresponding Tab
    this.componentRef.model = currentTab?.content || null;
    this.componentRef.initialModel = currentTab?.baseContent || null;
    this.componentRef.init();
  }

  /**
   * After content changed
   * Update tab by model data
   *
   * @param inData.url get component fit tab data
   */
  afterContentChanged(inData: { when: 'init' | 'editing' | 'saved'; url: string; model: any }) {
    if (!this.apiTabComponent) {
      console.warn(`EO_WARNING:apiTabComponent hasn't init yet!`);
      return;
    }
    const currentContentTab = this.apiTabComponent.getTabByUrl(inData.url);
    if (!currentContentTab) {
      return;
    }
    const model = inData.model;
    //Set tabItem
    const tabItem: Partial<TabItem> = {
      isLoading: false,
      extends: {},
    };
    //Set title
    let tabTitle = null;
    if (model) {
      tabItem.extends.method = model.method;
      tabTitle = model.name;
      if (currentContentTab.pathname === '/home/api/test') {
        if (!model.uuid) {
          //Only Untitle request need set url to tab title
          tabTitle = model.uri || tabTitle;
        }
      }
      if (tabTitle) {
        tabItem.title = tabTitle;
      }
    }
    //Set hasChange
    if (currentContentTab.type === 'edit') {
      //Set baseContent
      if (inData.when === 'init') {
        const initialModel = this.componentRef.initialModel;
        tabItem.baseContent = initialModel && !isEmptyObj(initialModel) ? initialModel : null;
      }
      if (!this.componentRef?.isFormChange) {
        throw new Error('EO_ERROR:Child componentRef need has isFormChange function check model change');
      }
      //Only edit page storage data
      tabItem.content = model && !isEmptyObj(model) ? model : null;
      tabItem.hasChanged = this.componentRef.isFormChange(currentContentTab.baseContent);
    }
    console.log('updatePartialTab', currentContentTab, inData);
    this.apiTabComponent.updatePartialTab(inData.url, tabItem);
  }
}
