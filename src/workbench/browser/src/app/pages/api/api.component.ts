import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { EoTabComponent } from 'eo/workbench/browser/src/app/modules/eo-ui/tab/tab.component';
import { ApiTabService } from './api-tab.service';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { computed, makeObservable, observable, reaction } from 'mobx';

const RIGHT_SIDER_WIDTH_KEY = 'RIGHT_SIDER_WIDTH';
const LEFT_SIDER_WIDTH_KEY = 'LEFT_SIDER_WIDTH_KEY';
const DEFAULT_RIGHT_SIDER_WIDTH = 250;

const localSiderWidth = Number.parseInt(localStorage.getItem(LEFT_SIDER_WIDTH_KEY), 10);
@Component({
  selector: 'eo-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit, OnDestroy {
  @observable envUuid = '';
  isFirstTime = true;
  siderWidth = Math.max(120, Number.isNaN(localSiderWidth) ? 250 : localSiderWidth);
  RIGHT_SIDER_SHRINK_WIDTH = 50;
  isDragging = false;
  animateId = -1;
  animationId: number;
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

  isOpen = false;
  rightSiderWidth = this.getLocalRightSiderWidth();

  tabsIndex = 0;
  private destroy$: Subject<void> = new Subject<void>();

  @computed get renderEnvList() {
    return this.store.getEnvList.map((it) => ({ label: it.name, value: it.uuid }));
  }

  constructor(
    private route: ActivatedRoute,
    public apiTab: ApiTabService,
    private router: Router,
    public web: WebService,
    public store: StoreService,
    private effect: EffectService
  ) {}

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
    makeObservable(this);
    this.id = Number(this.route.snapshot.queryParams.uuid);
    this.effect.updateEnvList();
    this.watchRouterChange();
    this.renderTabs = this.store.isShare ? this.TABS.filter((it) => it.isShare) : this.TABS;
    this.envUuid = this.store.getEnvUuid;
    reaction(
      () => this.envUuid,
      (data) => {
        this.store.setEnvUuid(data);
      }
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  goDownload($event) {
    $event.stopPropagation();
    this.web.jumpToClient($localize`Eoapi Client is required to use Mock.`);
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
      this.rightSiderWidth = width;
      localStorage.setItem(RIGHT_SIDER_WIDTH_KEY, String(width));
    });
  }

  onResizeEnd() {
    this.isDragging = false;
  }

  gotoEnvManager() {
    // * switch to env
    // this.store.toggleRightBar(true);
    this.toggleRightBar('open');

    // * close select
    this.isOpen = false;
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
  handleEnvSelectStatus(event: boolean) {}
}
