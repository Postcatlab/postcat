import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { autorun, reaction, values } from 'mobx';
import { StoreService } from 'pc/browser/src/app/store/state.service';
import { filter, Subject } from 'rxjs';

import { ApiEffectService } from '../../store/api-effect.service';
import { ApiStoreService } from '../../store/api-state.service';
@Component({
  selector: 'eo-env-list',
  templateUrl: './env-list.component.html',
  styleUrls: ['./env-list.component.scss']
})
export class EnvListComponent implements OnDestroy {
  // @ViewChild('table') table: EoTableComponent; // * child component ref
  modalTitle = $localize`:@@New Environment:New Environment`;
  nzTreeSelect = [];
  envList = [];
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public store: ApiStoreService,
    private globalStore: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private effect: ApiEffectService
  ) {
    autorun(() => {
      if (this.store.getEnvList) {
        this.envList = (this.store.getEnvList || []).map(n => ({ ...n, title: n.name, key: n.id }));
        this.setSelectKeys();
      }
    });
    this.setSelectKeys();
    reaction(
      () => this.globalStore.getUrl,
      url => {
        this.setSelectKeys();
      }
    );
  }
  setSelectKeys() {
    const uuid = this.route.snapshot.queryParams.uuid;
    const id =
      this.router.url.includes('home/workspace/project/api/env/edit') && uuid ? Number(this.route.snapshot.queryParams.uuid) : null;
    this.nzTreeSelect = [id];
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDeleteEnv($event, id: string) {
    $event?.stopPropagation();
    // * delete localstrage
    this.effect.deleteEnv(id);
  }
  editEnv($event) {
    this.router.navigate(['/home/workspace/project/api/env/edit'], {
      queryParams: { uuid: $event.node.key }
    });
  }
  addEnv(pid = 1) {
    this.router.navigate(['/home/workspace/project/api/env/edit'], {
      queryParams: { pageID: Date.now() }
    });
  }
}
