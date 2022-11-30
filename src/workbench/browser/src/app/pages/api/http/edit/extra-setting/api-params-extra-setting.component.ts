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
      placeholder: $localize`enum`
    },
    {
      title: $localize`Description`,
      type: 'input',
      key: 'description',
      placeholder: $localize`Description`,
    },
    {
      type: 'btnList',
      width:100,
      btns: [
        {
          action: 'delete'
        },
      ],
    },
  ];

  constructor() {}
  ngOnInit(): void {
    if (this.model[0] && (!this.model[0].enum || !this.model[0].enum.length)) {
      this.model[0].enum = this.model[0].enum || [];
    }
  }
}
