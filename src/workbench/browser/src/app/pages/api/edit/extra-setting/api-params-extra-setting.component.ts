import { Component, OnInit, Input } from '@angular/core';
import { ApiParamsTypeJsonOrXml, ParamsEnum, BasiApiEditParams } from '../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-edit-params-extra-setting',
  templateUrl: './api-params-extra-setting.component.html',
  styleUrls: ['./api-params-extra-setting.component.scss'],
})
export class ApiParamsExtraSettingComponent implements OnInit {
  @Input() model: { type: string | ApiParamsTypeJsonOrXml } & BasiApiEditParams;
  listConfBasicInfo = {
    setting: {
      readonly: true,
    },
    tdList: [
      {
        thKey: '参数名',
        type: 'text',
        modelKey: 'name',
      },
      {
        thKey: '必填',
        type: 'html',
        html: '{{item.required?"是":"否"}}',
        class: 'w_100',
      },
      {
        thKey: '说明',
        type: 'text',
        modelKey: 'description',
      },
      {
        thKey: '类型',
        type: 'text',
        modelKey: 'type',
      },
    ],
  };
  listConfLenthInterval = {
    setting: {
      munalAddRow: true,
    },
    tdList: [
      {
        thKey: '最小长度',
        type: 'input',
        modelKey: 'minLength',
        class: 'w_50percent',
        itemExpression: `min="0"`,
        inputType: 'number',
      },
      {
        thKey: '最大长度',
        type: 'input',
        modelKey: 'maxLength',
        itemExpression: `min="0"`,
        inputType: 'number',
      },
    ],
  };
  listConfValueInterval = {
    setting: {
      munalAddRow: true,
    },
    tdList: [
      {
        thKey: '最小值',
        type: 'input',
        modelKey: 'minimum',
        class: 'w_50percent',
        itemExpression: `min="0"`,
        inputType: 'number',
      },
      {
        thKey: '最大值',
        type: 'input',
        modelKey: 'maximum',
        itemExpression: `min="0"`,
        inputType: 'number',
      },
    ],
  };
  itemStructureEnums: ParamsEnum = {
    default: false,
    value: '',
    description: '',
  };
  listConfEnums = {
    setting: {},
    itemStructure: this.itemStructureEnums,
    tdList: [
      {
        thKey: '默认',
        type: 'radio',
        modelKey: 'default',
        isCanBeCancle: true,
        class: 'w_50',
      },
      {
        thKey: '参数值可能性',
        type: 'input',
        modelKey: 'value',
        placeholder: '枚举值',
        itemExpression: `ng-class="{'eo-input-error':!item.value&&item.description}"`,
      },
      {
        thKey: '说明',
        type: 'input',
        modelKey: 'description',
        placeholder: '值说明',
      },
    ],
  };

  constructor() {}
  ngOnInit(): void {
    if (this.model && (!this.model.enum || !this.model.enum.length)) {
      this.model.enum = this.model.enum || [];
      this.model.enum.push(Object.assign({}, this.itemStructureEnums));
    }
  }
}
