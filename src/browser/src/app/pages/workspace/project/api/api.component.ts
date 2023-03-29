import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { EoTabComponent } from 'pc/browser/src/app/components/eo-ui/tab/tab.component';
import { WebService } from 'pc/browser/src/app/core/services';
import { BASIC_TABS_INFO, TabsConfig } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ExtensionService } from 'pc/browser/src/app/services/extensions/extension.service';
import { TraceService } from 'pc/browser/src/app/services/trace.service';
import { API_PREVIEW_TAB } from 'pc/browser/src/app/shared/constans/featureName';
import { ExtensionChange } from 'pc/browser/src/app/shared/decorators';
import { StoreService } from 'pc/browser/src/app/shared/store/state.service';
import { filter, Subject, takeUntil } from 'rxjs';

import { SidebarService } from '../../../../layouts/sidebar/sidebar.service';
import StorageUtil from '../../../../shared/utils/storage/storage.utils';
import { ApiTabService, PageUniqueName } from './api-tab.service';

const RIGHT_SIDER_WIDTH_KEY = 'RIGHT_SIDER_WIDTH';
const LEFT_SIDER_WIDTH_KEY = 'LEFT_SIDER_WIDTH_KEY';
const DEFAULT_RIGHT_SIDER_WIDTH = 250;

@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit, OnDestroy {
  isFirstTime = true;
  private localSiderWidth = Number.parseInt(localStorage.getItem(LEFT_SIDER_WIDTH_KEY), 10);
  siderWidth = Math.max(120, Number.isNaN(this.localSiderWidth) ? 250 : this.localSiderWidth);
  RIGHT_SIDER_SHRINK_WIDTH = 50;
  isDragging = false;
  animateId = -1;
  animationId: number;
  rightExtras = [];
  showChildBar = false;
  @ViewChild('apiTabComponent')
  set apiTabComponent(value: EoTabComponent) {
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
      //ID fit to the routerLink
      id: PageUniqueName.HttpDetail,
      title: $localize`:@@API Detail:Preview`
    },
    {
      routerLink: 'edit',
      id: PageUniqueName.HttpEdit,
      title: $localize`Edit`
    },
    {
      routerLink: 'test',
      isShare: true,
      id: PageUniqueName.HttpTest,
      title: $localize`Test`
    }
  ];
  rightSiderWidth = this.getLocalRightSiderWidth();

  tabsIndex = StorageUtil.get('eo_group_tab_select') || 0;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public apiTab: ApiTabService,
    public sidebar: SidebarService,
    private router: Router,
    public web: WebService,
    private extensionService: ExtensionService,
    public store: StoreService,
    private trace: TraceService,
    @Inject(BASIC_TABS_INFO) public tabsConfig: TabsConfig
  ) {
    this.initExtensionExtra();
  }
  @ExtensionChange(API_PREVIEW_TAB, true)
  async initExtensionExtra() {
    this.rightExtras = [];
    if (!this.router.url.includes(this.tabsConfig.pathByName[PageUniqueName.HttpDetail])) return;
    const apiPreviewTab = this.extensionService.getValidExtensionsByFature(API_PREVIEW_TAB);
    apiPreviewTab?.forEach(async (value, key) => {
      const module = await this.extensionService.getExtensionPackage(key);
      const rightExtra = value.rightExtra?.reduce((prev, curr) => {
        const eventObj = curr.events?.reduce((event, currEvent) => {
          event[currEvent.name] = (...rest) => {
            module?.[currEvent.handler]?.(...rest);
          };
          return event;
        }, {});
        prev.push({
          ...curr,
          ...eventObj
        });
        return prev;
      }, []);
      this.rightExtras.push(...rightExtra);
    });
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
  initChildBarShowStatus() {
    const pathArr = [
      this.tabsConfig.pathByName[PageUniqueName.HttpDetail],
      this.tabsConfig.pathByName[PageUniqueName.HttpEdit],
      this.tabsConfig.pathByName[PageUniqueName.HttpTest]
    ];
    const isApiPage = pathArr.some(path => this.router.url.includes(path));
    const isTestHistoryPage = this.route.snapshot.queryParams.uuid?.includes('history_');
    this.showChildBar = this.route.snapshot.queryParams.uuid && !isTestHistoryPage && isApiPage;
  }
  onGroupTabSelectChange($event) {
    StorageUtil.set('eo_group_tab_select', this.tabsIndex);
  }
  ngOnInit(): void {
    this.initChildBarShowStatus();
    this.watchRouterChange();
    this.renderTabs = this.store.isShare ? this.TABS.filter(it => it.isShare) : this.TABS;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Get current API ID to show content tab
   */
  watchRouterChange() {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.initChildBarShowStatus();
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
      this.rightSiderWidth = width;
      localStorage.setItem(RIGHT_SIDER_WIDTH_KEY, String(width));
    });
  }

  onResizeEnd() {
    this.isDragging = false;
    this.trace.report('drag_group_sider_width', { group_sider_width: this.siderWidth });
  }
  toggleRightBar(operate: 'open' | 'close') {
    if (operate === 'open') {
      let dyWitdth = this.getLocalRightSiderWidth();
      if (dyWitdth === this.RIGHT_SIDER_SHRINK_WIDTH) {
        dyWitdth = DEFAULT_RIGHT_SIDER_WIDTH;
      }
      this.rightSiderWidth = dyWitdth;
    } else {
      this.rightSiderWidth = this.RIGHT_SIDER_SHRINK_WIDTH;
    }
    localStorage.setItem(RIGHT_SIDER_WIDTH_KEY, this.rightSiderWidth.toString());
  }
  getLocalRightSiderWidth() {
    return localStorage.getItem(RIGHT_SIDER_WIDTH_KEY)
      ? Number(localStorage.getItem(RIGHT_SIDER_WIDTH_KEY))
      : this.RIGHT_SIDER_SHRINK_WIDTH;
  }
}
