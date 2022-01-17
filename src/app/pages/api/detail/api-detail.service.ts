import { Injectable } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
@Injectable()
export class ApiDetailService {
  constructor(private modal: ModalService) {}
  spreedAll($event) {
    let tmpEvent = $event.target;
    let tmpDepth = 10;
    let tmpElemList;
    while (true) {
      if (tmpEvent.getElementsByClassName('tr-tbd').length > 0 || tmpDepth === 0) {
        tmpElemList = tmpEvent.getElementsByClassName('tr-tbd');
        break;
      }
      tmpEvent = tmpEvent.parentNode;
      tmpDepth--;
    }
    for (const key in tmpElemList) {
      const val = tmpElemList[key];
      switch (typeof tmpElemList[key]) {
        case 'object': {
          val.click();
          break;
        }
      }
    }
  }
  spreedSingleItem(inputItem, inputBool, inputGlobalBool) {
    if (inputBool) {
      inputItem.isClick = inputGlobalBool;
    } else {
      inputItem.isClick = !inputItem.isClick;
    }
    if (
      inputItem.example ||
      inputItem.minimum ||
      inputItem.maximum ||
      inputItem.minLength ||
      inputItem.maxLength ||
      (inputItem.enum && inputItem.enum.length > 0 && inputItem.enum[0].value)
    ) {
      if (inputBool) {
        return {
          throw: 'needToStopEvent',
          valid: true,
        };
      } else {
        return true;
      }
    } else {
      if (inputBool) {
        return {
          throw: 'needToStopEvent',
          valid: false,
        };
      }
      return false;
    }
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
          thKey: opts.nameTitle || `${opts.title}名`,
          type: 'text',
          modelKey: 'name',
          placeholder: opts.nameTitle || `${opts.title}名`,
          width: 250,
          mark: 'name',
        },
        {
          thKey: '必填',
          type: 'html',
          html: '{{item.required?"是":""}}',
          width: 80,
          mark: 'require',
        },
        {
          thKey: '说明',
          type: 'text',
          modelKey: 'description',
          width: 250,
          mark: 'description',
        },

        {
          thKey: '示例',
          type: 'text',
          modelKey: 'example',
          width: 200,
          mark: 'example',
        },
      ],
    };
  }
  initBodyListConf(opts) {
    return {
      setting: {
        draggable: true,
        trClass: 'va_tr_asad',
        trDirective:
          'insert-html-common-directive insert-type="after" template-id="paramDetail_Template_js" bind-fun="$ctrl.mainObject.baseFun.itemClick(item,$ctrl.data.isSpreed,$ctrl.data.isSpreedBtnClick)"',
        isLevel: true,
        dragCacheVar: 'DRAG_VAR_API_EDIT_BODY',
      },
      baseFun: {
        spreedAll: this.spreedAll,
        itemClick: this.spreedSingleItem,
        watchCheckboxChange: opts.watchFormLastChange,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: '参数名',
          type: 'depthHtml',
          html: '<span class="param-name-span">{{item.name}}</span>',
          width: 260,
          mark: 'name',
        },
        {
          thKey: '类型',
          type: 'text',
          modelKey: 'type',
          mark: 'type',
          width: 80,
        },
        {
          thKey: '必填',
          type: 'html',
          html: '{{item.required?"是":""}}',
          width: 60,
          mark: 'require',
        },
        {
          thKey: '说明',
          type: 'text',
          modelKey: 'description',
          width: 260,
          mark: 'description',
        },

        {
          thKey: '示例',
          type: 'text',
          modelKey: 'example',
          width: 200,
          mark: 'example',
        },
        {
          thKey: `<button type="button" class="eo-operate-btn" ng-click="$ctrl.data.isSpreedBtnClick=!$ctrl.data.isSpreedBtnClick;$ctrl.data.isSpreed=true;$ctrl.mainObject.baseFun.spreedAll($event);$ctrl.data.isSpreed=false;">{{$ctrl.data.isSpreedBtnClick?"全部收缩":"全部展开"}}</button>`,
          type: 'html',
          html: `<span class="eo-operate-btn fs12" ng-show="item.example ||
          item.minimum ||
          item.maximum ||
          item.minLength ||
          item.maxLength ||
          (item.enum && item.enum.length > 0 && item.enum[0].value)">{{item.isClick?"收缩":"展开"}}</span>`,
          mark: 'fn_btn',
          width: '100px',
          class: 'undivide_line_lbcc',
          undivide: true,
        },
      ],
    };
  }
}
