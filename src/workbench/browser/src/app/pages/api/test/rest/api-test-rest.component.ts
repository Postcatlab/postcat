import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ApiTestRest } from '../../../../shared/services/api-test/api-test.model';
import { ApiTestUtilService } from '../api-test-util.service';
@Component({
  selector: 'eo-api-test-rest',
  templateUrl: './api-test-rest.component.html',
  styleUrls: ['./api-test-rest.component.scss'],
})
export class ApiTestRestComponent implements OnInit, OnChanges {
  @Input() model: object[];
  listConf: object = {};
  private itemStructure: ApiTestRest = {
    name: '',
    required: true,
    value: '',
  };
  constructor(private editService: ApiTestUtilService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initListConf();
  }
  ngOnChanges(changes) {
    if (changes.model) {
      const currentVal = changes.model.currentValue;
      if (currentVal && (!currentVal.length || (currentVal.length && currentVal[currentVal.length - 1].name))) {
        this.model.push(Object.assign({}, this.itemStructure));
      }
    }
  }
  private initListConf() {
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_REST',
      itemStructure: this.itemStructure,
    });
  }
}
