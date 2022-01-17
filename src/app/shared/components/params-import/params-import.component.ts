import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { whatType } from '../../../utils';
import { flatData, form2json, xml2json, parseTree } from '../../../utils/tree';
@Component({
  selector: 'params-import',
  templateUrl: './params-import.component.html',
  styleUrls: ['./params-import.component.scss'],
})
export class ParamsImportComponent {
  @Input() rootType: 'array' | string | 'object' = 'object';
  @Input() contentType = 'json';
  @Input() baseData: object[] = [];
  @Output() baseDataChange = new EventEmitter<any>();
  isVisible = false;
  paramCode = '';

  constructor(private message: NzMessageService) {}

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

  get contenTypeEditor() {
    switch (this.contentType) {
      case 'formData':
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
    let paramCode = null;
    if (this.contentType === 'json') {
      try {
        paramCode = JSON.parse(this.paramCode);
      } catch (error) {
        this.message.error('JSON格式不合法');
        return;
      }
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
      const data: any[] = xml2json(this.paramCode);
      const res = {};
      const mapAttr = (data: any) => {
        const { tagName, attr, children } = data;
        return {
          [tagName]: children.length ? mapAttr(children[0]) : attr,
        };
      };
      data.forEach((it) => {
        const { tagName, attr, children } = it;
        res[tagName] = children.length ? mapAttr(children[0]) : attr;
      });
      paramCode = JSON.parse(JSON.stringify(res));
    }
    if (this.contentType === 'raw') {
      paramCode = this.paramCode;
    }

    const tailData = this.baseData.slice(-1);
    let resultData = JSON.parse(JSON.stringify(this.baseData.reverse().slice(1).reverse()));
    if (this.rootType !== whatType(paramCode)) {
      // TODO Perhaps should be handled about format compatibility later.
      console.warn('The code that you input is no-equal to the root type.');
    }
    // if (whatType(paramCode) === 'object') {
    // * transform to array of table format.
    // }
    if (this.rootType === 'array' && whatType(paramCode) === 'array') {
      // * only select first data
      const [data] = paramCode;
      paramCode = data || {};
    }
    // * tree to array for table render
    const cacheData = flatData(Object.keys(paramCode).map((it) => parseTree(it, paramCode[it])));
    console.log(
      JSON.stringify(
        Object.keys(paramCode).map((it) => parseTree(it, paramCode[it])),
        null,
        2
      )
    );
    // TODO delete useless attribute in cacheData
    switch (type) {
      case 'mixin': {
        const nameList = resultData.map((it) => it.name);
        const data = cacheData.filter((it) => !nameList.includes(it.name));
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

    this.baseDataChange.emit(resultData.concat(tailData));
    this.handleCancel();
  }

  handleCancel(): void {
    this.paramCode = '';
    this.isVisible = false;
  }
}
