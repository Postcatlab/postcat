import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTableConf } from '../../constants/api.model';
import { ApiTableService } from '../../service/api-table.service';
@Component({
  selector: 'pc-api-test-form',
  template: `<fieldset [disabled]="disabled" *ngIf="module !== 'rest'">
      <div class="flex items-center h-10 param-box-header">
        <params-import
          [disabled]="disabled"
          (baseDataChange)="importChange($event)"
          [(baseData)]="model"
          [contentType]="module"
        ></params-import>
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
    ></eo-ng-table-pro>
    <ng-template #formValue let-item="item" let-rowItem="rowItem" let-index="index">
      <input
        placeholder="{{ rowItem.placeholder }}"
        eo-ng-input
        maxlength="{{ rowItem.maxlength }}"
        [(ngModel)]="item.paramAttr.example"
        (ngModelChange)="emitChangeFun()"
      />
    </ng-template>`
})
export class ApiTestFormComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean;
  @Input() model: BodyParam[];
  @Input() nzTrClick: (...rest: any[]) => any;
  @Input() module: 'rest' | 'header' | 'query';
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('formValue', { static: true }) formValue?: TemplateRef<HTMLDivElement>;

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
  importChange($event) {
    this.modelChange.emit($event);
  }
  emitChangeFun() {
    this.modelChange.emit(this.model);
  }
  private initListConf() {
    const config = this.apiTable.initTestTable({
      in: this.module,
      id: `api_test_${module}`,
      exampleSlot: this.formValue
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
