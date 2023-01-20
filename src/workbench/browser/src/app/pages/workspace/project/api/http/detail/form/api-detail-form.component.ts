import { Component, OnInit, Input } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { HeaderParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

@Component({
  selector: 'eo-api-detail-form',
  template: `<eo-ng-table-pro [columns]="listConf.columns" [setting]="listConf.setting" [(nzData)]="model"></eo-ng-table-pro>`
})
export class ApiDetailFormComponent implements OnInit {
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() model: HeaderParam[];
  @Input() module: 'rest' | 'header' | 'query';
  listConf: ApiTableConf = {};
  constructor(private apiTable: ApiTableService) {}

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTable({
      in: this.module,
      module: 'preview',
      isEdit: false,
      id: this.tid
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
