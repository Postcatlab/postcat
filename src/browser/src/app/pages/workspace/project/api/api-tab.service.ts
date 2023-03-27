import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, reaction, toJS } from 'mobx';
import { EditTabViewComponent, TabItem } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { requestMethodMap } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiStoreService } from 'pc/browser/src/app/pages/workspace/project/api/store/api-state.service';
import { Message } from 'pc/browser/src/app/services/message';
import { GroupModuleType, GroupType } from 'pc/browser/src/app/services/storage/db/models';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { flatTree } from 'pc/browser/src/app/shared/utils/tree/tree.utils';
import { debounceTime, Subject } from 'rxjs';

import { EoTabComponent } from '../../../../components/eo-ui/tab/tab.component';
import { MessageService } from '../../../../services/message';
import { eoDeepCopy, isEmptyObj } from '../../../../shared/utils/index.utils';

interface TabEvent {
  when: 'activated' | 'editing' | 'saved' | 'afterTested';
  currentTabID: TabItem['uuid'];
  model: any;
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
  SHARE_TABS: Array<Partial<TabItem>> = [
    {
      pathname: '/share/http/test',
      uniqueName: 'share-api-test',
      type: 'edit',
      title: $localize`New Request`,
      extends: { method: 'POST' }
    },
    { pathname: '/share/http/detail', uniqueName: 'share-api-detail', type: 'preview', title: $localize`Preview` },
    { pathname: '/share/group/edit', uniqueName: 'share-group-edit', type: 'preview', title: $localize`Preview` },
    {
      pathname: '/share/ws/test',
      uniqueName: 'share-api-test',
      isFixed: true,
      type: 'preview',
      extends: { method: 'WS' },
      title: $localize`New Websocket`
    }
  ];
  API_TABS: Array<Partial<TabItem>> = [
    {
      pathname: '/home/workspace/project/api/http/test',
      uniqueName: 'api-http-test',
      type: 'edit',
      title: $localize`New Request`,
      extends: { method: 'POST' }
    },
    {
      pathname: '/home/workspace/project/api/env/edit',
      uniqueName: 'project-env',
      type: 'edit',
      icon: 'application',
      title: $localize`New Environment`
    },
    {
      pathname: '/home/workspace/project/api/group/edit',
      uniqueName: 'project-group',
      type: 'edit',
      icon: 'folder-close',
      title: $localize`:@@AddGroup:New Group`
    },
    {
      pathname: '/home/workspace/project/api/http/edit',
      uniqueName: 'api-http-edit',
      isFixed: true,
      type: 'edit',
      title: $localize`New API`
    },
    { pathname: '/home/workspace/project/api/http/detail', uniqueName: 'api-http-detail', type: 'preview', title: $localize`Preview` },
    {
      pathname: '/home/workspace/project/api/ws/test',
      uniqueName: 'api-ws-test',
      isFixed: true,
      type: 'edit',
      extends: { method: 'WS' },
      title: $localize`New Websocket`
    },
    { pathname: '/home/workspace/project/api/http/case', uniqueName: 'api-http-case', type: 'edit', title: 'Case', isFixed: true },
    { pathname: '/home/workspace/project/api/http/mock', uniqueName: 'api-http-mock', type: 'edit', title: 'Mock', isFixed: true }
  ];
  BASIC_TABS: Array<Partial<TabItem>>;
  constructor(
    private messageService: MessageService,
    private router: Router,
    private globalStore: StoreService,
    private store: ApiStoreService
  ) {
    this.changeContent$.pipe(debounceTime(150)).subscribe(inData => {
      this.afterTabContentChanged(inData);
    });
    this.messageService.get().subscribe((inArg: Message) => {
      if (inArg.type !== 'tabContentInit') return;
      this.updateTabContent(inArg.data.uuid);
    });
    this.closeTabAfterResourceRemove();
    autorun(() => {
      this.BASIC_TABS = this.globalStore.isShare ? this.SHARE_TABS : this.API_TABS;
    });
  }
  /**
   * Watch API/Group/Case/Env/Mock change for handle tab status to fit content
   *
   * ？It is optimal to control Tab closing through a specific event transmission ID, but this event will always be ignored in use
   *
   * @param inArg
   */
  closeTabAfterResourceRemove() {
    const checkTabIsExist = (groups, tab: TabItem) => {
      const isExist = groups.some(group => {
        //TODO check group.id is same as resource id
        if (!tab.params.uuid || tab.params.uuid !== group.id.toString()) return false;

        if (group.type === GroupType.UserCreated && tab.uniqueName === 'project-group') {
          return true;
        }
        if (group.module === GroupModuleType.API && ['api-http-edit', 'api-http-detail', 'api-http-test'].includes(tab.uniqueName)) {
          return true;
        }
        if (group.module === GroupModuleType.Case && tab.uniqueName === 'api-http-case') {
          return true;
        }
        if (group.module === GroupModuleType.Mock && tab.uniqueName === 'api-http-mock') {
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
              tab.params?.uuid && value.every(env => env.id.toString() !== tab.params.uuid) && tab.uniqueName === 'project-env'
          )
          .map(val => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
      }
    );
  }
  batchCloseTabById(uuidList) {
    const result = this.apiTabComponent
      .getTabs()
      .filter(it => uuidList.includes(it.params.uuid))
      .map(it => it.uuid);
    this.apiTabComponent.batchCloseTab(result);
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

        //resourceID
        const modelID: number = model.apiUuid || model.uuid || model.id;

        //1. The currently active tab is not the one that initiated the request
        //2. the request response is not what the current active tab needs
        const modelFromOtherTab = currentTab.uuid !== bindTabID || (modelID && currentTab.params?.uuid !== modelID.toString());
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

    const currentTab = !uuid ? this.apiTabComponent.getCurrentTab() : this.apiTabComponent.getTabByID(uuid);
    if (!this.componentRef?.afterTabActivated) {
      // this.changeContent$.next({ when: 'activated', currentTab });
      pcConsole.error(
        'Child componentRef need has afterTabActivated function for reflesh data when router change,Please add afterTabActivated function in child component'
      );
      return;
    }

    //?Why should use getCurrentTab()?
    //Because maybe current tab  has't  finish init
    if (!currentTab) {
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

    const isTestPage = currentTab.pathname.includes('test');
    const isEmptyPage = !model.uuid;

    if (!isTestPage) {
      if (isEmptyPage) {
        result.title = result.title || this.BASIC_TABS.find(val => val.pathname === currentTab.pathname).title;
      }
      return result;
    }

    //Test page,generate title and method from model.url
    if (currentTab.pathname === '/home/workspace/project/api/ws/test') {
      result.method = 'WS';
    } else {
      result.method = requestMethodMap[model.request.apiAttrInfo?.requestMethod];
    }
    //Only Untitle request need set url to tab title
    const originTitle = this.BASIC_TABS.find(val => val.pathname === currentTab.pathname)?.title;
    const isHistoryPage = currentTab.params.uuid && currentTab.params.uuid.includes('history_');
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
      let currentHasChanged = currentTab.extends?.hasChanged?.[contentID] || false;
      switch (inData.when) {
        case 'editing': {
          // Saved APIs do not need to verify changes
          if (!currentTab.uniqueName.includes('test') || !currentTab.params.uuid || currentTab.params.uuid.includes('history')) {
            //Set hasChange
            if (!this.componentRef?.isFormChange) {
              throw new Error(
                `EO_ERROR:Child componentRef[${this.componentRef.constructor.name}] need has isFormChange function check model change`
              );
            }

            currentHasChanged = this.componentRef.isFormChange();
          } else {
            currentHasChanged = false;
          }
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

      //Set storage
      //Set baseContent
      if (['activated', 'saved'].includes(inData.when)) {
        const initialModel = eoDeepCopy(inData.model);

        //Update tab by id,may not be the current selected tab
        const isCurrentSelectedTab = currentTab.uuid === this.apiTabComponent.getCurrentTab().uuid;
        //If is current tab,set initialModel automatically
        if (isCurrentSelectedTab) {
          this.componentRef.initialModel = initialModel;
        }
        replaceTab.baseContent = inData.when === 'saved' ? {} : currentTab.baseContent || {};
        replaceTab.baseContent[contentID] = initialModel && !isEmptyObj(initialModel) ? initialModel : null;
      }
      //Set content
      replaceTab.content = inData.when === 'saved' ? {} : currentTab.content || {};
      replaceTab.content[contentID] = model && !isEmptyObj(model) ? model : null;
    }

    //Set isFixed
    if (replaceTab.hasChanged) {
      replaceTab.isFixed = true;
    }

    //Has tested/exsix api set fixed
    if (currentTab.pathname.includes('test') && (model.testStartTime !== undefined || currentTab.params.uuid)) {
      replaceTab.isFixed = true;
    }
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
