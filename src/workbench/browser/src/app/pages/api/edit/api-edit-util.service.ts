import { Injectable } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { ApiParamsExtraSettingComponent } from './extra-setting/api-params-extra-setting.component';
import { listToTreeHasLevel } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { ApiData } from '../../../shared/services/storage/index.model';
@Injectable()
export class ApiEditUtilService {
  constructor(private modalService: ModalService) {}
  showMore(inputArg, opts: { nzOnOk: (result: any) => void; changeFun; title: string }) {
    const modal = this.modalService.create({
      nzTitle: $localize`${opts.title} Detail`,
      nzContent: ApiParamsExtraSettingComponent,
      nzClosable: false,
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
  initListConf(opts) {
    opts.title = opts.title || $localize`Param`;
    return {
      setting: {
        draggable: true,
        dragCacheVar: opts.dragCacheVar || 'DRAG_VAR_API_EDIT_PARAM',
      },
      baseFun: {
        watchCheckboxChange: opts.watchFormLastChange,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          type: 'html',
          thKey: '',
          html: '<span class="eo-status-tips iconfont icon-jiahao"></span><span sv-group-handle></span>',
          class: 'static_td_hpiae w_20',
          itemExpression: 'ng-if="$index+1===$ctrl.list.length"',
        },
        {
          type: 'sort',
          itemExpression: 'ng-if="$index+1!==$ctrl.list.length"',
        },
        {
          thKey: opts.nameTitle || $localize`${opts.title} Name`,
          type: 'input',
          modelKey: 'name',
          placeholder: opts.nameTitle || $localize`${opts.title} Name`,
          width: 300,
          mark: 'name',
        },
        {
          thKey: $localize`Required`,
          type: 'checkbox',
          modelKey: 'required',
          mark: 'require',
          width: 100,
        },
        {
          thKey: $localize`:@@Description:Description`,
          type: 'input',
          modelKey: 'description',
          placeholder: $localize`${opts.title} Description`,
          width: 200,
          mark: 'description',
        },
        {
          thKey: $localize`Example`,
          type: 'input',
          modelKey: 'example',
          placeholder: $localize`${opts.title} Example`,
          width: 200,
          mark: 'example',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
            {
              key: $localize`More Settings`,
              operateName: 'more',
              param: `inputArg`,
              itemExpression: `eo-attr-tip-placeholder="more_setting_btn" `,
              fun: (inputArg) => {
                this.showMore(inputArg, {
                  nzOnOk: opts.nzOnOkMoreSetting,
                  changeFun: opts.watchFormLastChange,
                  title: opts.title,
                });
              },
            },
            {
              key: $localize`Insert`,
              operateName: 'insert',
              itemExpression: `eo-attr-tip-placeholder="insert_param_btn"`,
            },
            {
              key: $localize`:@@Delete:Delete`,
              operateName: 'delete',
            },
          ],
        },
      ],
    };
  }
  initBodyListConf(opts) {
    const reduceItemWhenIsOprDepth = (inputItem) => {
      switch (inputItem.type) {
        case 'json':
        case 'array':
        case 'object': {
          break;
        }
        default: {
          inputItem.type = 'object';
        }
      }
      return true;
    };
    return {
      setting: {
        draggableWithSelect: true,
        draggable: true,
        dragCacheVar: 'DRAG_VAR_API_EDIT_BODY',
      },
      baseFun: {
        watchCheckboxChange: opts.watchFormLastChange,
        sortIn: reduceItemWhenIsOprDepth,
        reduceItemWhenAddChildItem: reduceItemWhenIsOprDepth,
      },
      itemStructure: opts.itemStructure,
      tdList: [
        {
          type: 'html',
          thKey: '',
          html: '<span class="eo-status-tips iconfont icon-jiahao"></span><span sv-group-handle></span>',
          class: 'static_td_hpiae w_20',
          itemExpression: 'ng-if="$index+1===$ctrl.list.length"',
        },
        {
          type: 'sort',
          itemExpression: 'ng-if="$index+1!==$ctrl.list.length"',
        },
        {
          thKey: $localize`Param Name`,
          type: 'depthInput',
          modelKey: 'name',
          placeholder: $localize`Param Name`,
          width: 200,
          mark: 'name',
        },
        {
          thKey: $localize`Type`,
          type: 'select',
          key: 'key',
          value: 'value',
          class: 'drag_select_conatiner',
          initialData: 'item.type',
          selectQuery: [],
          modelKey: 'type',
          mark: 'type',
          width: 100,
        },
        {
          thKey: $localize`Required`,
          type: 'checkbox',
          modelKey: 'required',
          width: 100,
          mark: 'require',
        },
        {
          thKey: $localize`:@@Description:Description`,
          type: 'input',
          modelKey: 'description',
          placeholder: $localize`Param Description`,
          width: 300,
          mark: 'description',
        },

        {
          thKey: $localize`Example`,
          type: 'input',
          modelKey: 'example',
          placeholder: $localize`Param Example`,
          width: 100,
          mark: 'example',
        },
        {
          type: 'btn',
          class: 'w_300',
          btnList: [
            {
              key: $localize`Add Child`,
              operateName: 'addChild',
              itemExpression: `ng-if="$ctrl.mainObject.setting.isLevel"`,
            },
            {
              key: $localize`More Settings`,
              operateName: 'more',
              fun: (inputArg) => {
                this.showMore(inputArg, {
                  changeFun: opts.watchFormLastChange,
                  nzOnOk: opts.nzOnOkMoreSetting,
                  title: opts.title,
                });
              },
              param: `inputArg`,
              itemExpression: `eo-attr-tip-placeholder="more_setting_btn" `,
            },
            {
              key: $localize`Insert`,
              operateName: 'insert',
              itemExpression: `ng-if="!($ctrl.mainObject.setting.munalHideOperateColumn&&$first)"`,
            },
            {
              key: $localize`:@@Delete:Delete`,
              operateName: 'delete',
              itemExpression: 'ng-if="!($ctrl.mainObject.setting.munalHideOperateColumn&&$first)"',
            },
          ],
        },
      ],
    };
  }
  private formatApiData(formData, filterArrFun): ApiData {
    const result = structuredClone(formData);
    result.groupID = Number(result.groupID === '-1' ? '0' : result.groupID);
    ['requestBody', 'queryParams', 'restParams', 'requestHeaders', 'responseHeaders', 'responseBody'].forEach(
      (tableName) => {
        if (typeof result[tableName] !== 'object') {
          return;
        }
        result[tableName] = filterArrFun(result[tableName] || []);
        if (['requestBody', 'responseBody'].includes(tableName)) {
          if (['xml', 'json'].includes(result[`${tableName}Type`])) {
            result[tableName] = listToTreeHasLevel(result[tableName]);
          }
        }
      }
    );
    return result;
  }
  /**
   * Handle api data for judge page has edit
   * Unlike the saved data, the api data being edited is not as strict
   *
   * @param formData
   * @returns apiData
   */
  formatEditingApiData(formData): ApiData {
    return this.formatApiData(formData, (result) =>
      (result || []).filter((val) => val.name || val.description || val.example)
    );
  }
  /**
   * Handle api data to be saved
   *
   * @param formData
   * @returns apiData
   */
  formatSavingApiData(formData): ApiData {
    return this.formatApiData(formData, (result) => (result || []).filter((val) => val.name));
  }
}
