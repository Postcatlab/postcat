import { Component, OnInit, Input } from '@angular/core';
import { isNil } from 'ng-zorro-antd/core/util';
import { ColumnItem } from 'pc/browser/src/app/components/eo-ui/table-pro/table-pro.model';
import { ParamsEnum, ApiParamsTypeByNumber, ApiParamsType } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { BodyParam } from 'pc/browser/src/app/services/storage/db/dto/apiData.dto';
import { REQURIED_ENUMS } from 'pc/browser/src/app/shared/models/shared.model';

import { cpSync } from 'fs';

@Component({
  selector: 'eo-api-edit-params-extra-setting',
  templateUrl: './api-params-extra-setting.component.html',
  styleUrls: ['./api-params-extra-setting.component.scss']
})
export class ApiParamsExtraSettingComponent implements OnInit {
  @Input() model: BodyParam;
  @Input() isEdit = true;
  @Input() in: 'body' | 'header' | 'query' | 'rest';
  showValueTable = false;
  showLengthTable = false;
  showEnums = true;
  listConfBasicInfo;
  listConfLenthInterval: ColumnItem[] = [
    {
      title: $localize`Minimum length`,
      type: 'inputNumber',
      key: 'minLength'
    },
    {
      title: $localize`Maximum Length`,
      type: 'inputNumber',
      key: 'maxLength'
    }
  ];
  listConfValueInterval: ColumnItem[] = [
    {
      title: $localize`Minimum`,
      type: 'inputNumber',
      key: 'minValue'
    },
    {
      title: $localize`Maximum`,
      type: 'inputNumber',
      key: 'maxValue'
    }
  ];
  itemStructureEnums: ParamsEnum = {
    value: '',
    description: ''
  };
  listConfEnums: ColumnItem[] = [
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
      placeholder: $localize`Description`
    },
    {
      type: 'btnList',
      width: 100,
      btns: [
        {
          action: 'delete'
        }
      ]
    }
  ];

  constructor() {}
  initBasicListConf() {
    this.listConfBasicInfo = [
      {
        title: $localize`Param Name`,
        key: 'name'
      },
      ...(this.in === 'body'
        ? [
            {
              title: $localize`Type`,
              key: 'dataType',
              enums: ApiParamsTypeByNumber
            }
          ]
        : []),
      {
        title: $localize`Required`,
        key: 'isRequired',
        enums: REQURIED_ENUMS
      },
      {
        title: $localize`:@@Description:Description`,
        key: 'description'
      }
    ];
  }
  transferPreviewTable() {
    ['listConfLenthInterval', 'listConfEnums', 'listConfValueInterval'].forEach(configName => {
      this[configName].forEach((column, index) => {
        //Change edit to preview
        if (column.type === 'btnList') {
          this[configName].splice(index, 1);
          return;
        }
        if (['inputNumber', 'input'].includes(column.type)) {
          column.type = 'text';
        }
      });
    });
  }
  ngOnInit(): void {
    this.initBasicListConf();
    if (!this.isEdit) {
      this.transferPreviewTable();
    }
    //Init Enum List
    if (this.isEdit && this.model?.paramAttr?.paramValueList && !this.model?.paramAttr?.paramValueList.length) {
      this.model.paramAttr.paramValueList = this.model.paramAttr.paramValueList || [];
    }
    //Set Length/Value preview
    if (this.in !== 'body') {
      this.showLengthTable = false;
      this.showValueTable = false;
    } else {
      if (this.isEdit) {
        this.showLengthTable = [ApiParamsType.string].includes(this.model.dataType);
        this.showValueTable = [
          ApiParamsType.int,
          ApiParamsType.float,
          ApiParamsType.double,
          ApiParamsType.short,
          ApiParamsType.long,
          ApiParamsType.number
        ].includes(this.model.dataType);
        this.showEnums = ![ApiParamsType.null, ApiParamsType.boolean].includes(this.model.dataType);
      } else {
        this.showLengthTable = !isNil(this.model.paramAttr.minLength || this.model.paramAttr.maxLength);
        this.showValueTable = !isNil(this.model.paramAttr.minValue || this.model.paramAttr.maxValue);
        this.showEnums = this.model.paramAttr?.paramValueList?.length;
      }
    }
  }
}
