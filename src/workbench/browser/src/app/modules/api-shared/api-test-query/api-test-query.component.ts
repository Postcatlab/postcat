import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTestQuery } from '../../../pages/workspace/project/api/http/test/api-test.model';
import { ApiTableService } from '../api-table.service';
import { ApiTableConf } from '../api.model';

@Component({
  selector: 'eo-api-test-query',
  templateUrl: './api-test-query.component.html',
  styleUrls: ['./api-test-query.component.scss']
})
export class ApiTestQueryComponent implements OnInit, OnDestroy {
  @Input() model: ApiTestQuery[];
  @Input() disabled: boolean;
  @Input() nzTrClick: (...rest: any[]) => any;
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  itemStructure: ApiTestQuery = {
    required: true,
    name: '',
    value: ''
  };

  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();

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
      in: 'header'
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
