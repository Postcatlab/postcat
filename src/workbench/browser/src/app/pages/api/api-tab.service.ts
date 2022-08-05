import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message';
import { debounceTime, Subject } from 'rxjs';
import { ApiTabComponent } from './tab/api-tab.component';
import { TabItem } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
@Injectable()
export class ApiTabService {
  componentRef;
  apiTabComponent: ApiTabComponent;
  // Set current tab type:'preview'|'edit' for  later judgment
  get currentTabType(): string {
    return Object.values(this.BASIC_TBAS).find((val) => val.pathname === window.location.pathname)?.type || 'preview';
  }
  private changeContent$: Subject<string | number> = new Subject();
  BASIC_TBAS = {
    test: { pathname: '/home/api/test', type: 'edit', title: $localize`New API`, extends: { method: 'POST' } },
    edit: { pathname: '/home/api/edit', type: 'edit', title: $localize`New API` },
    detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`Preview` },
    overview: { pathname: '/home/api/overview', type: 'preview', title: $localize`:@@API Index:Index`, icon: 'home' },
    mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock' },
  };
  constructor() {
    this.watchPageLeave();
    this.changeContent$.pipe(debounceTime(100)).subscribe((model) => {
      this.updatePartialTab(model);
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
        console.log(closeTabIDs);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
        break;
      }
      case 'saveApiFromTest': {
        //Close current test page
        const currentTab = this.apiTabComponent.getCurrentTab();
        this.apiTabComponent.batchCloseTab([currentTab.uuid]);
        break;
      }
    }
  }
  bindChildComponentChangeEvent() {
    this.componentRef.modelChange = {
      that: this,
      emit: this.watchContentChange,
    };
    if (this.currentTabType === 'edit') {
      this.componentRef.afterSaved = {
        that: this,
        emit: this.watchContentChange,
      };
    } else {
      this.componentRef.afterInit = {
        that: this,
        emit: this.watchContentChange,
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
  refleshData(lastRouter: NavigationEnd, currentRouter: NavigationEnd) {
    //If componnet init
    if (!this.componentRef?.init) {
      this.changeContent$.next(null);
      return;
    }
    console.log('refleshData');
    //Has tab cache
    const contentStorage = this.apiTabComponent.getCurrentTabStorage();
    // console.log('tabStorage',contentStorage);
    if (contentStorage) {
      this.componentRef.model = contentStorage;
    } else {
      this.componentRef.model = null;
    }
    //Because router reflect childComponnet change, they will query data by themselves.
    if (lastRouter.url.split('?')[0] !== currentRouter.url.split('?')[0]) {
      return;
    }
    this.componentRef.init();
  }
  updatePartialTab(model) {
    const currentTab = this.apiTabComponent.getCurrentTab();
    //Set tabItem
    const tabItem: Partial<TabItem> = {
      isLoading: false,
      extends: {}
    };
    let tabTitle = null;
    if (model) {
      tabItem.extends.method = model.method;
      tabTitle = model.name;
      if (currentTab.pathname === '/home/api/test') {
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
    if (currentTab.type === 'edit') {
      if (!this.componentRef?.isFormChange) {
        throw new Error('EO_ERROR:Child componentRef need has isFormChange function check model change');
      }
      //storage data
      tabItem.content=model;
      tabItem.hasChanged = this.componentRef.isFormChange();
    }
    this.apiTabComponent.updatePartialTab(tabItem);
  }
  componentInit() {
    //If componnet init
    if (!this.componentRef?.init) {
      this.changeContent$.next(null);
      throw new Error('EO_ERROR:Child componentRef need has init function for reflesh data when router change');
    }
  }
  /**
   * Watch router content page change
   * !Current scope {this} has change to Object:{emit,that}
   */
  private watchContentChange = function(model) {
    const that = this.that;
    that.changeContent$.next(model);
  };
  private watchPageLeave() {
    window.addEventListener('beforeunload', function(e) {
      console.log('beforeunload');
    });
  }
}
