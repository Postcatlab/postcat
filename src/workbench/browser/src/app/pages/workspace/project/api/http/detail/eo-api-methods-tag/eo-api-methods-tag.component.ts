import { Component, Input, OnChanges, OnInit } from '@angular/core';
export enum ApiMethod {
  'POST',
  'GET',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'PATCH'
}

export enum ApiTypeEnum {
  http = 'http',
  websocket = 'websocket',
  tcp = 'tcp',
  udp = 'udp',
  hsf = 'hsf',
  dubbo = 'dubbo',
  grpc = 'grpc'
}

export type APIMethodsType = keyof typeof ApiMethod | 'ALL' | undefined;

const DEFAULT_TYPE = 'GET';
@Component({
  selector: 'eo-api-methods-tag',
  exportAs: 'eoApiMethodsTag',
  template: `<nz-tag *ngIf="type" [class]="[text | lowercase, _background && 'ignore']">{{ text | uppercase }}</nz-tag> `,
  styleUrls: ['./eo-api-methods-tag.component.scss']
})
export class PcApiMethodsTagComponent implements OnChanges {
  _background = false;
  @Input() type: APIMethodsType = DEFAULT_TYPE;

  @Input() apiType?: ApiTypeEnum;

  @Input() apiRequestType?: ApiMethod;

  text: string = DEFAULT_TYPE;
  constructor() {}

  update() {
    if (this.apiType && this.apiType !== 'http') {
      this.text = this.apiType === 'websocket' ? 'ws' : this.apiType;
    } else if (this.apiRequestType || this.apiRequestType === 0) {
      this.text = ApiMethod[this.apiRequestType];
    } else if (this.type) {
      const simpleMap = {
        POST: 'POST',
        GET: 'GET',
        PUT: 'PUT',
        DELETE: 'DEL',
        HEAD: 'HEAD',
        OPTIONS: 'OPTS',
        PATCH: 'PATCH',
        ALL: 'ALL'
      };
      this.text = simpleMap[this.type];
    }
  }

  ngOnChanges() {
    this.update();
  }
}
