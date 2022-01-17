import { Injectable } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
@Injectable()
export class ApiDetailService {
  constructor(private modal: ModalService) {}
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
          width: 300,
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
          width: 300,
          mark: 'description',
        },

        {
          thKey: '示例',
          type: 'text',
          modelKey: 'example',
          width: 200,
          mark: 'example',
        }
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
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: '参数名',
          type: 'text',
          modelKey: 'name',
          width: 300,
          mark: 'name',
        },
        {
          thKey: '类型',
          type: 'text',
          modelKey: 'type',
          mark: 'type',
          width: 100,
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
          width: 300,
          mark: 'description',
        },

        {
          thKey: '示例',
          type: 'text',
          modelKey: 'example',
          width: 200,
          mark: 'example',
        }
      ],
    };
  }
}
