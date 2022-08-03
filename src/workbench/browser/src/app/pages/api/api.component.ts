import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { filter, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Message, MessageService } from '../../shared/services/message';
import { StorageService } from '../../shared/services/storage';
import { Change } from '../../shared/store/env.state';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { ApiTabComponent } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab.component';
import { timeStamp } from 'console';

const DY_WIDTH_KEY = 'DY_WIDTH';

@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit, OnDestroy {
  @ViewChild('apiTabComponent') apiTabComponent: ApiTabComponent;
  tabsetIndex: number;
  /**
   * API uuid
   */
  id: number;
  pageID: number;
  componentRef;
  TABS = [
    {
      routerLink: 'detail',
      title: $localize`:@@API Detail:Preview`,
    },
    {
      routerLink: 'edit',
      title: $localize`Edit`,
    },
    {
      routerLink: 'test',
      title: $localize`Test`,
    },
  ];
  tagsTemplate = {
    test: { pathname: '/home/api/test', type: 'edit', title: $localize`New API` },
    edit: { pathname: '/home/api/edit', type: 'edit', title: $localize`New API` },
    detail: { pathname: '/home/api/detail', type: 'preview', title: $localize`:@@API Detail:Preview` },
    overview: { pathname: '/home/api/overview', type: 'preview', title: $localize`:@@API Index:Index` },
    mock: { pathname: '/home/api/mock', type: 'preview', title: 'Mock' },
  };
  activeUuid: number | string | null = 0;
  envInfo: any = {};
  envList: Array<any> = [];

  isOpen = false;
  activeBar = false;
  dyWidth = localStorage.getItem(DY_WIDTH_KEY) ? Number(localStorage.getItem(DY_WIDTH_KEY)) : 250;

  tabsIndex = 0;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private storage: StorageService,
    private remoteService: RemoteService,
    private store: Store
  ) {}
  // Set current tab type:'preview'|'edit' for  later judgment
  get currentTabType(): string {
    return Object.values(this.tagsTemplate).find((val) => val.pathname === window.location.pathname)?.type || 'preview';
  }
  get envUuid(): number | null {
    return Number(localStorage.getItem('env:selected')) || 0;
  }
  set envUuid(value) {
    this.activeUuid = value;
    if (value !== null) {
      localStorage.setItem('env:selected', value == null ? '' : value.toString());
    } else {
      localStorage.removeItem('env:selected');
    }
    this.changeStoreEnv(value);
  }
  /**
   * Router-outlet child componnet change
   * Router-outlet bind childComponent output fun by (activate)
   * https://stackoverflow.com/questions/37662456/angular-2-output-from-router-outlet
   *
   * @param componentRef
   */
  onActivate(componentRef) {
    console.log('onActivate', componentRef);
    componentRef.modelChange = {
      that: this,
      emit: this.watchContentChange,
    };
    if (this.currentTabType === 'edit') {
      componentRef.afterSaved = {
        that: this,
        emit: this.watchContentChange,
      };
    }
    this.componentRef = componentRef;
  }
  initTabsetData() {
    //Only electeron has local Mock
    if (this.remoteService.isElectron) {
      this.TABS.push({
        routerLink: 'mock',
        title: 'Mock',
      });
    }
  }
  ngOnInit(): void {
    this.setPageID();
    this.setTabsetIndex();
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.initTabsetData();
    this.watchApiChange();
    this.watchRouterChange();
    this.watchDataSourceChange();
    this.initEnv();
    this.watchEnvChange();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Watch router content page change
   * !Current scope {this} has change to Object:{emit,that}
   */
  watchContentChange = function() {
    const that = this.that;
    // console.log('watchContentChange', that.componentRef.isFormChange() );
    that.apiTabComponent.updateTab({
      title: that.componentRef.apiData.name,
      extends: {
        method: that.componentRef.apiData.method,
      },
      hasChanged: that.componentRef.isFormChange(),
    });
  };
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
  watchApiChange() {
    this.messageService.get().subscribe((inArg: Message) => {
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
    });
  }
  watchDataSourceChange(): void {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'switchDataSource':
            this.storage.toggleDataSource(inArg.data);
            break;
        }
      });
  }

  /**
   * Get current API ID to show content tab
   */
  watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.id = Number(this.route.snapshot.queryParams.uuid);
      if (this.componentRef?.init) {
        this.componentRef.init('reset');
      } else {
        throw new Error('EO_ERROR:Child componentRef need has init function for reflesh data when router change');
      }
      this.setPageID();
      this.setTabsetIndex();
    });
  }
  gotoEnvManager() {
    // * switch to env
    this.messageService.send({ type: 'toggleEnv', data: true });
    // * close select
    this.isOpen = false;
  }
  toggleRightBar(status = null) {
    if (status == null) {
      this.activeBar = !this.activeBar;
      return;
    }
    this.activeBar = status;
  }

  handleDrag(e) {
    const distance = e;
    this.dyWidth = distance;
  }
  handleEnvSelectStatus(event: boolean) {}
  private setPageID() {
    this.pageID = Date.now();
  }
  private setTabsetIndex() {
    this.tabsetIndex = this.TABS.findIndex((val) => window.location.pathname.includes(val.routerLink));
  }
  private changeStoreEnv(uuid) {
    if (uuid == null) {
      this.store.dispatch(new Change(null));
      return;
    }
    this.storage.run('environmentLoadAllByProjectID', [1], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        const data = result.data.find((val) => val.uuid === Number(uuid));
        this.store.dispatch(new Change(data));
      }
    });
  }
  private initEnv() {
    this.envUuid = Number(localStorage.getItem('env:selected'));
    // * load All env
    this.getAllEnv().then((result: any[]) => {
      this.envList = result || [];
    });
  }
  private watchEnvChange() {
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ type, data }) => {
        switch (type) {
          case 'updateEnv': {
            this.getAllEnv().then((result: any[]) => {
              this.envList = result || [];
            });
            break;
          }
          case 'toggleEnv': {
            this.activeBar = data;
            break;
          }
          case 'deleteEnv': {
            const list = this.envList.filter((it) => it.uuid !== Number(data));
            this.envList = list;
            if (this.envUuid === Number(data)) {
              this.envUuid = null;
            }
            break;
          }
        }
      });
  }
  private getAllEnv(uuid?: number) {
    const projectID = 1;
    return new Promise((resolve) => {
      this.storage.run('environmentLoadAllByProjectID', [projectID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data || []);
        }
        return resolve([]);
      });
    });
  }
}
