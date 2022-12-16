import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTestHeaders } from '../../../pages/workspace/project/api/http/test/api-test.model';
import { ApiTableService } from '../api-table.service';
import { ApiTableConf } from '../api.model';
@Component({
  selector: 'eo-api-test-header',
  templateUrl: './api-test-header.component.html',
  styleUrls: ['./api-test-header.component.scss']
})
export class ApiTestHeaderComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean;
  @Input() model: ApiTestHeaders[];
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();

  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();
  itemStructure: ApiTestHeaders = {
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private loopSetChecked(data, checked: boolean) {
    data.paramNotNull = checked ? '0' : '1';
    if (data.childList) {
      data.childList.forEach((item: any) => {
        this.loopSetChecked(item, checked);
      });
    }
  }
  private initListConf() {
    const config = this.apiTable.initTestTable({
      in: 'header'
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
