import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { RestParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'eo-api-test-rest',
  templateUrl: './api-test-rest.component.html',
  styleUrls: ['./api-test-rest.component.scss']
})
export class ApiTestRestComponent implements OnInit, OnDestroy {
  @Input() model: RestParam[];
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();
  itemStructure: RestParam = {
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
