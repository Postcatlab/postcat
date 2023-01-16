import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiEditBody, ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ApiBodyType } from 'eo/workbench/browser/src/app/shared/services/storage/db/enums/api.enum';
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
  @Input() model: string | ApiEditBody[] | any;
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
