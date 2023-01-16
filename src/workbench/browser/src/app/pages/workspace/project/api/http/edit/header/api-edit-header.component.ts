import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { HeaderParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

@Component({
  selector: 'eo-api-edit-header',
  template: `<div class="param-box-header flex items-center h-10">
      <params-import [(baseData)]="model" (baseDataChange)="changeFn($event)" contentType="header"></params-import>
    </div>
    <eo-ng-table-pro
      [columns]="listConf.columns"
      [nzDataItem]="itemStructure"
      [setting]="listConf.setting"
      [(nzData)]="model"
      (nzDataChange)="modelChange.emit($event)"
    ></eo-ng-table-pro> `
})
export class ApiEditHeaderComponent implements OnInit {
  @Input() model: HeaderParam[];
  /**
   * Table ID
   */
  @Input() tid: string;
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  itemStructure: HeaderParam = {
    name: '',
    isRequired: 1,
    paramAttr: {
      example: ''
    },
    description: ''
  };
  constructor(private apiTable: ApiTableService) {}

  ngOnInit(): void {
    this.initListConf();
  }
  changeFn($event) {
    this.modelChange.emit(this.model);
  }
  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: 'header',
        isEdit: true,
        id: this.tid
      },
      {
        changeFn: () => {
          this.modelChange.emit(this.model);
        }
      }
    );
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
