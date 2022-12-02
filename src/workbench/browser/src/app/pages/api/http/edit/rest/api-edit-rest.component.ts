import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterViewChecked,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { ApiTableService } from 'eo/workbench/browser/src/app/modules/api-shared/api-table.service';
import { ApiEditRest } from '../../../../../shared/services/storage/index.model';
@Component({
  selector: 'eo-api-edit-rest',
  template: `<eo-ng-table-pro
    [columns]="listConf.columns"
    [nzDataItem]="itemStructure"
    [setting]="listConf.setting"
    [(nzData)]="model"
    (nzDataChange)="modelChange.emit($event)"
  ></eo-ng-table-pro>`,
})
export class ApiEditRestComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() model: ApiEditRest[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  listConf: any = {
    column: [],
    setting: {},
  };
  itemStructure: ApiEditRest = {
    name: '',
    required: true,
    example: '',
    description: '',
  };
  constructor(private apiTable: ApiTableService, private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.initListConf();
  }
  ngAfterViewChecked() {
    // prevent AngularJS error when dragging and sorting item
    this.cdRef.detectChanges();
  }
  ngOnChanges(changes) {
    if (changes.model && !changes.model.previousValue && changes.model.currentValue) {
      if (!this.model.length || this.model[this.model.length - 1].name) {
        this.model.push(Object.assign({}, this.itemStructure));
      }
    }
  }
  private initListConf() {
    const config = this.apiTable.initTable(
      {
        in: 'rest',
        isEdit: true,
      },
      {
        changeFn: () => {
          this.modelChange.emit(this.model);
        },
      }
    );
    this.listConf.columns = config.columns;
    this.listConf.setting = config.setting;
  }
}
