import { Component, OnInit, Input } from '@angular/core';
import {
  ApiParamsTypeJsonOrXml,
  ParamsEnum,
  BasiApiEditParams,
  REQURIED_ENUMS,
} from '../../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-edit-params-extra-setting',
  templateUrl: './api-params-extra-setting.component.html',
})
export class ApiParamsExtraSettingComponent implements OnInit {
  @Input() model: { type: string | ApiParamsTypeJsonOrXml } & BasiApiEditParams;
  @Input() isEdit = true;
  @Input() in: 'body' | 'header' | 'query' | 'rest';
  listConfBasicInfo;
  listConfLenthInterval = [
    {
      title: $localize`Minimum length`,
      type: 'inputNumber',
      key: 'minLength',
    },
    {
      title: $localize`Maximum Length`,
      type: 'inputNumber',
      key: 'maxLength',
    },
  ];
  listConfValueInterval = [
    {
      title: $localize`Minimum`,
      type: 'inputNumber',
      key: 'minimum',
    },
    {
      title: $localize`Maximum`,
      type: 'inputNumber',
      key: 'maximum',
    },
  ];

  itemStructureEnums: ParamsEnum = {
    value: '',
    description: '',
  };
  listConfEnums = [
    {
      title: $localize`Value Enum`,
      type: 'input',
      key: 'value',
      placeholder: $localize`enum`,
    },
    {
      title: $localize`Description`,
      type: 'input',
      key: 'description',
      placeholder: $localize`Description`,
    },
    {
      type: 'btnList',
      width: 100,
      btns: [
        {
          action: 'delete',
        },
      ],
    },
  ];

  constructor() {}
  ngOnInit(): void {
    this.listConfBasicInfo = [
      {
        title: $localize`Param Name`,
        key: 'name',
      },
      ...(this.in === 'body'
        ? [
            {
              title: $localize`Type`,
              key: 'type',
            },
          ]
        : []),
      {
        title: $localize`Required`,
        key: 'required',
        enums: REQURIED_ENUMS,
      },
      {
        title: $localize`:@@Description:Description`,
        key: 'description',
      },
    ];
    if (!this.isEdit) {
      ['listConfValueInterval', 'listConfEnums', 'listConfValueInterval'].forEach((configName) => {
        this[configName].forEach((column, index) => {
          //Change edit to preview
          if (['inputNumber', 'input'].includes(column.type)) {
            column.type = 'text';
          }
          const hiddenOperate = !this.isEdit && column.type === 'btnlist';
          if (hiddenOperate) {
            this[configName].splice(index, 1);
          }
        });
      });
    }
    if (this.model[0] && (!this.model[0].enum || !this.model[0].enum.length)) {
      this.model[0].enum = this.model[0].enum || [];
    }
  }
}
