import { Component, Input, OnChanges } from '@angular/core';
import { ApiTestResData } from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';

@Component({
  selector: 'pc-test-status-bar',
  template: `
    <div class="flex items-center">
      <span class="mr-[15px] {{ codeStatus.class }}">{{ model.statusCode || 'No Response' }}</span>
      <span class="mr-[15px] text-[12px]">Size: {{ model.responseLength | byteToString }}</span>
      <span class="text-[12px]">Time: {{ model.time }} ms</span>
    </div>
  `,
  styleUrls: ['./test-status-bar.component.scss']
})
export class TestStatusBarComponent implements OnChanges {
  @Input() model: ApiTestResData;
  codeStatus;
  private HTTP_CODE_STATUS = [
    {
      cap: 199,
      class: 'test-default'
    },
    {
      status: 'success',
      cap: 299,
      class: 'test-success'
    },
    {
      status: 'redirect',
      cap: 399,
      class: 'test-warning'
    },
    {
      status: 'clientError',
      cap: 499,
      class: 'test-error'
    },
    {
      status: 'serverError',
      cap: 599,
      class: 'test-error'
    }
  ];
  ngOnChanges() {
    this.codeStatus = this.getHTTPStatus(this.model.statusCode);
  }
  private getHTTPStatus(statusCode) {
    return this.HTTP_CODE_STATUS.find(val => statusCode <= val.cap);
  }
}
