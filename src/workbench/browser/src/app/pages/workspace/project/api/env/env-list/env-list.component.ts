import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { filter, Subject } from 'rxjs';

import { MessageService } from '../../../../../../shared/services/message';
@Component({
  selector: 'eo-env-list',
  templateUrl: './env-list.component.html',
  styleUrls: ['./env-list.component.scss']
})
export class EnvListComponent implements OnDestroy {
  // @ViewChild('table') table: EoTableComponent; // * child component ref
  modalTitle = $localize`:@@New Environment:New Environment`;
  id;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private effect: EffectService,
    private message: MessageService
  ) {
    this.getIDFromRoute();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.getIDFromRoute();
    });
  }
  getIDFromRoute() {
    const uuid = this.route.snapshot.queryParams.uuid;
    this.id = this.router.url.includes('home/workspace/project/api/env/edit') && uuid ? Number(this.route.snapshot.queryParams.uuid) : null;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDeleteEnv($event, uuid: string) {
    $event?.stopPropagation();
    // * delete localstrage
    this.effect.deleteEnv(uuid);
    this.message.send({
      type: 'deleteEnvSuccess',
      data: {
        uuids: [uuid]
      }
    });
  }
  editEnv(item) {
    this.router.navigate(['/home/workspace/project/api/env/edit'], {
      queryParams: { uuid: item.uuid }
    });
  }
  addEnv(pid = 1) {
    this.router.navigate(['/home/workspace/project/api/env/edit']);
  }
}
