import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message';

@Injectable()
export class ApiTabService {
  componentRef;
  apiTabComponent;
  // Set current tab type:'preview'|'edit' for  later judgment
  get currentTabType(): string {
    return Object.values(this.BASIC_TBAS).find((val) => val.pathname === window.location.pathname)?.type || 'preview';
  }
  BASIC_TBAS = {
    test: { pathname: '/home/api/test', type: 'edit', title: $localize`New API` },
    edit: { pathname: '/home/api/edit', type: 'edit' },
    detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`:@@API Detail:Preview` },
    overview: { pathname: '/home/api/overview', type: 'preview', title: $localize`:@@API Index:Index` },
    mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock' },
  };
  constructor() {}
  watchApiChange(inArg: Message) {
    switch (inArg.type) {
      case 'deleteApiSuccess': {
        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter((val) => inArg.data.uuids.includes(Number(val.params.uuid)))
          .map((val) => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
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
    if (this.componentRef?.init) {
      //Because router reflect childComponnet change, they will query data by themselves.
      if (lastRouter.url.split('?')[0] !== currentRouter.url.split('?')[0]) {
        return;
      }
      this.componentRef.model = null;
      this.componentRef.init();
    } else {
      throw new Error('EO_ERROR:Child componentRef need has init function for reflesh data when router change');
    }
  }

  /**
   * Watch router content page change
   * !Current scope {this} has change to Object:{emit,that}
   */
  private watchContentChange = function() {
    const that = this.that;
    console.log('watchContentChange', that.componentRef.model);
    const tabItem: any = {
      title: that.componentRef.model.name,
      extends: {
        method: that.componentRef.model.method,
      },
    };
    if (this.currentTabType === 'edit') {
      tabItem.hasChanged = that.componentRef.isFormChange();
    }
    that.apiTabComponent.updateTab(tabItem);
  };
}
