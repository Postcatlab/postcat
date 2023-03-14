import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { cloneDeep, toArray, merge, isEmpty } from 'lodash-es';
import { computed, observable, makeObservable, reaction } from 'mobx';
import { pcMerge } from 'pc/browser/src/app/shared/utils/pc-merge';
import qs from 'qs';

import { BodyParam } from '../../../../../../services/storage/db/models/apiData';
import { form2json, xml2json, isXML, json2Table } from '../../../../../../shared/utils/data-transfer/data-transfer.utils';
import { eoDeepCopy, whatType } from '../../../../../../shared/utils/index.utils';
import { ApiParamsTypeJsonOrXml } from '../../api.model';

const titleHash = new Map()
  .set('xml', $localize`Import XML`)
  .set('json', $localize`Import JSON`)
  .set('formData', $localize`Import Form-Data`)
  .set('header', $localize`Import Header`)
  .set('query', $localize`Import Query`);

const egHash = new Map()
  .set('xml', '<root><id>1</id><name>Jack</name></root>')
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
  @Input() contentType: 'json' | 'formData' | 'xml' | 'header' | 'query' = 'json';
  @Input() baseData: object[] = [];
  /**
   * Table item structure
   */
  @Input() itemStruecture?: BodyParam;
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
        this.autoPaste();
      }
    );
  }

  async autoPaste() {
    const clipText = await navigator.clipboard.readText();
    if (this.contentType === 'xml') {
      if (isXML(clipText)) {
        this.paramCode = clipText;
      }
    } else if (this.contentType === 'json') {
      try {
        JSON.parse(clipText);
        this.paramCode = clipText;
      } catch (error) {}
    } else if (['formData', 'header'].includes(this.contentType)) {
      const arr = form2json(clipText);
      console.log(arr);
      if (Array.isArray(arr) && arr.length && clipText.split(':').length > 1) {
        this.paramCode = clipText;
      }
    } else if (this.contentType === 'query') {
      const [data] = this.parseQuery(clipText);
      if (!isEmpty(data)) {
        this.paramCode = clipText;
      }
    }
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
      return [null, { msg: $localize`JSON format invalid`, data: null }];
    }
  }

  parseQuery(code) {
    const data = qs.parse(code.indexOf('?') > -1 ? code.split('?')[1] : code);
    return [{ data, rootType: 'object' }, null];
  }

  parseXML(code) {
    const status = isXML(code);
    if (!status) {
      return [null, { msg: $localize`XML format invalid`, data: null }];
    }
    try {
      const result = xml2json(code);
      return [{ data: result, rootType: 'object' }, null];
    } catch (error) {
      return [null, { msg: $localize`XML format invalid`, data: null }];
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
    if (err && 'msg' in err) {
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
        childList: data?.childList?.length ? array2obj(data.childList) : {}
      };
    };

    const obj2array = data =>
      Object.entries(data).map(([name, value]: any[]) => ({
        name,
        ...value,
        childList: value?.childList ? obj2array(value.childList) : []
      }));

    const combineFunc = {
      overwrite: data => data,
      append: (data, base) => base.concat(data),
      mixin: (data, base) => pcMerge(base, data, ['dataType', 'paramAttr.example'], 'childList', false)
    };

    const endParse = (data, type) => {
      if (['xml'].includes(type)) {
        const rootItem = data.at(0);
        rootItem.dataType = ApiParamsTypeJsonOrXml.object;
        rootItem.childList.push({ ...this.itemStruecture });
        return [rootItem];
      }
      return data;
    };

    const { data } = res;
    const emptyRow = this.baseData.slice(-1);

    // * this.baseData.slice(0,-1) for filter the last empty row
    const resultData = cloneDeep(['xml'].includes(this.contentType) ? this.baseData : this.baseData.slice(0, -1));
    const result = combineFunc[type](json2Table(data), resultData);
    // * 后处理
    const finalData = endParse([...result, ...emptyRow], this.contentType);
    this.baseDataChange.emit(finalData);
    this.handleCancel();
  }
}
