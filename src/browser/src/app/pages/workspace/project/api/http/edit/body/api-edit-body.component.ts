import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import {
  ApiBodyType,
  ApiParamsType,
  ApiTableConf,
  API_BODY_TYPE,
  IMPORT_MUI,
  JsonRootType
} from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiTableService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-table.service';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { enumsToArr, eoDeepCopy } from 'pc/browser/src/app/shared/utils/index.utils';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, pairwise } from 'rxjs/operators';

@Component({
  selector: 'eo-api-edit-body',
  templateUrl: './api-edit-body.component.html',
  styleUrls: ['./api-edit-body.component.scss']
})
export class ApiEditBodyComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() model: BodyParam[];
  @Input() supportType: ApiBodyType[] = [ApiBodyType.FormData, ApiBodyType.JSON, ApiBodyType.XML, ApiBodyType.Raw, ApiBodyType.Binary];
  @Input() bodyType: ApiBodyType | number;
  @Output() readonly bodyTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  checkAddRow: (item) => boolean;
  nzDragCheck: (current, next) => boolean;
  jsonRootType: number = JsonRootType.Object;
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  cache: any = {};
  itemStructure: BodyParam = {
    name: '',
    dataType: ApiParamsType.string,
    isRequired: 1,
    description: '',
    paramAttr: {
      example: ''
    }
  };
  IMPORT_MUI = IMPORT_MUI;
  API_BODY_TYPE;
  JSON_ROOT_TYPE = enumsToArr(JsonRootType);

  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  private bodyType$: Subject<number> = new Subject<number>();
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<BodyParam[]> = new Subject<BodyParam[]>();
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
    this.bodyType = jsonRootType;
    this.bodyTypeChange.emit(this.bodyType);
    this.modelChange.emit(this.model);
  }
  rawChange(code) {
    this.model[0].binaryRawData = code;
    this.rawChange$.next(this.model);
  }
  changeBodyType() {
    this.bodyType$.next(this.bodyType);
    this.bodyTypeChange.emit(this.bodyType);
    this.setModel();
    this.initListConf();
    this.modelChange.emit(this.model);
  }
  ngOnInit(): void {
    this.API_BODY_TYPE = API_BODY_TYPE.filter(val => this.supportType.includes(val.value));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  init() {
    this.beforeChangeBodyByType(this.bodyType);
    this.setModel();
    this.initListConf();
  }
  ngOnChanges(changes) {
    const isFirst = changes.model?.firstChange;
    if (isFirst) {
      this.beforeChangeBodyByType(this.bodyType);
      this.setModel();
      this.initListConf();
    }
  }
  beforeHandleImport(result) {
    this.jsonRootType = Array.isArray(result) ? JsonRootType.Array : JsonRootType.Object;
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
        this.cache[type] = this.model?.length ? this.model : [{ binaryRawData: '' }];
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
        this.model = this.cache[this.bodyType] || [
          {
            binaryRawData: this.model?.[0]?.binaryRawData || ''
          }
        ];
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        break;
      }
    }
    if ([ApiBodyType.FormData, ApiBodyType.JSON, ApiBodyType.JSONArray].includes(this.bodyType)) {
      if (!this.model.length || this.model[this.model.length - 1].name) {
        this.model.push(eoDeepCopy(this.itemStructure));
      }
    }
    if (this.bodyType === ApiBodyType.XML) {
      if (!this.model.length) {
        const rootItem: BodyParam = Object.assign(eoDeepCopy(this.itemStructure), {
          dataType: ApiParamsType.object,
          name: 'root',
          childList: [eoDeepCopy(this.itemStructure)]
        });
        this.model.push(rootItem);
      }
    }
  }
  nzCheckAddChild(item) {
    //Add child row, must be object/array
    if (![ApiParamsType.object, ApiParamsType.array].includes(item.data.dataType)) {
      item.data.dataType = ApiParamsType.object;
    }
  }
  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: 'body',
        id: this.tid,
        format: this.bodyType,
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
      this.checkAddRow = item => {
        //@ts-ignore
        return item.eoKey !== this.model[0].eoKey;
      };
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
