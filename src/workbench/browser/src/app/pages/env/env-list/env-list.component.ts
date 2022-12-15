import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'eo-env-list',
  templateUrl: './env-list.component.html',
  styleUrls: ['./env-list.component.scss']
})
export class EnvListComponent implements OnDestroy {
  // @ViewChild('table') table: EoTableComponent; // * child component ref
  @Output() private readonly statusChange: EventEmitter<any> = new EventEmitter();
  modalTitle = $localize`:@@New Environment:New Environment`;

  private destroy$: Subject<void> = new Subject<void>();
  constructor(public store: StoreService, private router: Router, private effect: EffectService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeEnv() {
    this.statusChange.emit();
  }

  handleDeleteEnv($event, uuid: string) {
    $event?.stopPropagation();
    // * delete localstrage
    this.effect.deleteEnv(uuid);
  }
  editEnv(item) {
    this.router.navigate(['/home/api/env'], {
      queryParams: { uuid: item.uuid }
    });
  }
  addEnv(pid = 1) {
    this.router.navigate(['/home/api/env']);
  }
}
