import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'eo-api-test-result-request-body',
  templateUrl: './api-test-result-request-body.component.html',
  styleUrls: ['./api-test-result-request-body.component.scss']
})
export class ApiTestResultRequestBodyComponent {
  @Input() model: Array<{ name: string; type: string; value: string }> | string | any;
  @Input() contentType: string;
  constructor() {}
}
