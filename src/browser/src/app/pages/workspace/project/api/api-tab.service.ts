import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, reaction, toJS } from 'mobx';
import { EditTabViewComponent, TabItem } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { BASIC_TABS_INFO, requestMethodMap, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { Message } from 'pc/browser/src/app/services/message';
import { GroupModuleType, GroupType, ViewGroup } from 'pc/browser/src/app/services/storage/db/models';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { flatTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { debounceTime, Subject } from 'rxjs';

import { EoTabComponent } from '../../../../components/eo-ui/tab/tab.component';
import { MessageService } from '../../../../services/message';
import { eoDeepCopy as pcDeepCopy, isEmptyObj } from '../../../../shared/utils/index.utils';
export enum PageUniqueName {
  HttpTest = 'api-http-test',
  HttpDetail = 'api-http-detail',
  HttpEdit = 'api-http-edit',
  HttpCase = 'api-http-case-edit',
  HttpMock = 'api-http-mock-edit',
  WsTest = 'api-ws-test',
  EnvEdit = 'project-env-edit',
  GroupEdit = 'project-group'
}
export const API_TABS: Array<Partial<TabItem>> = [
  {
    pathname: '/http/test',
    uniqueName: PageUniqueName.HttpTest,
    type: 'edit',
    title: $localize`New Request`,
    extends: { method: 'POST' }
  },
  {
    pathname: '/env/edit',
    uniqueName: PageUniqueName.EnvEdit,
    type: 'edit',
    icon: 'application',
    title: $localize`New Environment`
  },
  {
    pathname: '/group/edit',
    uniqueName: PageUniqueName.GroupEdit,
    type: 'edit',
    icon: 'folder-close',
    title: $localize`:@@AddGroup:New Group`
  },
  {
    pathname: '/http/edit',
    uniqueName: PageUniqueName.HttpEdit,
    isFixed: true,
    type: 'edit',
    title: $localize`New API`
  },
  { pathname: '/http/detail', uniqueName: PageUniqueName.HttpDetail, type: 'preview', title: $localize`Preview` },
  {
    pathname: '/ws/test',
    uniqueName: PageUniqueName.WsTest,
    isFixed: true,
    type: 'edit',
    extends: { method: 'WS' },
    title: $localize`New Websocket`
  },
  { pathname: '/http/case', uniqueName: PageUniqueName.HttpCase, type: 'edit', title: $localize`New Case` },
  { pathname: '/http/mock', icon: 'mock', uniqueName: PageUniqueName.HttpMock, type: 'edit', title: $localize`New Mock`, isFixed: true }
];
interface TabEvent {
  when: 'activated' | 'editing' | 'saved' | 'afterTested';
  currentTabID: TabItem['uuid'];
  model?: any;
}
@Injectable()
export class ApiTabService {
  componentRef: EditTabViewComponent | any;
  apiTabComponent: EoTabComponent;
  // Set current tab type:'preview'|'edit' for  later judgment
  get currentComponentTab(): Partial<TabItem> {
    return this.BASIC_TABS.find(val => this.router.url.includes(val.pathname));
  }
  private changeContent$: Subject<TabEvent> = new Subject();
  BASIC_TABS: Array<Partial<TabItem>>;
  constructor(
    private messageService: MessageService,
    private router: Router,
    private globalStore: StoreService,
    private store: ApiStoreService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.changeContent$.pipe(debounceTime(150)).subscribe(inData => {
      this.afterTabContentChanged(inData);
    });
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type !== 'tabContentInit') return;
      this.updateTabContent(inArg.data.uuid);
    });
    this.BASIC_TABS = this.tabsConfig.BASIC_TABS;
    this.closeTabAfterResourceRemove();
  }
  /**
   * Watch API/Group/Case/Env/Mock change for handle tab status to fit content
   *
   * ？It is optimal to control Tab closing through a specific event transmission ID, but this event will always be ignored in use
   *
   * @param inArg
   */
  closeTabAfterResourceRemove() {
    const checkTabIsExist = (groups: ViewGroup[], tab: TabItem) => {
      const isExist = groups.some(group => {
        //TODO check group.id is same as resource id
        if (!tab.params?.uuid) return true;
        const modelID = Number(tab.params.uuid) || tab.params.uuid;
        if (modelID === group.id && group.type === GroupType.UserCreated && tab.uniqueName === PageUniqueName.GroupEdit) {
          return true;
        }
        if (
          modelID === group.relationInfo?.apiUuid &&
          group.module === GroupModuleType.API &&
          [PageUniqueName.HttpEdit, PageUniqueName.HttpDetail, PageUniqueName.HttpTest].includes(tab.uniqueName as PageUniqueName)
        ) {
          return true;
        }
        if (
          modelID === group.relationInfo?.apiCaseUuid &&
          group.module === GroupModuleType.Case &&
          tab.uniqueName === PageUniqueName.HttpCase
        ) {
          return true;
        }
        if (modelID === group.relationInfo?.id && group.module === GroupModuleType.Mock && tab.uniqueName === PageUniqueName.HttpMock) {
          return true;
        }
        return false;
      });
      return isExist;
    };
    //Delete group/api/case/mock
    reaction(
      () => this.store.getGroupList,
      (value, previousValue) => {
        const currentFlatTree = flatTree(value);
        const previousFlatTres = flatTree(previousValue);
        const hasDeleted = currentFlatTree.length < previousFlatTres.length;
        if (!hasDeleted) return;

        //Close them
        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter((tab: TabItem) => !checkTabIsExist(currentFlatTree, tab))
          .map(val => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
      }
    );

    //Delete env
    reaction(
      () => this.store.getEnvList,
      (value, previousValue) => {
        const hasDeleted = value.length < previousValue.length;
        if (!hasDeleted) return;

        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter(
            (tab: TabItem) =>
              tab.params?.uuid && value.every(env => env.id.toString() !== tab.params.uuid) && tab.uniqueName === PageUniqueName.EnvEdit
          )
          .map(val => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
      }
    );
  }
  onChildComponentInit(componentRef) {
    this.componentRef = componentRef;
  }
  /**
   * After tab component/child component  init
   */
  onAllComponentInit() {
    //We need to wait for tabComponent and childComponent onInit finished
    this.updateTabContent();
  }
  private bindChildComponentChangeEvent() {
    if (!this.componentRef) {
      return;
    }
    //Bind event tab
    const bindTabID = this.apiTabComponent.getCurrentTab()?.uuid;
    this.componentRef.eoOnInit = {
      emit: model => {
        //Current is current selected tab
        const currentTab = this.apiTabComponent.getCurrentTab();
        if (!model) {
          pcConsole.warn('[api-tab] eoOnInit cannot pass in null value, this tab will be closed automatically');
          this.apiTabComponent.batchCloseTab([currentTab.uuid]);
          return;
        }
        //resourceID
        let modelID: number;
        switch (currentTab.uniqueName) {
          case PageUniqueName.HttpEdit:
          case PageUniqueName.HttpTest:
          case PageUniqueName.HttpEdit: {
            modelID = model.apiUuid;
            break;
          }
          default: {
            modelID = model.uuid || model.id;
            break;
          }
        }

        //1. The currently active tab is not the one that initiated the request
        const notCurrentTab = currentTab.uuid !== bindTabID;
        //2. the request response is not what the current active tab needs
        const notCurrentResource = modelID && currentTab.params?.uuid && currentTab.params?.uuid !== modelID.toString();
        const modelFromOtherTab = notCurrentTab || notCurrentResource;
        if (!modelFromOtherTab) {
          this.afterTabContentChanged({ when: 'activated', currentTabID: bindTabID, model });
          return;
        }

        //! The previous Tab's(bindTab) request may overwrite the current Tab's(currentTab) data.
        pcConsole.warn(
          `The current tab data will be restored from the cache to prevent it from being overwritten by the result of the previous Tab asynchronous request.
            previous tab:${model.name}
            current tab:${currentTab.title}`
        );

        //* When data inconsistent, we need to manually reset the model from cache
        const hasCache = !!currentTab?.content?.[currentTab.uniqueName];
        if (!currentTab.isLoading && hasCache) {
          //If the current tab is not the one that initiated the request, we need to restore the data from the cache
          this.afterTabActivated(currentTab);
        }

        const actuallyID = this.apiTabComponent.getTabByParamsID(modelID.toString())?.uuid || bindTabID;
        this.afterTabContentChanged({ when: 'activated', currentTabID: actuallyID, model });
      }
    };

    //Edit page has save/editing event
    if (this.currentComponentTab.type === 'edit') {
      this.componentRef.afterSaved = {
        emit: model => {
          this.afterTabContentChanged({ when: 'saved', currentTabID: bindTabID, model });
        }
      };
      this.componentRef.modelChange = {
        emit: model => {
          this.changeContent$.next({ when: 'editing', currentTabID: bindTabID, model });
        }
      };
    }

    //Test page has tested event
    if (this.currentComponentTab.pathname.includes('test')) {
      this.componentRef.afterTested = {
        emit: model => {
          this.afterTabContentChanged({ when: 'afterTested', currentTabID: bindTabID, model });
        }
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
    this.componentRef.beforeTabClose();
  }
  getCurrentTabCache(currentTab: TabItem) {
    const contentID = currentTab.uniqueName;
    //Get tab from cache
    return {
      hasCache: !!currentTab?.content?.[contentID],
      model: currentTab?.content?.[contentID] || null,
      initialModel: currentTab?.baseContent?.[contentID] || null
    };
  }
  /**
   * Call tab component  afterTabActivated
   *
   * @param currentTab
   */
  afterTabActivated(currentTab: TabItem) {
    const cacheResult = this.getCurrentTabCache(currentTab);
    this.componentRef.model = cacheResult.model;
    this.componentRef.initialModel = cacheResult.initialModel;

    this.componentRef.afterTabActivated();
  }

  /**
   * Reflesh tab content[childComponent] after Tab activated
   *
   * @param lastRouter
   * @param currentRouter
   * @returns
   */
  updateTabContent(uuid?) {
    if (!this.apiTabComponent) {
      return;
    }
    this.bindChildComponentChangeEvent();

    //?Why should use getCurrentTab() directly
    //Because maybe current tab  has't  finish init
    const currentTab = uuid ? this.apiTabComponent.getTabByID(uuid) : this.apiTabComponent.getCurrentTab();

    if (!currentTab) {
      return;
    }
    if (!this.componentRef?.afterTabActivated) {
      this.changeContent$.next({ when: 'activated', currentTabID: currentTab.uuid });
      pcConsole.error(
        'Child componentRef need has afterTabActivated function for reflesh data when router change,Please add afterTabActivated function in child component'
      );
      return;
    }
    this.afterTabActivated(currentTab);
  }
  /**
   * Generate tab header info,title,method,icon and so on
   *
   * @param currentTab
   * @param model
   * @returns
   */
  getTabHeaderInfo(currentTab, model): { title: string; method: string } {
    const result = {
      title: model.name,
      method: ''
    };
    result.title = model.name;
    result.method = requestMethodMap[model.apiAttrInfo?.requestMethod];

    const isTestPage = [PageUniqueName.HttpCase, PageUniqueName.HttpTest, PageUniqueName.WsTest].includes(currentTab.uniqueName);
    const isEmptyPage = !model.uuid;

    if (!isTestPage) {
      if (isEmptyPage) {
        result.title = result.title || this.BASIC_TABS.find(val => val.pathname === currentTab.pathname).title;
      }
      return result;
    }

    //Test page,generate title and method from model.url
    if (currentTab.uniqueName === PageUniqueName.WsTest) {
      result.method = 'WS';
    } else {
      result.method = requestMethodMap[model.request.apiAttrInfo?.requestMethod];
    }
    //Only Untitle request need set url to tab title
    const originTitle = this.BASIC_TABS.find(val => val.pathname === currentTab.pathname)?.title;
    const isHistoryPage = currentTab.params?.uuid?.includes('history_');
    if (!model.request.uuid || isHistoryPage) {
      result.title = model.request.uri || originTitle;
    } else {
      result.title = model.request.name || originTitle;
    }
    return result;
  }

  updateTab(currentTab: TabItem, inData: TabEvent) {
    const model = inData.model;
    if (!model || isEmptyObj(model)) return;

    const contentID = currentTab.uniqueName;
    // if (!currentTab.baseContent) {
    //   console.error('nononononnononononnononononnononononnononononnononononnonononon baseContent lose', inData.when, currentTab.uuid);
    // }
    //Set tabItem
    const replaceTab: Partial<TabItem> = {
      hasChanged: currentTab.hasChanged,
      isLoading: false,
      extends: {}
    };
    //* Set title/method
    const tabHeaderInfo = this.getTabHeaderInfo(currentTab, model);
    replaceTab.title = tabHeaderInfo.title;
    replaceTab.extends.method = tabHeaderInfo.method;

    //* Set Edit page,such  as  tab title,storage data,unsaved status by check model change
    if (currentTab.type === 'edit') {
      //Set tab storage
      //Set baseContent
      if (['activated', 'saved'].includes(inData.when)) {
        const initialModel = pcDeepCopy(inData.model);
        //Update tab by id,may not be the current selected tab
        const isCurrentSelectedTab = currentTab.uuid === this.apiTabComponent.getCurrentTab().uuid;
        //If is current tab,set initialModel automatically
        if (isCurrentSelectedTab) {
          this.componentRef.initialModel = initialModel;
        }
        //Saved data may update all IntialData
        replaceTab.baseContent = inData.when === 'saved' ? {} : currentTab.baseContent || {};
        replaceTab.baseContent[contentID] = initialModel && !isEmptyObj(initialModel) ? initialModel : null;
      }
      //Set content
      replaceTab.content = inData.when === 'saved' ? {} : currentTab.content || {};
      replaceTab.content[contentID] = model && !isEmptyObj(model) ? model : null;

      let currentHasChanged = currentTab.extends?.hasChanged?.[contentID];
      switch (inData.when) {
        case 'editing': {
          //Set hasChange
          if (!this.componentRef?.isFormChange) {
            throw new Error(
              `EO_ERROR:Child componentRef[${this.componentRef.constructor.name}] need has isFormChange function check model change`
            );
          }
          currentHasChanged = this.componentRef.isFormChange();
          break;
        }
        case 'saved': {
          currentHasChanged = false;
          break;
        }
      }
      //* Share change status within all content page
      replaceTab.extends.hasChanged = currentTab.extends?.hasChanged || {};
      replaceTab.extends.hasChanged[contentID] = currentHasChanged;

      // Editiable tab  share hasChanged data
      if (!currentHasChanged && currentTab.extends?.hasChanged) {
        const otherEditableTabs = this.BASIC_TABS.filter(val => val.type === 'edit' && val.uniqueName !== contentID);
        currentHasChanged = otherEditableTabs.some(tabItem => currentTab.extends?.hasChanged[tabItem.uniqueName]);
      }
      replaceTab.hasChanged = currentHasChanged;
    }

    //Set isFixed
    if (replaceTab.hasChanged) {
      replaceTab.isFixed = true;
    }

    //Has tested/exsix api set fixed
    const isTestPage = [PageUniqueName.HttpCase, PageUniqueName.HttpTest, PageUniqueName.WsTest].includes(
      currentTab.uniqueName as PageUniqueName
    );
    if (isTestPage && model.testStartTime !== undefined) {
      replaceTab.isFixed = true;
    }
    // console.log('updatePartialTab', currentTab.uuid, replaceTab);
    this.apiTabComponent.updatePartialTab(currentTab.uuid, replaceTab);
  }
  /**
   * After content changed
   * Update tab by model data
   *
   * @param inData.url get component fit tab data
   */
  afterTabContentChanged(inData: TabEvent) {
    if (!this.apiTabComponent) {
      pcConsole.warn(`ING[api-tab]: apiTabComponent hasn't init yet!`);
      return;
    }

    const currentTab = this.apiTabComponent.getTabByID(inData.currentTabID);
    if (!currentTab) {
      pcConsole.warn(`ING[api-tab]: has't find the tab fit child component ,url:${inData.currentTabID}`);
      return;
    }

    //Unit request is asynchronous,Update other tab test result
    if (inData?.when === 'afterTested') {
      inData.model = { ...currentTab.content.test, ...inData.model.model };
    }
    this.updateTab(currentTab, inData);
  }
  /**
   * Handle cache data before restore tab info
   *
   * @param tabsInfo
   * @returns
   */
  handleDataBeforeGetCache = tabsInfo => {
    if (!tabsInfo?.tabOrder?.[0]) return null;
    const tab = tabsInfo.tabsByID[tabsInfo.tabOrder[0]];
    if (!tab) return null;
    const { wid, pid } = tab.params;
    if (wid !== this.globalStore.getCurrentWorkspaceUuid || pid !== this.globalStore.getCurrentProjectID) return null;
    return tabsInfo;
  };
  /**
   * Handle cache data before storage tab info
   *
   * @param tabsInfo
   * @returns
   */
  handleDataBeforeCache = tabStorage => {
    Object.values(tabStorage.tabsByID).forEach((val: TabItem) => {
      //Delete gio key
      if (val.params) {
        ['utm_campaign', 'utm_content', 'utm_source'].forEach(keyName => {
          delete val.params[keyName];
        });
      }
      //Cancel cache testResult
      if (val.pathname.includes('test') && val.content?.test?.testResult) {
        val.content.test.testResult = {
          request: {},
          response: {}
        };
      }
    });
    return tabStorage;
  };
}
