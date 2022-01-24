import { Injectable } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { ApiParamsExtraSettingComponent } from './extra-setting/api-params-extra-setting.component';
@Injectable()
export class ApiEditService {
  constructor(private modal: ModalService) {}
  showMore(inputArg, opts: { nzOnOk: (result: any) => void; title: string }) {
    const modal = this.modal.create({
      nzTitle: `${opts.title}详情`,
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
    opts.title = opts.title || '参数';
    return {
      setting: {
        draggable: true,
        dragCacheVar: opts.dragCacheVar || 'DRAG_VAR_API_EDIT_PARAM',
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
          thKey: opts.nameTitle || `${opts.title}名`,
          type: 'input',
          modelKey: 'name',
          placeholder: opts.nameTitle || `${opts.title}名`,
          width: 300,
          mark: 'name',
        },
        {
          thKey: '必填',
          type: 'checkbox',
          modelKey: 'required',
          mark: 'require',
          width: 80,
        },
        {
          thKey: '说明',
          type: 'input',
          modelKey: 'description',
          placeholder: `${opts.title}说明`,
          width: 200,
          mark: 'description',
        },
        {
          thKey: '示例',
          type: 'input',
          modelKey: 'example',
          placeholder: `${opts.title}示例`,
          width: 200,
          hide: 1,
          mark: 'example',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
            {
              key: '更多设置',
              operateName: 'more',
              param: `inputArg`,
              itemExpression: `eo-attr-tip-placeholder="more_setting_btn" `,
              fun: (inputArg) => {
                this.showMore(inputArg, {
                  nzOnOk: opts.nzOnOkMoreSetting,
                  title: opts.title,
                });
              },
            },
            {
              key: '插入',
              operateName: 'insert',
              itemExpression: `eo-attr-tip-placeholder="insert_param_btn"`,
            },
            {
              key: '删除',
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
          thKey: '参数名',
          type: 'depthInput',
          modelKey: 'name',
          placeholder: '参数名',
          width: 300,
          mark: 'name',
        },
        {
          thKey: '类型',
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
          thKey: '必填',
          type: 'checkbox',
          modelKey: 'required',
          width: 80,
          mark: 'require',
        },
        {
          thKey: '说明',
          type: 'input',
          modelKey: 'description',
          placeholder: '参数说明',
          width: 300,
          mark: 'description',
        },

        {
          thKey: '示例',
          type: 'input',
          modelKey: 'example',
          placeholder: '参数示例',
          width: 200,
          hide: 1,
          mark: 'example',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
            {
              key: '添加子字段',
              operateName: 'addChild',
              itemExpression: `ng-if="$ctrl.mainObject.setting.isLevel"`,
            },
            {
              key: '更多设置',
              operateName: 'more',
              fun: (inputArg) => {
                this.showMore(inputArg, {
                  nzOnOk: opts.nzOnOkMoreSetting,
                  title: opts.title,
                });
              },
              param: `inputArg`,
              itemExpression: `eo-attr-tip-placeholder="more_setting_btn" `,
            },
            {
              key: '插入',
              operateName: 'insert',
              itemExpression: `ng-if="!($ctrl.mainObject.setting.munalHideOperateColumn&&$first)"`
            },
            {
              key: '删除',
              operateName: 'delete',
              itemExpression: 'ng-if="!($ctrl.mainObject.setting.munalHideOperateColumn&&$first)"'
            },
          ],
        },
      ],
    };
  }
}
