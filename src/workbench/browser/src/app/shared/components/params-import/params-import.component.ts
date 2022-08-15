import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { whatType } from '../../../utils';
import { flatData } from '../../../utils/tree/tree.utils';
import qs from 'qs';
import { form2json, parseTree, xml2UiData, isXML } from '../../../utils/data-transfer/data-transfer.utils';
@Component({
  selector: 'params-import',
  templateUrl: './params-import.component.html',
  styleUrls: ['./params-import.component.scss'],
})
export class ParamsImportComponent {
  @Input() rootType: 'array' | string | 'object' = 'object';
  @Input() contentType = 'json';
  @Input() baseData: object[] = [];
  @Input() modalTitle = '';
  @Output() baseDataChange = new EventEmitter<any>();
  @Output() beforeHandleImport = new EventEmitter<any>();
  isVisible = false;
  paramCode = '';
  constructor(private message: EoMessageService) {}

  get contentTypeTitle() {
    switch (this.contentType) {
      case 'xml':
        return 'XML';
      case 'json':
        return 'JSON';
      case 'formData':
        return '表单';
      default:
        return '';
    }
  }

  get eg() {
    switch (this.contentType) {
      // case 'xml':
      //   return `<name>Jack</name><age>12</age>`;
      // case 'json':
      //   return `{ "name": "Jack", "age": 12 }`;
      case 'formData':
        return `name: Jack\nage: 12`;
      case 'query':
        return `/api?name=Jack&age=12`;
      case 'json':
        return `{ "name": "Jack", "age": 12}`;
      default:
        return `/api?name=Jack&age=12`;
    }
  }

  get contenTypeEditor() {
    switch (this.contentType) {
      case 'formData':
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
      // console.log('-->', paramCode);
    }
    if (this.contentType === 'formData') {
      const json = {};
      form2json(this.paramCode).forEach((it) => {
        const { key, value } = it;
        json[key] = value;
      });
      paramCode = JSON.parse(JSON.stringify(json));
    }
    if (this.contentType === 'xml') {
      const status = isXML(this.paramCode);
      if (!status) {
        this.message.error('XML格式不合法');
        return;
      }
      paramCode = JSON.parse(JSON.stringify(xml2UiData(this.paramCode)));
      console.log(paramCode);
      // console.log('-->', paramCode);
    }
    if (this.contentType === 'raw') {
      paramCode = this.paramCode;
    }

    const tailData = this.baseData.slice(-1);
    let resultData = JSON.parse(JSON.stringify(this.baseData.reverse().slice(1).reverse()));
    if (rootType !== whatType(paramCode)) {
      // TODO Perhaps should be handled about format compatibility later.
      console.warn('The code that you input is no-equal to the root type.');
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
    const cacheData = flatData(Object.entries(paramCode).map(([key, value]) => parseTree(key, value)));
    console.log(cacheData);

    // TODO delete useless attribute in cacheData
    switch (type) {
      case 'mixin': {
        const nameList = resultData.map((it) => it.name);
        const data = cacheData.filter((it) => !nameList.includes(it.name));
        resultData = resultData.concat(data);
        break;
      }
      case 'overwrite': {
        console.log(cacheData);
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

    this.baseDataChange.emit(resultData.concat(tailData));
    this.handleCancel();
  }

  handleCancel(): void {
    this.paramCode = '';
    this.isVisible = false;
  }
}
