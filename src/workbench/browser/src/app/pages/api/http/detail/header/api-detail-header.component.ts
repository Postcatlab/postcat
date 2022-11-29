import { Component, OnInit, Input } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiEditHeaders } from '../../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-detail-header',
  template: `<eo-ng-table-pro
    [columns]="listConf.columns"
    [setting]="listConf.setting"
    [(nzData)]="model"
  ></eo-ng-table-pro>`,
})
export class ApiDetailHeaderComponent implements OnInit {
  @Input() model: ApiEditHeaders[];
  listConf: any = {};
  constructor(private apiTable: ApiTableService) {}

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTable({
      in: 'header',
      module: 'preview',
      isEdit: false,
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
