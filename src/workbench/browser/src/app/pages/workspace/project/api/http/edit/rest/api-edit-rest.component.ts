import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiTableConf } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { RestParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

@Component({
  selector: 'eo-api-edit-rest',
  template: `<eo-ng-table-pro
    [columns]="listConf.columns"
    [nzDataItem]="itemStructure"
    [setting]="listConf.setting"
    [(nzData)]="model"
    (nzDataChange)="modelChange.emit($event)"
  ></eo-ng-table-pro>`
})
export class ApiEditRestComponent implements OnInit {
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() model: RestParam[];
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  itemStructure: RestParam = {
    name: '',
    isRequired: 1,
    paramAttr: {
      example: ''
    },
    description: ''
  };
  constructor(private apiTable: ApiTableService, private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: 'rest',
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
