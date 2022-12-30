import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'eo-api-test-result-request-body',
  templateUrl: './api-test-result-request-body.component.html',
  styleUrls: ['./api-test-result-request-body.component.scss']
})
export class ApiTestResultRequestBodyComponent implements OnChanges {
  @Input() model: Array<{ name: string; type: string; value: string }> | string | any;
  modelType: string;
  constructor() {}

  ngOnChanges(changes) {
    if (changes?.model) {
      this.modelType = typeof changes.model.currentValue;
    }
  }
}
