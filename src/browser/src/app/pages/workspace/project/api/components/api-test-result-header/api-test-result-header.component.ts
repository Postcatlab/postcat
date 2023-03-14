import { Component, Input } from '@angular/core';

import { ApiTestResHeader } from '../../service/test-server/test-server.model';

@Component({
  selector: 'eo-api-test-result-header',
  templateUrl: './api-test-result-header.component.html',
  styleUrls: ['./api-test-result-header.component.scss']
})
export class ApiTestResultHeaderComponent {
  @Input() model: ApiTestResHeader[];
  constructor() {}
}
