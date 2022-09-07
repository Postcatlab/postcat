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
  get currentComponentTab(): Partial<TabItem> {
    return this.BASIC_TABS.find((val) => this.router.url.includes(val.pathname));
  }
  private changeContent$: Subject<any> = new Subject();
  BASIC_TABS: Partial<TabItem>[] = [
    {
      pathname: '/home/api/http/test',
      module: 'test',
      type: 'edit',
      title: $localize`New Request`,
      extends: { method: 'POST' },
    },
    { pathname: '/home/api/http/edit', module: 'edit', isFixed: true, type: 'edit', title: $localize`New API` },
    { pathname: '/home/api/http/detail', module: 'detail', type: 'preview', title: $localize`Preview` },
    {
      pathname: '/home/api/overview',
      type: 'preview',
      module: 'overview',
      title: $localize`:@@API Index:Index`,
      icon: 'home',
    },
    { pathname: '/home/api/ws/test', module: 'test', type: 'edit', title: $localize`New Websocket` },
    { pathname: '/home/api/http/mock', module: 'mock', type: 'preview', title: 'Mock' },
  ];
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
    this.updateChildView(url);
  }
  private bindChildComponentChangeEvent() {
    if (!this.componentRef) {
      return;
    }
    const url = this.router.url;
    this.componentRef.eoOnInit = {
      emit: (model) => {
        this.afterContentChanged({ when: 'init', url, model });
      },
    };
    if (this.currentComponentTab.type === 'edit') {
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
    if (this.currentComponentTab.module === 'test') {
      this.componentRef.afterTested = {
        emit: (model) => {
          this.afterContentChanged({ when: 'afterTested', url, model });
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

    if (!this.componentRef.init) {
      this.changeContent$.next({ when: 'init', url });
      console.warn('EO_ERROR:Child componentRef need has init function for reflesh data when router change');
      return;
    }
    //?Why should use getCurrentTab()?
    //Because maybe current tab  has't  finish init
    const currentTab = this.apiTabComponent.getExistTabByUrl(url);
    if (!currentTab) {
      return;
    }
    const contentID = currentTab.module;
    //Get tab cache
    this.componentRef.model = currentTab?.content?.[contentID] || null;
    this.componentRef.initialModel = currentTab?.baseContent?.[contentID] || null;
    this.componentRef.init();
  }
  updateTab(currentTab, inData) {
    const model = inData.model;
    const contentID = currentTab.module;

    //Set tabItem
    const replaceTab: Partial<TabItem> = {
      hasChanged: currentTab.hasChanged,
      isLoading: false,
      extends: {
        module: contentID,
      },
    };
    if (model && !isEmptyObj(model)) {
      //Set title/method
      replaceTab.title = model.name;
      replaceTab.extends.method = model.method;
      if (currentTab.module==='test') {
        replaceTab.extends.method = model.request.method;
        //Only Untitle request need set url to tab title
        if (!model.request.uuid || (currentTab.params.uuid && currentTab.params.uuid.includes('history_'))) {
          replaceTab.title = model.request.uri || this.BASIC_TABS[0].title;
        } else {
          replaceTab.title = model.request.name || this.BASIC_TABS[0].title;
        }
      } else if (!model.uuid) {
        replaceTab.title =
          replaceTab.title || this.BASIC_TABS.find((val) => val.pathname === currentTab.pathname).title;
      }
      //Only hasChanged edit page storage data
      if (currentTab.type === 'edit') {
        //Set hasChange
        if (!this.componentRef?.isFormChange) {
          throw new Error(
            `EO_ERROR:Child componentRef[${this.componentRef.constructor.name}] need has isFormChange function check model change`
          );
        }
        let currentHasChanged = currentTab.hasChanged;
        switch (inData.when) {
          case 'editing': {
            // Saved APIs do not need to verify changes
            if (
              currentTab.pathname !== '/home/api/http/test' ||
              !currentTab.params.uuid ||
              currentTab.params.uuid.includes('history')
            ) {
              currentHasChanged = this.componentRef.isFormChange();
            } else {
              currentHasChanged = false;
            }
            break;
          }
          case 'saved': {
            currentHasChanged = false;
          }
        }
        //* Share change status within all content page
        replaceTab.extends.hasChanged = currentTab.extends?.hasChanged || {};
        replaceTab.extends.hasChanged[contentID] = currentHasChanged;
        // Editiable tab  share hasChanged data
        if (!currentHasChanged && currentTab.extends?.hasChanged) {
          const otherEditableTabs = this.BASIC_TABS.filter((val) => val.type === 'edit' && val.module !== contentID);
          currentHasChanged = otherEditableTabs.some((tabItem) => currentTab.extends?.hasChanged[tabItem.module]);
        }
        replaceTab.hasChanged = currentHasChanged;
        // Set storage
        //Set baseContent
        if (['init', 'saved'].includes(inData.when)) {
          const initialModel = this.componentRef.initialModel;
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
      if (
        currentTab.pathname === '/home/api/http/test' &&
        (model.testStartTime !== undefined || currentTab.params.uuid)
      ) {
        replaceTab.isFixed = true;
      }
    }
    this.apiTabComponent.updatePartialTab(inData.url, replaceTab);
  }
  /**
   * After content changed
   * Update tab by model data
   *
   * @param inData.url get component fit tab data
   */
  afterContentChanged(inData: { when: 'init' | 'editing' | 'saved' | 'afterTested'; url: string; model: any }) {
    console.log(inData);
    if (!this.apiTabComponent) {
      console.warn(`EO_WARNING:apiTabComponent hasn't init yet!`);
      return;
    }
    let currentTab = this.apiTabComponent.getExistTabByUrl(inData.url);
    if (!currentTab) {
      console.warn(`has't find the tab fit child component ,url:${inData.url}`);
      return;
    }
    if (inData?.when === 'afterTested') {
      //Update other tab test result
      inData.url = `${inData.model.url}?pageID=${inData.model.id}`;
      currentTab = this.apiTabComponent.getExistTabByUrl(inData.url);
      inData.model = Object.assign({}, currentTab.content.test, inData.model.model);
    }
    this.updateTab(currentTab, inData);
  }
  handleDataBeforeCache(tabsByID) {
    Object.values(tabsByID).forEach((val: TabItem) => {
      if (val.pathname === '/home/api/http/test' && val.content?.test?.testResult) {
        val.content.test.testResult = {
          request: {},
          response: {},
        };
      }
    });
    return tabsByID;
  }
}
