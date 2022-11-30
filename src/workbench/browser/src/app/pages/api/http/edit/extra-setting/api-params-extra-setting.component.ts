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
  listConfBasicInfo = [
    {
      title: $localize`Param Name`,
      key: 'name',
    },
    {
      title: $localize`Type`,
      key: 'type',
    },
    {
      title: $localize`Required`,
      key: 'required',
      enums: [
        { title: $localize`Yes`, value: true },
        { title: $localize`No`, value: false },
      ],
    },
    {
      title: $localize`:@@Description:Description`,
      key: 'description',
    },
  ];
  listConfLenthInterval = [
    {
      title: $localize`Minimum length`,
      type: 'input',
      key: 'minLength',
      itemExpression: `min="0"`,
      inputType: 'number',
    },
    {
      title: $localize`Maximum Length`,
      type: 'input',
      key: 'maxLength',
      inputType: 'number',
    },
  ];
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
    // if (this.model && (!this.model.enum || !this.model.enum.length)) {
    //   this.model.enum = this.model.enum || [];
    //   this.model.enum.push(Object.assign({}, this.itemStructureEnums));
    // }
  }
}
