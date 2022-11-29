import { Injectable } from '@angular/core';
import { ApiParamsExtraSettingComponent } from '../../pages/api/http/edit/extra-setting/api-params-extra-setting.component';
import { ApiBodyType, ApiParamsTypeFormData, ApiParamsTypeJsonOrXml } from '../../shared/services/storage/index.model';
import { TableProSetting } from '../eo-ui/table-pro/table-pro.model';

@Injectable()
export class ApiTableService {
  modalService: any;
  constructor() {}
  showMore(inputArg, opts: { nzOnOk: (result: any) => void; changeFun; title: string }) {
    const modal = this.modalService.create({
      nzTitle: $localize`${opts.title} Detail`,
      nzContent: ApiParamsExtraSettingComponent,
      nzWidth: '60%',
      nzComponentParams: {
        model: JSON.parse(JSON.stringify(inputArg.item)),
      },
      nzOnOk() {
        if (opts.nzOnOk) {
          opts.nzOnOk({
            $index: inputArg.$index,
            item: modal.componentInstance.model,
          });
        }
        modal.destroy();
      },
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
        type: 'input',
        columnShow:'fixed',
        key: 'name',
        placeholder: $localize`Param Name`,
        width: 300,
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
        width: 120,
      },
      description: {
        title: $localize`:@@Description:Description`,
        type: 'input',
        key: 'description',
        placeholder: $localize`:@@Description:Description`,
        width: 150,
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
        width: 250,
        right: true,
        btns: [
          {
            action: 'insert',
          },
          {
            icon: 'more',
            click: () => {},
          },
          {
            action: 'delete',
          },
        ],
      },
      previewOperate: {
        type: 'btnList',
        width: 100,
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
            column.btns.splice(1, 0, { action: 'addChild' });
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
    console.log('initTable', result);
    return result;
  }
}
