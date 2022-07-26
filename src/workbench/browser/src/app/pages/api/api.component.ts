import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { Subject, takeUntil } from 'rxjs';
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
  /**
   * API uuid
   */
  id: number;
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
  isOpen = false;
  envInfo: any = {};
  envList: Array<any> = [];
  activeUuid: number | string = 0;
  tabsIndex = 0;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
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
  }
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.watchApiChange();
    this.watchRouterChange();
    this.watchDataSourceChange();
    if (this.remoteService.isElectron) {
      this.TABS.push({
        routerLink: 'mock',
        title: 'Mock',
      });
    }
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
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  watchApiChange() {
    this.messageService.get().subscribe((inArg: Message) => {
      switch (inArg.type) {
        case 'deleteApiSuccess': {
          const closeTabIDs = this.apiTabComponent
            .getTabsInfo()
            .filter((val) => !inArg.data.uuids.includes(val.params.uuid))
            .map((val) => val.uuid);
          console.log(closeTabIDs, this.apiTabComponent.getTabsInfo(), inArg.data.uuids);
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
    this.route.queryParamMap.subscribe((params) => {
      this.id = Number(params.get('uuid'));
    });
  }
  gotoEnvManager() {
    // * switch to env
    this.tabsIndex = 2;
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
}
