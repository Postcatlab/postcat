import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, OnChanges } from '@angular/core';
import { ApiEditHeaders } from 'eo/platform/browser/IndexedDB';
import { ApiEditService } from '../api-edit.service';
@Component({
  selector: 'eo-api-edit-header',
  templateUrl: './api-edit-header.component.html',
  styleUrls: ['./api-edit-header.component.scss'],
})
export class ApiEditHeaderComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() model: ApiEditHeaders[];
  listConf: object = {};
  private itemStructure: ApiEditHeaders = {
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
    if (changes.model && !changes.model.previousValue && changes.model.currentValue) {
      this.model.push(Object.assign({}, this.itemStructure));
    }
  }
  private initListConf() {
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_EDIT_HEADER',
      itemStructure: this.itemStructure,
      title: '头部',
      nameTitle: '标签',
      nzOnOkMoreSetting: (inputArg) => {
        this.model[inputArg.$index] = inputArg.item;
      },
    });
  }
}
