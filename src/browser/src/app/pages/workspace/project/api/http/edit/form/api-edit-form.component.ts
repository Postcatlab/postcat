import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ApiTableConf } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { ApiTableService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-table.service';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';

@Component({
  selector: 'eo-api-edit-form',
  template: `<div class="param-box-header flex items-center h-10" *ngIf="module !== 'rest'">
      <params-import [(baseData)]="model" (baseDataChange)="changeFn($event)" [contentType]="module"></params-import>
    </div>
    <eo-ng-table-pro
      [columns]="listConf.columns"
      [nzDataItem]="itemStructure"
      [setting]="listConf.setting"
      [(nzData)]="model"
      (nzDataChange)="modelChange.emit($event)"
    ></eo-ng-table-pro>
    <ng-template #formValue let-item="item" let-rowItem="rowItem" let-index="index">
      <input
        placeholder="{{ rowItem.placeholder }}"
        eo-ng-input
        maxlength="{{ rowItem.maxlength }}"
        [(ngModel)]="item.paramAttr.example"
        (ngModelChange)="modelChange.emit(model)"
      />
    </ng-template>`
})
export class ApiEditFormComponent implements OnInit {
  @Input() model: BodyParam[];
  /**
   * Table ID
   */
  @Input() tid: string;
  @Input() module: 'rest' | 'header' | 'query';
  @Output() readonly modelChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('formValue', { static: true }) formValue?: TemplateRef<HTMLDivElement>;
  listConf: ApiTableConf = {
    columns: [],
    setting: {}
  };
  itemStructure: BodyParam = {
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
    this.modelChange.emit($event);
  }
  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: this.module,
        isEdit: true,
        id: this.tid,
        exampleSlot: this.formValue
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
