import { Injectable } from '@angular/core';
import { has, omit } from 'lodash-es';

import { ApiParamsExtraSettingComponent } from '../../pages/workspace/project/api/http/edit/extra-setting/api-params-extra-setting.component';
import { ApiTestParamsTypeFormData } from '../../pages/workspace/project/api/http/test/api-test.model';
import { REQURIED_ENUMS } from '../../shared/models/shared.model';
import { ModalOptions, ModalService } from '../../shared/services/modal.service';
import { BodyParam } from '../../shared/services/storage/db/models/apiData';
import { eoDeepCopy, JSONParse } from '../../utils/index.utils';
import { filterTableData } from '../../utils/tree/tree.utils';
import { ColumnItem, TableProSetting } from '../eo-ui/table-pro/table-pro.model';
import { ApiBodyType, ApiParamsTypeByNumber, ApiParamsTypeFormData, ApiParamsTypeJsonOrXml, DEFAULT_HEADER } from './api.model';
@Injectable()
export class ApiTableService {
  constructor(private modalService: ModalService) {}
  showMore(item, opts: { in: string; isEdit: boolean }) {
    return new Promise(resolve => {
      item = eoDeepCopy(omit(item, ['childList']));
      item.paramAttr = item.paramAttr || {};
      item.paramAttr.paramValueList = JSONParse(item.paramAttr.paramValueList, []);
      const modalConf: ModalOptions = {
        nzTitle: $localize`More Settings`,
        nzContent: ApiParamsExtraSettingComponent,
        nzWidth: '60%',
        nzComponentParams: {
          in: opts.in,
          model: item,
          isEdit: opts.isEdit
        }
      };
      if (opts.isEdit) {
        modalConf.nzOnOk = () => {
          const model = eoDeepCopy(modal.componentInstance.model);
          model.paramAttr.paramValueList = JSON.stringify(
            filterTableData(model.paramAttr.paramValueList, {
              primaryKey: 'value'
            })
          );
          resolve(model);
          modal.destroy();
        };
      } else {
        modalConf.nzFooter = [
          {
            label: $localize`Cancel`,
            onClick: () => {
              modal.destroy();
            }
          }
        ];
      }
      const modal = this.modalService.create(modalConf);
    });
  }
  initTable(
    inArg: {
      id: string;
      in: 'body' | 'header' | 'query' | 'rest';
      module?: 'edit' | 'preview';
      isEdit: boolean;
      where?: 'request' | 'response';
      format?: ApiBodyType;
    },
    opts: any = {}
  ): { columns: ColumnItem[]; setting: TableProSetting } {
    const columnMUI = {
      name: {
        title: inArg.in === 'header' ? $localize`:@@HeaderName:Key` : $localize`:@@ParamName:Name`,
        left: true,
        type: 'input',
        columnVisible: 'fixed',
        key: 'name'
      },
      dataType: {
        title: $localize`Type`,
        type: 'select',
        key: 'dataType',
        filterable: inArg.isEdit ? false : true,
        disabledFn: inArg.format === ApiBodyType.XML ? (item, data) => data.level === 0 : undefined,
        enums: ApiParamsTypeByNumber
      },
      isRequired: {
        title: $localize`Required`,
        type: 'checkbox',
        key: 'isRequired',
        filterable: inArg.isEdit ? false : true,
        enums: REQURIED_ENUMS,
        width: 120
      },
      description: {
        title: $localize`:@@Description:Description`,
        type: 'input',
        key: 'description'
      },
      example: {
        title: $localize`Example`,
        type: 'input',
        key: 'paramAttr.example'
      },
      editOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            icon: 'more',
            title: $localize`More Settings`,
            click: item => {
              this.showMore(item.data, {
                in: inArg.in,
                isEdit: true
              }).then(res => {
                Object.assign(item.data, res);
                if (!opts.changeFn) {
                  pcConsole.warn('Advance Sttings need changeFn is not defined');
                  return;
                }
                opts.changeFn();
              });
            }
          },
          {
            action: 'delete'
          }
        ]
      },
      previewOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            icon: 'more',
            showFn: ({ data }: { data: BodyParam }) =>
              data.paramAttr.paramValueList?.length ||
              data.paramAttr.minValue ||
              data.paramAttr.maxValue ||
              data.paramAttr.maxLength ||
              data.paramAttr.minLength ||
              data.paramAttr.example,
            title: $localize`More Settings`,
            click: item => {
              this.showMore(item.data, {
                in: inArg.in,
                isEdit: false
              });
            }
          }
        ]
      }
    };
    const result = {
      columns: [],
      setting: {
        id: inArg.id,
        primaryKey: 'name',
        manualAdd: opts.manualAdd,
        showBtnWhenHoverRow: inArg.isEdit ? false : true,
        rowSortable: inArg.isEdit ? true : false,
        isLevel: inArg.in !== 'body' || inArg.format === ApiBodyType['FormData'] ? false : true,
        toolButton: {
          columnVisible: true
        }
      }
    };
    let columnsArr = [];
    switch (inArg.in) {
      case 'body': {
        columnsArr = ['name', 'dataType', 'isRequired', 'description', 'example'];
        break;
      }
      default: {
        columnsArr = ['name', 'isRequired', 'description', 'example'];
        break;
      }
    }
    columnsArr.push(inArg.module === 'preview' ? 'previewOperate' : 'editOperate');
    const types = inArg.format === ApiBodyType['FormData'] ? ApiParamsTypeFormData : ApiParamsTypeJsonOrXml;
    result.columns = columnsArr.map(keyName => {
      const column = columnMUI[keyName];
      if (!column) {
        throw new Error(`EO_ERROR: columnMUI not found ${keyName}`);
      }
      switch (keyName) {
        case 'name': {
          if (inArg.in === 'header' && inArg.isEdit) {
            column.type = 'autoComplete';
            column.enums = DEFAULT_HEADER.map(val => ({ title: val.title, value: val.title }));
          }
          break;
        }
        case 'type': {
          column.enums = Object.keys(types).map(val => ({
            title: val,
            value: types[val]
          }));
          break;
        }
        case 'editOperate': {
          if (result.setting.isLevel) {
            const insert: any = {
              action: 'insert'
            };
            if (inArg.format === ApiBodyType.XML) {
              insert.showFn = item => item.level !== 0;
            }
            column.btns.unshift({ action: 'addChild' }, insert);
          }
          break;
        }
      }
      switch (column.type) {
        case 'input':
        case 'select':
        case 'checkbox': {
          if (!inArg.isEdit) {
            column.type = 'text';
          }
          break;
        }
      }
      return column;
    });
    return result;
  }
  initTestTable(
    inArg: {
      in: 'body' | 'header' | 'query' | 'rest';
      format?: 'FormData';
    },
    opts: any = {}
  ): { columns: ColumnItem[]; setting: TableProSetting } {
    const columnMUI = {
      name: {
        title: $localize`Name`,
        left: true,
        type: 'input',
        columnVisible: 'fixed',
        disabledFn: inArg.in === 'header' ? item => has(item, 'editable') && !item.editable : undefined,
        key: 'name'
      },
      type: {
        title: $localize`Type`,
        type: 'select',
        key: 'type',
        width: 150
      },
      isRequired: {
        type: 'checkbox',
        left: true,
        key: 'isRequired',
        enums: REQURIED_ENUMS
      },
      value: {
        title: $localize`Value`,
        type: 'input',
        key: 'paramAttr.example'
      },
      editOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            action: 'delete'
          }
        ]
      }
    };
    const result = {
      columns: [],
      setting: {
        primaryKey: 'name',
        manualAdd: opts.manualAdd,
        rowSortable: true,
        isLevel: false,
        toolButton: {}
      }
    };
    let columnsArr = [];
    switch (inArg.in) {
      case 'body': {
        columnsArr = ['isRequired', 'name', 'type', 'value', 'editOperate'];
        break;
      }
      default: {
        columnsArr = ['isRequired', 'name', 'value', 'editOperate'];
        break;
      }
    }
    const types = ApiTestParamsTypeFormData;
    result.columns = columnsArr.map(keyName => {
      const column = columnMUI[keyName];
      if (!column) {
        throw new Error(`EO_ERROR: columnMUI not found ${keyName}`);
      }
      switch (keyName) {
        case 'name': {
          if (inArg.in === 'header') {
            column.type = 'autoComplete';
            column.enums = DEFAULT_HEADER.map(val => ({ title: val.title, value: val.title }));
          }
          break;
        }
        case 'type': {
          column.enums = Object.keys(types).map(val => ({
            title: val,
            value: types[val]
          }));
          break;
        }
        case 'editOperate': {
          if (result.setting.isLevel) {
            column.btns.unshift(
              { action: 'addChild' },
              {
                action: 'insert'
              }
            );
          }
          break;
        }
      }
      return column;
    });
    return result;
  }
}
