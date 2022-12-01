import { Injectable } from '@angular/core';
import { omit } from 'lodash-es';
import { ApiParamsExtraSettingComponent } from '../../pages/api/http/edit/extra-setting/api-params-extra-setting.component';
import { ModalService } from '../../shared/services/modal.service';
import { ApiBodyType, ApiParamsTypeFormData, ApiParamsTypeJsonOrXml, REQURIED_ENUMS } from '../../shared/services/storage/index.model';
import { TableProSetting } from '../eo-ui/table-pro/table-pro.model';

@Injectable()
export class ApiTableService {
  constructor(private modalService: ModalService) {}
  showMore(item) {
    return new Promise((resolve) => {
      const modal = this.modalService.create({
        nzTitle: $localize`Advanced Settings`,
        nzContent: ApiParamsExtraSettingComponent,
        nzWidth: '60%',
        nzComponentParams: {
          model: [omit(item, ['children'])],
        },
        nzOnOk() {
          resolve(modal.componentInstance.model);
          modal.destroy();
        },
      });
    });
  }
  initTable(
    inArg: {
      in: 'body' | 'header' | 'query' | 'rest';
      module?: 'test' | 'edit' | 'preview';
      isEdit: boolean;
      where?: 'request' | 'response';
      format?: ApiBodyType;
    },
    opts: any = {}
  ): { columns: any[]; setting: TableProSetting } {
    const columnMUI = {
      name: {
        title: $localize`Param Name`,
        left: true,
        type: 'input',
        columnVisible: 'fixed',
        key: 'name',
        placeholder: $localize`Param Name`,
        width: 150,
      },
      type: {
        title: $localize`Type`,
        type: 'select',
        key: 'type',
        width: 120,
      },
      required: {
        title: $localize`Required`,
        type: 'checkbox',
        key: 'required',
        width: 100,
        enums: REQURIED_ENUMS
      },
      description: {
        title: $localize`:@@Description:Description`,
        type: 'input',
        key: 'description',
        placeholder: $localize`:@@Description:Description`,
        width: 300,
      },
      example: {
        title: $localize`Example`,
        type: 'input',
        key: 'example',
        placeholder: $localize`Example`,
        width: 200,
      },
      editOperate: {
        type: 'btnList',
        right: true,
        btns: [
          {
            action: 'insert',
          },
          {
            icon: 'more',
            title: $localize`Advanced Settings`,
            click: (item) => {
              this.showMore(item.data).then((res) => {
                Object.assign(item.data, res[0]);
                if (!opts.changeFn) {
                  console.error('changeFn is not defined');
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
            click: () => {},
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
            column.btns.unshift({ action: 'addChild' });
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
}
