import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiEditQuery, ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';

@Component({
  selector: 'eo-api-edit-query',
  template: `<div class="param-box-header flex items-center h-10">
      <params-import [(baseData)]="model" contentType="query"></params-import>
    </div>
    <eo-ng-table-pro
      [columns]="listConf.columns"
      [nzDataItem]="itemStructure"
      [setting]="listConf.setting"
      [(nzData)]="model"
      (nzDataChange)="modelChange.emit($event)"
    ></eo-ng-table-pro>`
})
export class ApiEditQueryComponent implements OnInit {
  @Input() tid: string;
  @Input() model: ApiEditQuery[];
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  itemStructure: ApiEditQuery = {
    name: '',
    required: true,
    example: '',
    description: ''
  };
  constructor(private apiTable: ApiTableService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: 'query',
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
