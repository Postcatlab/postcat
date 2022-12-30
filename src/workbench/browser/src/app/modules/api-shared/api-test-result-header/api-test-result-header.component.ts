import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'eo-api-test-result-header',
  templateUrl: './api-test-result-header.component.html',
  styleUrls: ['./api-test-result-header.component.scss'],
})
export class ApiTestResultHeaderComponent implements OnInit {
  @Input() model: Array<{ name: string; value: string }>;
  constructor() {}

  ngOnInit(): void {}
}
