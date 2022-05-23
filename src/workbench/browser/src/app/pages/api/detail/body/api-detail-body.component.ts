import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiEditBody, ApiBodyType, JsonRootType } from 'eo/platform/browser/IndexedDB';
import { ApiDetailService } from '../api-detail.service';
@Component({
  selector: 'eo-api-detail-body',
  templateUrl: './api-detail-body.component.html',
  styleUrls: ['./api-detail-body.component.scss'],
})
export class ApiDetailBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: string | ApiEditBody[] | any;
  @Input() bodyType: ApiBodyType | string;
  @Input() jsonRootType: JsonRootType | string;
  listConf: any = {};
  cache: object = {};
  CONST: any = {
    JSON_ROOT_TYPE: Object.keys(JsonRootType).map((val) => ({ key: val, value: JsonRootType[val] })),
  };
  private itemStructure: ApiEditBody = {
    name: '',
    type: 'string',
    required: true,
    example: '',
    enum: [],
    description: '',
  };
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private apiDetail: ApiDetailService) {
    this.initListConf();
  }
  beforeChangeBodyByType(type) {
    switch (type) {
      case ApiBodyType.Raw: { // case ApiBodyType.Binary:
        this.cache[type] = this.model || '';
        break;
      }
      default: {
        this.cache[type] = [...this.model];
        break;
      }
    }
  }
  ngOnInit(): void {
    this.CONST.API_BODY_TYPE = Object.keys(ApiBodyType).map((val) => ({ key: val, value: ApiBodyType[val] }));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnChanges(changes) {
    if (changes.model && !changes.model.previousValue && changes.model.currentValue) {
      this.beforeChangeBodyByType(this.bodyType);
    }
  }
  private initListConf() {
    this.listConf = this.apiDetail.initBodyListConf({
      title: '参数',
      itemStructure: this.itemStructure,
    });
  }
}
