import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { BodyParam } from '../../../../../../services/storage/db/models/apiData';
import { ApiTableConf } from '../../api.model';
import { ApiTableService } from '../../service/api-table.service';
@Component({
  selector: 'pc-api-test-form',
  template: `<fieldset [disabled]="disabled" *ngIf="module !== 'rest'">
      <div class="flex items-center h-10 param-box-header">
        <params-import [disabled]="disabled" [(baseData)]="model" [contentType]="module"></params-import>
      </div>
    </fieldset>
    <!-- {{ model | json }} -->
    <eo-ng-table-pro
      [columns]="listConf.columns"
      [nzDataItem]="itemStructure"
      [setting]="listConf.setting"
      [nzTrClick]="nzTrClick"
      [(nzData)]="model"
      (nzDataChange)="modelChange.emit($event)"
    ></eo-ng-table-pro> `
})
export class ApiTestFormComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean;
  @Input() model: BodyParam[];
  @Input() nzTrClick: (...rest: any[]) => any;
  @Input() module: 'rest' | 'header' | 'query';
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();

  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();
  itemStructure: BodyParam = {
    isRequired: 1,
    name: '',
    paramAttr: {
      example: ''
    }
  };
  constructor(private apiTable: ApiTableService) {
    this.modelChange$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  ngOnInit(): void {
    this.initListConf();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private initListConf() {
    const config = this.apiTable.initTestTable({
      in: this.module,
      id: `api_test_${module}`
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
