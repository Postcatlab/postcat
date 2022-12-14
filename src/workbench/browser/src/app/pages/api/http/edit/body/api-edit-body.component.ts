import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { JsonRootType, ApiEditBody, ApiBodyType, ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { eoDeepCopy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { Subject } from 'rxjs';
import { pairwise, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'eo-api-edit-body',
  templateUrl: './api-edit-body.component.html',
  styleUrls: ['./api-edit-body.component.scss']
})
export class ApiEditBodyComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() model: string | object[] | any;
  @Input() supportType: string[];
  @Input() bodyType: ApiBodyType | string;
  @Input() jsonRootType: JsonRootType | string;
  @Output() readonly jsonRootTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly bodyTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  checkAddRow: (item) => boolean;
  nzDragCheck: (current, next) => boolean;
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  cache: any = {};

  CONST: any = {
    JSON_ROOT_TYPE: Object.keys(JsonRootType).map(val => ({ key: val, value: JsonRootType[val] }))
  };
  itemStructure: ApiEditBody = {
    name: '',
    type: 'string',
    required: true,
    example: '',
    description: ''
  };
  private bodyType$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor(private message: EoNgFeedbackMessageService, private apiTable: ApiTableService) {
    this.bodyType$.pipe(pairwise(), takeUntil(this.destroy$)).subscribe(val => {
      this.beforeChangeBodyByType(val[0]);
    });
    this.initListConf();
    this.rawChange$.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(model => {
      if (this.bodyType !== ApiBodyType.Raw) {
        return;
      }
      // ! Must set value by data, because this.model has delay
      this.modelChange.emit(model);
    });
  }
  jsonRootTypeDataChange(jsonRootType) {
    this.jsonRootTypeChange.emit(jsonRootType);
    this.modelChange.emit(this.model);
  }
  rawChange(code) {
    this.rawChange$.next(code);
  }
  changeBodyType(type?) {
    this.bodyType$.next(this.bodyType);
    this.bodyTypeChange.emit(this.bodyType);
    this.setModel();
    this.initListConf();
    this.modelChange.emit(this.model);
  }
  ngOnInit(): void {
    this.CONST.API_BODY_TYPE = Object.keys(ApiBodyType)
      .filter(val => this.supportType.includes(ApiBodyType[val]))
      .map(val => ({ key: val, value: ApiBodyType[val] }));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnChanges(changes) {
    if (changes.model && ((!changes.model.previousValue && changes.model.currentValue) || changes.model.currentValue?.length === 0)) {
      this.beforeChangeBodyByType(this.bodyType);
      this.setModel();
      this.initListConf();
    }
  }
  beforeHandleImport(result) {
    this.jsonRootType = Array.isArray(result) ? 'array' : 'object';
  }
  tableChange($event) {
    this.modelChange.emit(this.model);
  }
  handleParamsImport(data) {
    this.model = data;
    this.modelChange.emit(data);
  }
  private beforeChangeBodyByType(type) {
    switch (type) {
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
        if (typeof this.model !== 'string') {
          return;
        }
        this.cache[type] = this.model || '';
        break;
      }
      default: {
        this.cache[type] = [...(Array.isArray(this.model) ? this.model : [])];
        break;
      }
    }
  }
  /**
   * Set model after change bodyType
   *
   * Add last row| RestoreData From cache| XML first row type must be object
   */
  private setModel() {
    switch (this.bodyType) {
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
        this.model = this.cache[this.bodyType] || '';
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        break;
      }
    }
    if (['formData', 'json'].includes(this.bodyType)) {
      if (!this.model.length || this.model[this.model.length - 1].name) {
        this.model.push(eoDeepCopy(this.itemStructure));
      }
    }
    if (this.bodyType === 'xml') {
      if (!this.model.length) {
        this.model.push(
          Object.assign(eoDeepCopy(this.itemStructure), {
            type: 'object',
            name: 'root'
          })
        );
      }
    }
  }

  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: 'body',
        id: this.tid,
        format: this.bodyType as ApiBodyType,
        isEdit: true
      },
      {
        manualAdd: true,
        changeFn: () => {
          this.tableChange(this.model);
        }
      }
    );
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
    if (this.bodyType === ApiBodyType.XML) {
      this.checkAddRow = item => item.eoKey !== this.model[0].eoKey;
      this.nzDragCheck = (current, next) => {
        if (next.level === 0) {
          this.message.warning($localize`XML can have only one root node`);
          return false;
        }
        return true;
      };
    } else {
      this.checkAddRow = null;
    }
  }
}
