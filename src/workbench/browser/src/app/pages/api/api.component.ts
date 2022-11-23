import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { filter, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Message, MessageService } from '../../shared/services/message';
import { StorageService } from '../../shared/services/storage';
import { Change } from '../../shared/store/env.state';
import { ApiTabComponent } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab.component';
import { ApiTabService } from './api-tab.service';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { ShareService } from 'eo/workbench/browser/src/app/pages/share-project/share.service';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

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
  RIGHT_BAR_WIDTH = 50;
  isDragging = false;
  animateId = -1;
  animationId: number;
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
  renderTabs = [];
  TABS = [
    {
      routerLink: 'detail',
      isShare: true,
      title: $localize`:@@API Detail:Preview`,
    },
    {
      routerLink: 'edit',
      title: $localize`Edit`,
    },
    {
      routerLink: 'test',
      isShare: true,
      title: $localize`Test`,
    },
    {
      routerLink: 'mock',
      title: 'Mock',
      onlyDestop: true,
    },
  ];
  activeUuid: number | string | null = 0;
  envInfo: any = {};
  envList: NzSelectOptionInterface[] = [];

  isOpen = false;
  activeBar = false;
  dyWidth = this.getLocalDyWidth();

  tabsIndex = 0;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public apiTab: ApiTabService,
    private router: Router,
    private messageService: MessageService,
    private storage: StorageService,
    public web: WebService,
    private store: Store,
    public status: StatusService,
    private http: RemoteService,
    private share: ShareService
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
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.watchRouterChange();
    this.watchDataSourceChange();
    this.initEnv();
    this.watchEnvChange();
    this.renderTabs = this.status.isShare ? this.TABS.filter((it) => it.isShare) : this.TABS;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  goDownload($event) {
    $event.stopPropagation();
    this.web.jumpToClient($localize`Eoapi Client is required to use Mock.`);
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
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
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

  onRightPanelResize({ width }: NzResizeEvent): void {
    cancelAnimationFrame(this.animationId);
    this.animationId = requestAnimationFrame(() => {
      this.dyWidth = width;
      localStorage.setItem(DY_WIDTH_KEY, String(width));
    });
  }

  countPaddingRight() {
    if (this.status.isShare) {
      return '0px';
    }
    return this.activeBar ? this.dyWidth + 'px' : '40px';
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
  toggleRightBar(operate: 'open' | 'close') {
    if (operate === 'open') {
      this.dyWidth = this.getLocalDyWidth();
    } else {
      this.dyWidth = this.RIGHT_BAR_WIDTH;
    }
  }
  getLocalDyWidth() {
    return localStorage.getItem(DY_WIDTH_KEY) ? Number(localStorage.getItem(DY_WIDTH_KEY)) : 250;
  }
  handleEnvSelectStatus(event: boolean) {}
  private async changeStoreEnv(uuid) {
    if (uuid == null) {
      this.store.dispatch(new Change(null));
      return;
    }
    if (this.status.isShare) {
      const [data, err]: any = await this.http.api_shareDocGetEnv({
        uniqueID: this.share.shareId,
      });
      if (err) {
        return;
      }
      const result = data.find((val) => val.uuid === Number(uuid));
      return this.store.dispatch(new Change(result));
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
            const list = this.envList.filter((it) => it.value !== Number(data));
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
    return new Promise(async (resolve) => {
      if (this.status.isShare) {
        const [data, err]: any = await this.http.api_shareDocGetEnv({
          uniqueID: this.share.shareId,
        });
        if (err) {
          return resolve([]);
        }
        const result = (data || []).map((item) => ({ label: item.name, value: item.uuid }));
        return resolve(result);
      }
      this.storage.run('environmentLoadAllByProjectID', [projectID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          const data = (result.data || []).map((item) => ({ label: item.name, value: item.uuid }));
          return resolve(data);
        }
        return resolve([]);
      });
    });
  }
}
