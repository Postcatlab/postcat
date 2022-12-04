import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiEditHeaders } from '../../../../../shared/services/storage/index.model';
@Component({
  selector: 'eo-api-edit-header',
  template: `<div class="param-box-header flex items-center h-10">
      <params-import
        [(baseData)]="model"
        contentType="header"
        i18n-modalTitle="@@Header"
        modalTitle="Header"
      ></params-import>
    </div>
    <eo-ng-table-pro
      [columns]="listConf.columns"
      [nzDataItem]="itemStructure"
      [setting]="listConf.setting"
      [(nzData)]="model"
      (nzDataChange)="modelChange.emit($event)"
    ></eo-ng-table-pro> `,
})
export class ApiEditHeaderComponent implements OnInit {
  @Input() model: ApiEditHeaders[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  listConf: any = {
    column: [],
    setting: {},
  };
  itemStructure: ApiEditHeaders = {
    name: '',
    required: true,
    example: '',
    description: '',
  };
  constructor(private apiTable: ApiTableService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initListConf();
  }
  private initListConf() {
    const config = this.apiTable.initTable({
      in: 'header',
      isEdit: true,
    },{
      changeFn: () => {
        this.modelChange.emit(this.model);
      }
    });
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
