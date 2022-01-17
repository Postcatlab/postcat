import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ApiTestService } from '../api-test.service';
@Component({
  selector: 'eo-api-test-result-response',
  templateUrl: './api-test-result-response.component.html',
  styleUrls: ['./api-test-result-response.component.scss'],
})
export class ApiTestResultResponseComponent implements OnInit, OnChanges {
  @Input() model: any;
  codeStatus: { status: string; cap: number; class: string };
  size: string;

  constructor(private apiTest:ApiTestService) {}
  ngOnChanges(changes) {
    if (changes.model) {
      this.codeStatus =this.apiTest.getHTTPStatus(this.model.statusCode);
    }
  }
  ngOnInit(): void {}
}
