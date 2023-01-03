import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { cloneDeep, toArray, merge } from 'lodash-es';
import { computed, observable, makeObservable, reaction } from 'mobx';
import qs from 'qs';

import { form2json, xml2json, isXML, json2Table } from '../../../utils/data-transfer/data-transfer.utils';
import { whatType } from '../../../utils/index.utils';

const titleHash = new Map()
  .set('xml', $localize`Import XML`)
  .set('json', $localize`Import JSON`)
  .set('formData', $localize`Import Form-data`)
  .set('header', $localize`Import Header`)
  .set('query', $localize`Import Query`);

const egHash = new Map()
  .set('xml', '<name>Jack</name>')
  .set('formData', 'name: Jack\nage: 18')
  .set('query', '/api?name=Jack&age=18')
  .set('json', `{ "name": "Jack", "age": 18 }`)
  .set('header', 'headerName:headerValue\nheaderName2:headerValue2');
@Component({
  selector: 'params-import',
  templateUrl: './params-import.component.html',
  styleUrls: ['./params-import.component.scss']
})
export class ParamsImportComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() rootType: 'array' | string | 'object' = 'object';
  @Input() contentType: string | 'json' | 'formData' | 'xml' | 'header' | 'query' = 'json';
  @Input() baseData: object[] = [];
  @Output() readonly baseDataChange = new EventEmitter<any>();
  @Output() readonly beforeHandleImport = new EventEmitter<any>();

  @observable isVisible = false;
  paramCode = '';

  @computed get importTitle() {
    return titleHash.get(this.contentType);
  }

  @computed get eg() {
    return egHash.get(this.contentType);
  }

  @computed get contentTypeEditor() {
    return ['formData', 'header', 'json'].includes(this.contentType) ? 'text' : this.contentType;
  }

  constructor(private message: EoNgFeedbackMessageService) {}

  ngOnInit() {
    makeObservable(this);
    reaction(
      () => this.isVisible,
      () => {
        this.paramCode = '';
      }
    );
  }
  showModal(type): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  parseJSON(code) {
    // * parse json
    try {
      const data = JSON.parse(code);
      return [{ data, rootType: Array.isArray(data) ? 'array' : 'object' }, null];
    } catch (error) {
      return [null, { msg: $localize`JSON format invalid` }];
    }
  }

  parseQuery(code) {
    const data = qs.parse(code.indexOf('?') > -1 ? code.split('?')[1] : code);
    return [{ data, rootType: 'object' }, null];
  }

  parseXML(code) {
    const status = isXML(code);
    if (!status) {
      return [null, { msg: $localize`XML format invalid` }];
    }
    try {
      const result = xml2json(code);
      return [{ data: result, rootType: 'object' }, null];
    } catch (error) {
      return [null, { msg: $localize`XML format invalid` }];
    }
  }
  parseForm(code) {
    const data = form2json(code).reduce((total, it) => ({ ...total, [it.key]: it.value }), {});
    // * data like => { headerName: 'headerValue', headerName2: 'headerValue2' }
    return [{ data: data, rootType: 'object' }, null];
  }

  handleImport(type: string): void {
    if (this.paramCode.trim() === '') {
      this.handleCancel();
      return;
    }
    const codeType = whatType(this.paramCode);
    if (this.rootType !== codeType) {
      // TODO Perhaps should be handled about format compatibility later.
      pcConsole.warn('[params-import]: The code that you input is no-equal to the root type.');
    }
    const func = {
      json: this.parseJSON,
      query: this.parseQuery,
      xml: this.parseXML,
      header: this.parseForm,
      formData: this.parseForm
    };

    const [res, err] = func[this.contentType](this.paramCode);
    if (err) {
      this.message.error(err.msg);
      return;
    }

    const array2obj = data => {
      if (Array.isArray(data)) {
        return data.map(array2obj).reduce(
          (total, { name, ...item }) => ({
            ...total,
            [name]: item
          }),
          {}
        );
      }
      return {
        ...data,
        children: data?.children?.length ? array2obj(data.children) : {}
      };
    };

    const obj2array = data =>
      Object.entries(data).map(([name, value]: any[]) => ({
        name,
        ...value,
        children: value?.children ? obj2array(value.children) : []
      }));

    const combineFunc = {
      overwrite: data => data,
      append: (data, base) => base.concat(data),
      mixin: (data, base) => obj2array(merge(array2obj(base), array2obj(data)))
    };

    const endParse = (data, type) => {
      if (['xml'].includes(type)) {
        return [data.at(0)];
      }
      return data;
    };

    const { data } = res;
    // * this.baseData.reverse().slice(1).reverse() for filter the last empty row
    const emptyRow = this.baseData.slice(-1);
    const resultData = cloneDeep(['xml'].includes(this.contentType) ? this.baseData : this.baseData.reverse().slice(1).reverse());
    const result = combineFunc[type](json2Table(data), resultData);
    // * 后处理
    const finalData = endParse([...result, ...emptyRow], this.contentType);
    this.baseDataChange.emit(finalData);
    this.handleCancel();
  }
}
