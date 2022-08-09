import { Injectable } from '@angular/core';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message';
import { debounceTime, Subject } from 'rxjs';
import { ApiTabComponent } from './tab/api-tab.component';
import { TabItem } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
import { isEmptyObj } from '../../utils';
import { MessageService } from '../../shared/services/message';
import { Router } from '@angular/router';
@Injectable()
export class ApiTabService {
  componentRef;
  apiTabComponent: ApiTabComponent;
  // Set current tab type:'preview'|'edit' for  later judgment
  get currentTabType(): string {
    return Object.values(this.BASIC_TBAS).find((val) => this.router.url.includes(val.pathname))?.type || 'preview';
  }
  private changeContent$: Subject<any> = new Subject();
  BASIC_TBAS = {
    test: { pathname: '/home/api/test', type: 'edit', title: $localize`New Request`, extends: { method: 'POST' } },
    edit: { pathname: '/home/api/edit', type: 'edit', title: $localize`New API` },
    detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`Preview` },
    overview: { pathname: '/home/api/overview', type: 'preview', title: $localize`:@@API Index:Index`, icon: 'home' },
    mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock' },
  };
  constructor(private messageService: MessageService, private router: Router) {
    this.changeContent$.pipe(debounceTime(150)).subscribe((inData) => {
      this.afterContentChanged(inData);
    });
    this.messageService.get().subscribe((inArg: Message) => {
      this.watchApiChange(inArg);
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
        this.updateChildView(this.router.url);
        break;
      }
    }
  }
  onChildComponentInit(componentRef) {
    this.componentRef = componentRef;
  }
  /**
   * After tab component/child component  init
   */
  onAllComponentInit() {
    const url = this.router.url;
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
    const url = this.router.url;
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
      this.componentRef.modelChange = {
        emit: (model) => {
          this.changeContent$.next({ when: 'editing', url, model });
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
    if (!this.apiTabComponent) {
      return;
    }
    this.bindChildComponentChangeEvent();
    //Set tab cache
    //?Why should use getCurrentTab()?
    //Because maybe current tab  has't  finish init
    const currentTab = this.apiTabComponent.getTabByUrl(url);
    //! Filter child components that do not have a corresponding Tab
    this.componentRef.model = currentTab?.content || null;
    this.componentRef.initialModel = currentTab?.baseContent || null;
    this.componentRef.init();
  }
  updateTab(currentContentTab, inData) {
    const model = inData.model;
    if (!model || isEmptyObj(model)) {
      return;
    }
    //Set tabItem
    const tabItem: Partial<TabItem> = {
      isLoading: false,
      extends: {},
    };
    //Set title/method
    tabItem.title = model.name;
    tabItem.extends.method = model.method;
    if (currentContentTab.pathname === '/home/api/test') {
      tabItem.extends.method = model.request.method;
      //Only Untitle request need set url to tab title
      if (!model.request.uuid) {
        tabItem.title ??= model.request.uri || this.BASIC_TBAS.test.title;
      } else {
        tabItem.title ??= model.request.name;
      }
    } else if (!model.uuid) {
      tabItem.title ??= Object.values(this.BASIC_TBAS).find((val) => val.pathname === tabItem.pathname).title;
    }

    //Only edit page storage data
    if (currentContentTab.type === 'edit') {
      //Set baseContent
      if (['init', 'saved'].includes(inData.when)) {
        const initialModel = this.componentRef.initialModel;
        tabItem.baseContent = initialModel && !isEmptyObj(initialModel) ? initialModel : null;
      }
      tabItem.content = model && !isEmptyObj(model) ? model : null;

      //Set hasChange
      if (!this.componentRef?.isFormChange) {
        throw new Error('EO_ERROR:Child componentRef need has isFormChange function check model change');
      }
      if (['init', 'saved'].includes(inData.when)) {
        tabItem.hasChanged = false;
      } else {
        tabItem.hasChanged = this.componentRef.isFormChange();
      }
    }
    // console.log('updatePartialTab', currentContentTab.uuid, tabItem);
    this.apiTabComponent.updatePartialTab(inData.url, tabItem);
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
      console.warn(`has't find the tab fit child component ,url:${inData.url}`);
      return;
    }
    this.updateTab(currentContentTab, inData);
  }
}
