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
  isOpen = false;
  activeBar = false;
  envInfo: any = {};
  envList: Array<any> = [];
  activeUuid: number | string = 0;
  dyWidth = 250;
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

  get envUuid(): number {
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
  onActivate(componentRef) {
    console.log(componentRef);
    //Router-outlet bind childComponent output fun by (activate)
    //https://stackoverflow.com/questions/37662456/angular-2-output-from-router-outlet
    componentRef.modelChange ={
      emit: this.watchContentChange
    };
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
    this.envUuid = Number(localStorage.getItem('env:selected'));
    // * load All env
    this.getAllEnv().then((result: any[]) => {
      this.envList = result || [];
    });
    this.messageService.get().subscribe(({ type }) => {
      if (type === 'updateEnv') {
        this.getAllEnv().then((result: any[]) => {
          this.envList = result || [];
        });
      }
    });
    this.messageService.get().subscribe(({ type, data }) => {
      if (type === 'toggleEnv') {
        this.activeBar = data;
      }
    });
    this.messageService.get().subscribe(({ type, data }) => {
      if (type === 'deleteEnv') {
        const list = this.envList.filter((it) => it.uuid !== Number(data));
        this.envList = list;
        if (this.envUuid === Number(data)) {
          this.envUuid = null;
        }
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  watchContentChange() {
    console.log('watchContentChange');
  }
  watchApiChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      switch (inArg.type) {
        case 'deleteApiSuccess': {
          const closeTabIDs = this.apiTabComponent
            .getTabsInfo()
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
      console.log('routerChange');
      this.id = Number(this.route.snapshot.queryParams.uuid);
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
    this.dyWidth = 250;
    if (status == null) {
      this.activeBar = !this.activeBar;
      return;
    }
    this.activeBar = status;
  }
  changeModule($event) {
    console.log($event);
  }
  getAllEnv(uuid?: number) {
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
  handleEnvSelectStatus(event: boolean) {}
  handleDrag(e) {
    const distance = e;
    this.dyWidth = distance;
  }
}
