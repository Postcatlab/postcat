import { Injectable } from '@angular/core';
import { has, omit } from 'lodash-es';
import { ApiParamsExtraSettingComponent } from '../../pages/api/http/edit/extra-setting/api-params-extra-setting.component';
import { ApiTestParamsTypeFormData } from '../../pages/api/service/api-test/api-test.model';
import { ModalOptions, ModalService } from '../../shared/services/modal.service';
import {
  ApiBodyType,
  ApiParamsTypeFormData,
  ApiParamsTypeJsonOrXml,
  REQURIED_ENUMS,
} from '../../shared/services/storage/index.model';
import { eoDeepCopy } from '../../utils/index.utils';
import { filterTableData } from '../../utils/tree/tree.utils';
import { TableProSetting } from '../eo-ui/table-pro/table-pro.model';

@Injectable()
export class ApiTableService {
  constructor(private modalService: ModalService) {}
  showMore(item, opts: { in: string; isEdit: boolean }) {
    return new Promise((resolve) => {
      const modalConf: ModalOptions = {
        nzTitle: $localize`More Settings`,
        nzContent: ApiParamsExtraSettingComponent,
        nzWidth: '60%',
        nzComponentParams: {
          in: opts.in,
          model: [omit(item, ['children'])],
          isEdit: opts.isEdit,
        },
      };
      if (opts.isEdit) {
        modalConf.nzOnOk = () => {
          const model = eoDeepCopy(modal.componentInstance.model[0]);
          model.enum = filterTableData(model.enum, {
            primaryKey: 'value',
          });
          resolve(model);
          modal.destroy();
        };
      } else {
        modalConf.nzFooter = [
          {
            label: $localize`Cancel`,
            onClick: () => {
              modal.destroy();
            },
          },
        ];
      }
      const modal = this.modalService.create(modalConf);
    });
  }
  initTable(
    inArg: {
      in: 'body' | 'header' | 'query' | 'rest';
      module?: 'edit' | 'preview';
      isEdit: boolean;
      where?: 'request' | 'response';
      format?: ApiBodyType;
    },
    opts: any = {}
  ): { columns: any[]; setting: TableProSetting } {
    const columnMUI = {
      name: {
        title: inArg.in === 'header' ? $localize`:@@HeaderName:Key` : $localize`:@@ParamName:Name`,
        left: true,
        type: 'input',
        columnVisible: 'fixed',
        key: 'name',
        width: 150,
      },
      type: {
        title: $localize`Type`,
        type: 'select',
        key: 'type',
        disabledFn:inArg.format===ApiBodyType.XML?(item,data)=>data.level===0:undefined,
        width: 120,
      },
      required: {
        title: $localize`Required`,
        type: 'checkbox',
        key: 'required',
        width: 100,
        enums: REQURIED_ENUMS,
      },
      description: {
        title: $localize`:@@Description:Description`,
        type: 'input',
        key: 'description',
        width: 250,
      },
      example: {
        title: $localize`Example`,
        type: 'input',
        key: 'example',
        width: 200,
      },
      editOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            icon: 'more',
            title: $localize`More Settings`,
            click: (item) => {
              this.showMore(item.data, {
                in: inArg.in,
                isEdit: true,
              }).then((res) => {
                Object.assign(item.data, res);
                if (!opts.changeFn) {
                  console.warn('Advance Sttings need changeFn is not defined');
                  return;
                }
                opts.changeFn();
              });
            },
          },
          {
            action: 'delete',
          },
        ],
      },
      previewOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            icon: 'more',
            showFn: ({ data }) =>
              data.enum?.length || data.minimum || data.maximum || data.maxLength || data.minLength || data.example,
            title: $localize`More Settings`,
            click: (item) => {
              this.showMore(item.data, {
                in: inArg.in,
                isEdit: false,
              });
            },
          },
        ],
      },
    };
    const result = {
      columns: [],
      setting: {
        primaryKey: 'name',
        manualAdd: opts.manualAdd,
        rowSortable: inArg.isEdit ? true : false,
        isLevel: inArg.in !== 'body' || inArg.format === ApiBodyType['Form-data'] ? false : true,
        toolButton: {
          columnVisible: true,
          fullScreen: true,
        },
      },
    };
    let columnsArr = [];
    switch (inArg.in) {
      case 'body': {
        columnsArr = ['name', 'type', 'required', 'description', 'example'];
        break;
      }
      default: {
        columnsArr = ['name', 'required', 'description', 'example'];
        break;
      }
    }
    columnsArr.push(inArg.module === 'preview' ? 'previewOperate' : 'editOperate');
    const types = inArg.format === ApiBodyType['Form-data'] ? ApiParamsTypeFormData : ApiParamsTypeJsonOrXml;
    result.columns = columnsArr.map((keyName) => {
      const column = columnMUI[keyName];
      if (!column) {
        throw new Error(`[EO_ERROR]columnMUI not found ${keyName}`);
      }
      switch (keyName) {
        case 'type': {
          column.enums = Object.keys(types).map((val) => ({
            title: val,
            value: types[val],
          }));
          break;
        }
        case 'editOperate': {
          if (result.setting.isLevel) {
            const insert: any = {
              action: 'insert',
            };
            if (inArg.format === 'xml') {
              insert.showFn = (item) =>item.level!==0;
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
      format?: 'Form-data';
    },
    opts: any = {}
  ) {
    const columnMUI = {
      name: {
        title: $localize`Name`,
        left: true,
        type: 'input',
        columnVisible: 'fixed',
        disabledFn:inArg.in==='header'?(item) => has(item,'editable')&&!item.editable:undefined,
        key: 'name',
        width: 150,
      },
      type: {
        title: $localize`Type`,
        type: 'select',
        key: 'type',
        width: 120,
      },
      required: {
        type: 'checkbox',
        key: 'required',
        width: 30,
        enums: REQURIED_ENUMS,
      },
      value: {
        title: $localize`Value`,
        type: 'input',
        key: 'value',
        width: 200,
      },
      editOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            action: 'delete',
          },
        ],
      },
    };
    const result = {
      columns: [],
      setting: {
        primaryKey: 'name',
        manualAdd: opts.manualAdd,
        rowSortable: true,
        isLevel: false,
        toolButton: {
          fullScreen: true,
        },
      },
    };
    let columnsArr = [];
    switch (inArg.in) {
      case 'body': {
        columnsArr = ['required', 'name', 'type', 'value', 'editOperate'];
        break;
      }
      default: {
        columnsArr = ['required', 'name', 'value', 'editOperate'];
        break;
      }
    }
    const types = ApiTestParamsTypeFormData;
    result.columns = columnsArr.map((keyName) => {
      const column = columnMUI[keyName];
      if (!column) {
        throw new Error(`[EO_ERROR]columnMUI not found ${keyName}`);
      }
      switch (keyName) {
        case 'type': {
          column.enums = Object.keys(types).map((val) => ({
            title: val,
            value: types[val],
          }));
          break;
        }
        case 'editOperate': {
          if (result.setting.isLevel) {
            column.btns.unshift(
              { action: 'addChild' },
              {
                action: 'insert',
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
