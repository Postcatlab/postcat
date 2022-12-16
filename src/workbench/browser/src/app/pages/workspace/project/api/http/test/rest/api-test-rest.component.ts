import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTestRest } from '../api-test.model';

@Component({
  selector: 'eo-api-test-rest',
  templateUrl: './api-test-rest.component.html',
  styleUrls: ['./api-test-rest.component.scss']
})
export class ApiTestRestComponent implements OnInit {
  @Input() model: object[];
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();
  itemStructure: ApiTestRest = {
    required: true,
    name: '',
    value: ''
  };
  constructor(private apiTable: ApiTableService) {
    this.modelChange$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTestTable({
      in: 'rest'
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
