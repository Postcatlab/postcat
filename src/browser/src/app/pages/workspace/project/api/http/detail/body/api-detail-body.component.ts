import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ApiBodyType, ApiTableConf } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiTableService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-table.service';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { Subject } from 'rxjs';

@Component({
  selector: 'eo-api-detail-body',
  templateUrl: './api-detail-body.component.html'
})
export class ApiDetailBodyComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() model: BodyParam[];
  @Input() bodyType: ApiBodyType | number;
  listConf: ApiTableConf = {};
  cache: object = {};
  get TYPE_API_BODY(): typeof ApiBodyType {
    return ApiBodyType;
  }
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private apiTable: ApiTableService) {}
  beforeChangeBodyByType(type) {
    switch (type) {
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
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
    this.initListConf();
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
    const config = this.apiTable.initTable({
      in: 'body',
      module: 'preview',
      format: this.bodyType as ApiBodyType,
      isEdit: false,
      id: this.tid
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
