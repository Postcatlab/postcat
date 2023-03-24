import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { autorun } from 'mobx';
import { EditTabViewComponent, PreviewTabViewComponent, TabItem } from 'pc/browser/src/app/components/eo-ui/tab/tab.model';
import { requestMethodMap } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { Message } from 'pc/browser/src/app/services/message';
import { StoreService } from 'pc/browser/src/app/store/state.service';
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
      id: 'share-api-test',
      type: 'edit',
      title: $localize`New Request`,
      extends: { method: 'POST' }
    },
    { pathname: '/share/http/detail', id: 'share-api-detail', type: 'preview', title: $localize`Preview` },
    { pathname: '/share/group/edit', id: 'share-group-edit', type: 'preview', title: $localize`Preview` },
    {
      pathname: '/share/ws/test',
      id: 'share-api-test',
      isFixed: true,
      type: 'preview',
      extends: { method: 'WS' },
      title: $localize`New Websocket`
    }
  ];
  API_TABS: Array<Partial<TabItem>> = [
    {
      pathname: '/home/workspace/project/api/http/test',
      id: 'api-http-test',
      type: 'edit',
      title: $localize`New Request`,
      extends: { method: 'POST' }
    },
    {
      pathname: '/home/workspace/project/api/env/edit',
      id: 'project-env',
      type: 'edit',
      icon: 'application',
      title: $localize`New Environment`
    },
    {
      pathname: '/home/workspace/project/api/group/edit',
      id: 'project-group',
      type: 'edit',
      icon: 'folder-close',
      title: $localize`:@@AddGroup:New Group`
    },
    { pathname: '/home/workspace/project/api/http/edit', id: 'api-http-edit', isFixed: true, type: 'edit', title: $localize`New API` },
    { pathname: '/home/workspace/project/api/http/detail', id: 'api-http-detail', type: 'preview', title: $localize`Preview` },
    {
      pathname: '/home/workspace/project/api/ws/test',
      id: 'api-ws-test',
      isFixed: true,
      type: 'edit',
      extends: { method: 'WS' },
      title: $localize`New Websocket`
    },
    { pathname: '/home/workspace/project/api/http/mock', id: 'api-http-mock', type: 'edit', title: 'Mock', isFixed: true }
  ];
  BASIC_TABS: Array<Partial<TabItem>>;
  constructor(private messageService: MessageService, private router: Router, private store: StoreService) {
    this.changeContent$.pipe(debounceTime(150)).subscribe(inData => {
      this.afterContentChanged(inData);
    });
    this.messageService.get().subscribe((inArg: Message) => {
      this.watchAPIChange(inArg);
    });
    autorun(() => {
      this.BASIC_TABS = this.store.isShare ? this.SHARE_TABS : this.API_TABS;
    });
  }
  /**
   * Watch API change for handle tab status to fit content
   *
   * @param inArg
   */
  watchAPIChange(inArg: Message) {
    switch (inArg.type) {
      case 'deleteApiSuccess': {
        //Close those tab who has been deleted
        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter((val: TabItem) => val.pathname.includes('home/workspace/project/api/http') && inArg.data.uuids.includes(val.params.uuid))
          .map(val => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
        break;
      }
      case 'deleteEnvSuccess': {
        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter(
            (val: TabItem) =>
              val.pathname.includes('home/workspace/project/api/env/edit') && inArg.data.uuids.includes(Number(val.params.uuid))
          )
          .map(val => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
        break;
      }
      case 'deleteGroupSuccess': {
        const closeTabIDs = this.apiTabComponent
          .getTabs()
          .filter(
            (val: TabItem) =>
              val.pathname.includes('home/workspace/project/api/group/edit') && inArg.data.uuids.includes(Number(val.params.uuid))
          )
          .map(val => val.uuid);
        this.apiTabComponent.batchCloseTab(closeTabIDs);
        break;
      }
      case 'tabContentInit': {
        this.updateChildView(inArg.data.uuid);
        break;
      }
    }
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
    this.updateChildView();
  }
  private bindChildComponentChangeEvent() {
    if (!this.componentRef) {
      return;
    }
    const currentTabID = this.apiTabComponent.getCurrentTab()?.uuid;
    this.componentRef.eoOnInit = {
      emit: model => {
        //! The previous Tab's(bindTab) request may overwrite the current Tab's(currentTab) data.
        //* When inconsistent, we need to manually reset the model
        const currentTab = this.apiTabComponent.getCurrentTab();
        if (currentTab.uuid !== currentTabID) {
          //Reset currentTab view
          pcConsole.warn('Tab will be recory from origin data prevent overwrited by previous tab');
          this.updateChildView(currentTab.uuid);
        }
        this.afterContentChanged({ when: 'activated', currentTabID, model });
      }
    };

    //Edit page has save/editing event
    if (this.currentComponentTab.type === 'edit') {
      this.componentRef.afterSaved = {
        emit: model => {
          this.afterContentChanged({ when: 'saved', currentTabID, model });
        }
      };
      this.componentRef.modelChange = {
        emit: model => {
          this.changeContent$.next({ when: 'editing', currentTabID, model });
        }
      };
    }

    //Test page has tested event
    if (this.currentComponentTab.pathname.includes('test')) {
      this.componentRef.afterTested = {
        emit: model => {
          this.afterContentChanged({ when: 'afterTested', currentTabID, model });
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
  /**
   * Reflesh data after Tab activated
   *
   * @param lastRouter
   * @param currentRouter
   * @returns
   */
  updateChildView(uuid?) {
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
    const contentID = currentTab.id;
    //Get tab from cache
    const hasCache = currentTab?.content?.[contentID];
    this.componentRef.model = currentTab?.content?.[contentID] || null;
    this.componentRef.initialModel = currentTab?.baseContent?.[contentID] || null;

    this.componentRef.afterTabActivated();
  }

  updateTab(currentTab, inData: TabEvent) {
    const model = inData.model;
    if (!model || isEmptyObj(model)) return;

    const contentID = currentTab.id;
    //Set tabItem
    const replaceTab: Partial<TabItem> = {
      hasChanged: currentTab.hasChanged,
      isLoading: false,
      extends: {}
    };
    //* Set title/method
    replaceTab.title = model.name;
    replaceTab.extends.method = requestMethodMap[model.apiAttrInfo?.requestMethod];
    if (currentTab.pathname.includes('test')) {
      if (currentTab.pathname === '/home/workspace/project/api/ws/test') {
        replaceTab.extends.method = 'WS';
      } else {
        replaceTab.extends.method = requestMethodMap[model.request.apiAttrInfo?.requestMethod];
      }
      //Only Untitle request need set url to tab title
      const originTitle = this.BASIC_TABS.find(val => val.pathname === currentTab.pathname)?.title;
      if (!model.request.uuid || (currentTab.params.uuid && currentTab.params.uuid.includes('history_'))) {
        replaceTab.title = model.request.uri || originTitle;
      } else {
        replaceTab.title = model.request.name || originTitle;
      }
    } else if (!model.uuid) {
      replaceTab.title = replaceTab.title || this.BASIC_TABS.find(val => val.pathname === currentTab.pathname).title;
    }

    //* Set Edit page,such  as  tab title,storage data,check isFormChanges
    if (currentTab.type === 'edit') {
      let currentHasChanged = currentTab.extends?.hasChanged?.[contentID] || false;
      switch (inData.when) {
        case 'editing': {
          // Saved APIs do not need to verify changes
          if (currentTab.module !== 'test' || !currentTab.params.uuid || currentTab.params.uuid.includes('history')) {
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
        const otherEditableTabs = this.BASIC_TABS.filter(val => val.type === 'edit' && val.id !== contentID);
        currentHasChanged = otherEditableTabs.some(tabItem => currentTab.extends?.hasChanged[tabItem.id]);
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
  afterContentChanged(inData: TabEvent) {
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
  handleDataBeforeGetCache = tabsInfo => {
    if (!tabsInfo?.tabOrder?.[0]) return null;
    const tab = tabsInfo.tabsByID[tabsInfo.tabOrder[0]];
    if (!tab) return null;
    const { wid, pid } = tab.params;
    if (wid !== this.store.getCurrentWorkspaceUuid || pid !== this.store.getCurrentProjectID) return null;
    return tabsInfo;
  };
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
