import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, OnChanges } from '@angular/core';
import { ApiEditRest } from '../../../../../../../../../platform/browser/IndexedDB';
import { ApiEditService } from '../api-edit.service';
@Component({
  selector: 'eo-api-edit-rest',
  templateUrl: './api-edit-rest.component.html',
  styleUrls: ['./api-edit-rest.component.scss'],
})
export class ApiEditRestComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() model: object[];
  listConf: object = {};
  private itemStructure: ApiEditRest = {
    name: '',
    required: true,
    example: '',
    description: '',
  };
  constructor(private editService: ApiEditService, private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.initListConf();
  }
  ngAfterViewChecked() {
    // prevent AngularJS error when dragging and sorting item
    this.cdRef.detectChanges();
  }
  ngOnChanges(changes) {
    if (changes.model&&!changes.model.previousValue&&changes.model.currentValue) {
      this.model.push(Object.assign({}, this.itemStructure));
    }
  }
  private initListConf() {
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_EDIT_REST',
      itemStructure: this.itemStructure,
      nzOnOkMoreSetting: (inputArg) => {
        this.model[inputArg.$index] = inputArg.item;
      }
    });
  }
}
