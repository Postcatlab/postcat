import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Message, MessageService } from '../../shared/services/message';
import { StorageService } from '../../shared/services/storage';
import { Change } from '../../shared/store/env.state';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { ApiTabComponent } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab.component';
import { ApiTabService } from './api-tab.service';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';

const DY_WIDTH_KEY = 'DY_WIDTH';
const LEFT_SIDER_WIDTH_KEY = 'LEFT_SIDER_WIDTH_KEY';

const localSiderWidth = Number.parseInt(localStorage.getItem(LEFT_SIDER_WIDTH_KEY), 10);
@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit, OnDestroy {
  isFirstTime = true;
  siderWidth = Math.max(120, Number.isNaN(localSiderWidth) ? 250 : localSiderWidth);
  contentHeight = 200;
  isDragging = false;
  animateId = -1;
  @ViewChild('apiTabComponent')
  set apiTabComponent(value: ApiTabComponent) {
    // For lifecycle error, use timeout
    this.apiTab.apiTabComponent = value;
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this.apiTab.onAllComponentInit();
    }
  }

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
    public apiTab: ApiTabService,
    private router: Router,
    private messageService: MessageService,
    private storage: StorageService,
    private remoteService: RemoteService,
    private store: Store
  ) {}
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
    this.apiTab.onChildComponentInit(componentRef);
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
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.initTabsetData();
    this.watchRouterChange();
    this.watchDataSourceChange();
    this.initEnv();
    this.watchEnvChange();
    console.log('ngOnInit');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.id = Number(this.route.snapshot.queryParams.uuid);
    });
  }

  onSideResize({ width }: NzResizeEvent): void {
    this.isDragging = true;
    cancelAnimationFrame(this.animateId);
    this.animateId = requestAnimationFrame(() => {
      this.siderWidth = width;
      localStorage.setItem(LEFT_SIDER_WIDTH_KEY, String(width));
    });
  }

  onResizeEnd() {
    this.isDragging = false;
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
    localStorage.setItem(DY_WIDTH_KEY, String(this.dyWidth));
  }
  handleEnvSelectStatus(event: boolean) {}
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
