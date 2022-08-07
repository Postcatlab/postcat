import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, OnChanges, EventEmitter, Output } from '@angular/core';
import { ApiEditRest } from '../../../../shared/services/storage/index.model';
import { ApiEditUtilService } from '../api-edit-util.service';
@Component({
  selector: 'eo-api-edit-rest',
  templateUrl: './api-edit-rest.component.html',
  styleUrls: ['./api-edit-rest.component.scss'],
})
export class ApiEditRestComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() model: ApiEditRest[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  listConf: object = {};
  private itemStructure: ApiEditRest = {
    name: '',
    required: true,
    example: '',
    description: '',
  };
  constructor(private editService: ApiEditUtilService, private cdRef: ChangeDetectorRef) {}
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
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_EDIT_REST',
      itemStructure: this.itemStructure,
      nzOnOkMoreSetting: (inputArg) => {
        this.model[inputArg.$index] = inputArg.item;
        this.modelChange.emit(this.model);
      },
      watchFormLastChange: () => {
        this.modelChange.emit(this.model);
      },
    });
  }
}
