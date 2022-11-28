import { Component, OnInit, Input } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiEditQuery } from '../../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-detail-header',
  template: `<eo-ng-table-pro
    [columns]="listConf.columns"
    [setting]="listConf.setting"
    [(nzData)]="model"
  ></eo-ng-table-pro>`,
})
export class ApiDetailQueryComponent implements OnInit {
  @Input() model: ApiEditQuery[];
  listConf: any = {};
  constructor(private apiTable: ApiTableService) {}

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTable({
      in: 'query',
      module: 'preview',
      isEdit: false,
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
