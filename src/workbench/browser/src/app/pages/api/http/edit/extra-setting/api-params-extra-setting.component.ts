import { Component, OnInit, Input } from '@angular/core';
import {
  ApiParamsTypeJsonOrXml,
  ParamsEnum,
  BasiApiEditParams,
} from '../../../../../shared/services/storage/index.model';

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
        thKey: $localize`Param Name`,
        type: 'text',
        modelKey: 'name',
      },
      {
        thKey: $localize`Required`,
        type: 'html',
        html: '{{item.required?"True":"False"}}',
        class: 'w_100',
      },
      {
        thKey: $localize`:@@Description:Description`,
        type: 'text',
        modelKey: 'description',
      },
      {
        thKey: $localize`Type`,
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
        thKey: $localize`Minimum length`,
        type: 'input',
        modelKey: 'minLength',
        class: 'w_50percent',
        itemExpression: `min="0"`,
        inputType: 'number',
      },
      {
        thKey: $localize`Maximum Length`,
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
        thKey: $localize`Minimum`,
        type: 'input',
        modelKey: 'minimum',
        class: 'w_50percent',
        itemExpression: `min="0"`,
        inputType: 'number',
      },
      {
        thKey: $localize`Maximum`,
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
        thKey: $localize`Default`,
        type: 'radio',
        modelKey: 'default',
        isCanBeCancle: true,
        class: 'w_80',
      },
      {
        thKey: $localize`Value enum`,
        type: 'input',
        modelKey: 'value',
        placeholder: $localize`enum`,
        itemExpression: `ng-class="{'eo-input-error':!item.value&&item.description}"`,
      },
      {
        thKey: $localize`Description`,
        type: 'input',
        modelKey: 'description',
        placeholder: $localize`Description`,
      },
      {
        type: 'btn',
        class: 'w_250',
        btnList: [
          {
            key: $localize`:@@Delete:Delete`,
            operateName: 'delete',
          },
        ],
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
