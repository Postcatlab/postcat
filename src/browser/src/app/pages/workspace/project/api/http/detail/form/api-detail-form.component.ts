import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ApiTableConf } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiTableService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-table.service';
import { HeaderParam } from 'pc/browser/src/app/services/storage/db/models/apiData';

@Component({
  selector: 'eo-api-detail-form',
  template: `<eo-ng-table-pro [columns]="listConf.columns" [setting]="listConf.setting" [(nzData)]="model"></eo-ng-table-pro
    ><ng-template #formValue let-item="item">
      <span>{{ item.paramAttr.example }}</span>
    </ng-template>`
})
export class ApiDetailFormComponent implements OnInit {
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() model: HeaderParam[];
  @Input() module: 'rest' | 'header' | 'query';
  @ViewChild('formValue', { static: true }) formValue?: TemplateRef<HTMLDivElement>;
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
      exampleSlot: this.formValue,
      id: this.tid
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
