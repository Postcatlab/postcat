import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import qs from 'qs';

import { form2json, xml2json, isXML, json2Table } from '../../../utils/data-transfer/data-transfer.utils';
import { eoDeepCopy, whatType } from '../../../utils/index.utils';
@Component({
  selector: 'params-import',
  templateUrl: './params-import.component.html',
  styleUrls: ['./params-import.component.scss']
})
export class ParamsImportComponent {
  @Input() disabled: boolean;
  @Input() rootType: 'array' | string | 'object' = 'object';
  @Input() contentType: string | 'json' | 'formData' | 'xml' | 'header' | 'query' = 'json';
  @Input() baseData: object[] = [];
  @Input() modalTitle = '';
  @Output() readonly baseDataChange = new EventEmitter<any>();
  @Output() readonly beforeHandleImport = new EventEmitter<any>();
  isVisible = false;
  paramCode = '';
  constructor(private message: EoNgFeedbackMessageService) {}

  get contentTypeTitle() {
    switch (this.contentType) {
      case 'xml':
        return 'XML';
      case 'json':
        return 'JSON';
      case 'formData':
        return `Form-data`;
      case 'header':
        return $localize`Header`;
      default:
        return '';
    }
  }

  get eg() {
    switch (this.contentType) {
      case 'xml':
        return `<name>Jack</name>`;
      // case 'json':
      //   return `{ "name": "Jack", "age": 12 }`;
      case 'formData':
        return `name: Jack\nage: 18`;
      case 'query':
        return `/api?name=Jack&age=18`;
      case 'json':
        return `{ "name": "Jack", "age": 18}`;
      case 'header':
        return `headerName:headerValue\nheaderName2:headerValue2`;
      default:
        return `/api?name=Jack&age=18`;
    }
  }

  get contenTypeEditor() {
    switch (this.contentType) {
      case 'formData':
      case 'header':
      case 'query':
        return 'text';
      default:
        return this.contentType;
    }
  }

  showModal(type): void {
    this.isVisible = true;
  }

  handleImport(type: string): void {
    if (this.paramCode === '') {
      this.handleCancel();
      return;
    }
    let rootType = this.rootType;
    let paramCode = null;
    if (this.contentType === 'json') {
      try {
        paramCode = JSON.parse(this.paramCode);
        this.beforeHandleImport.emit(paramCode);
        rootType = Array.isArray(paramCode) ? 'array' : 'object';
      } catch (error) {
        this.message.error($localize`JSON format invalid`);
        return;
      }
    }
    if (this.contentType === 'query') {
      paramCode = qs.parse(this.paramCode.indexOf('?') > -1 ? this.paramCode.split('?')[1] : this.paramCode);
    }
    if (['formData', 'header'].includes(this.contentType)) {
      const json = {};
      form2json(this.paramCode).forEach(it => {
        const { key, value } = it;
        if (key == null || value == null) {
          this.message.error($localize`Form format invalid`);
          return;
        }
        json[key] = value;
      });
      paramCode = json;
    }
    if (this.contentType === 'xml') {
      const status = isXML(this.paramCode);
      if (!status) {
        this.message.error($localize`XML format invalid`);
        return;
      }
      paramCode = xml2json(this.paramCode);
    }
    if (this.contentType === 'raw') {
      paramCode = this.paramCode;
    }

    const tailData = this.baseData.slice(-1);
    let resultData = eoDeepCopy(this.baseData.reverse().slice(1).reverse());
    // console.log('resultData', resultData);

    if (rootType !== whatType(paramCode)) {
      // TODO Perhaps should be handled about format compatibility later.
      console.warn('EO_WARN[params-import]: The code that you input is no-equal to the root type.');
    }
    // if (whatType(paramCode) === 'object') {
    // * transform to array of table format.
    // }
    if (rootType === 'array' && whatType(paramCode) === 'array') {
      // * only select first data
      const [data] = paramCode;
      paramCode = data || {};
    }
    // * tree to array for table render
    const cacheData = json2Table(paramCode);

    // TODO delete useless attribute in cacheData
    switch (type) {
      case 'mixin': {
        const nameList = resultData.map(it => it.name);
        const data = cacheData.filter(it => !nameList.includes(it.name));
        resultData = resultData.concat(data);
        break;
      }
      case 'overwrite': {
        resultData = cacheData;
        break;
      }
      case 'append': {
        resultData = resultData.concat(cacheData);
        break;
      }
      default:
        break;
    }
    console.log('tailData', resultData, tailData);
    this.baseDataChange.emit(isXML(this.paramCode) ? resultData : resultData.concat(tailData));
    this.handleCancel();
  }

  handleCancel(): void {
    this.paramCode = '';
    this.isVisible = false;
  }
}
