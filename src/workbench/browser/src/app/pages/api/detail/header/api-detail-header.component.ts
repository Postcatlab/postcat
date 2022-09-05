import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ApiEditHeaders, ApiEditBody } from '../../../../shared/services/storage/index.model';
import { ApiDetailUtilService } from '../api-detail-util.service';

@Component({
  selector: 'eo-api-detail-header',
  templateUrl: './api-detail-header.component.html',
  styleUrls: ['./api-detail-header.component.scss'],
})
export class ApiDetailHeaderComponent implements OnInit, OnChanges {
  @Input() model: ApiEditHeaders[];
  listConf: object = {};
  private itemStructure: ApiEditBody = {
    name: '',
    type: 'string',
    required: true,
    example: '',
    enum: [],
    description: '',
  };
  constructor(private detailService: ApiDetailUtilService) {}

  ngOnInit(): void {
    this.initListConf();
  }
  ngOnChanges(changes) {
    // if (changes.model&&!changes.model.previousValue&&changes.model.currentValue) {
    //   this.model.push(Object.assign({}, this.itemStructure));
    // }
  }
  private initListConf() {
    this.listConf = this.detailService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_EDIT_HEADER',
      title: $localize`:@@Header:Header`,
      nameTitle: $localize`Key`,
      itemStructure: this.itemStructure,
    });
  }
}
