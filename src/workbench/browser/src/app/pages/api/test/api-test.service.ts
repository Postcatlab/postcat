import { Injectable } from '@angular/core';
import { ApiTestQuery } from '../../../shared/services/api-test/api-test-params.model';
import { ApiTestHistory } from '../../../shared/services/storage/index.model';
import { treeToListHasLevel } from '../../../utils/tree/tree.utils';
import { text2UiData } from '../../../utils/data-transfer/data-transfer.utils';

@Injectable()
export class ApiTestService {
  constructor() {}
  initListConf(opts) {
    opts.title = opts.title || '参数';
    opts.nameTitle = opts.nameTitle || `${opts.title}名`;
    opts.valueTitle = opts.valueTitle || `${opts.title}值`;
    return {
      setting: {
        // draggable: true,
        // dragCacheVar: opts.dragCacheVar || 'DRAG_VAR_API_PARAM',
      },
      baseFun: {
        watchCheckboxChange: opts.watchFormLastChange,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: '',
          type: 'checkbox',
          modelKey: 'required',
          mark: 'require',
          width: 80,
        },
        {
          thKey: opts.nameTitle,
          type: 'input',
          modelKey: 'name',
          placeholder: opts.nameTitle,
          // width: 300,
          // mark: 'name',
        },
        {
          thKey: opts.valueTitle,
          type: 'input',
          modelKey: 'value',
          placeholder: opts.valueTitle,
          // width: 200,
          // hide: 1,
          // mark: 'value',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
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
        dragCacheVar: 'DRAG_VAR_API_TEST_BODY',
      },
      baseFun: {
        reduceItemWhenAddChildItem: reduceItemWhenIsOprDepth,
        watchCheckboxChange: opts.watchFormLastChange,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: '',
          type: 'checkbox',
          modelKey: 'required',
          width: 80,
          mark: 'require',
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
          thKey: '参数值',
          type: 'input',
          modelKey: 'value',
          placeholder: '参数值',
          width: 300,
          mark: 'value',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
            {
              key: '添加子字段',
              operateName: 'addChild',
              itemExpression: `eo-attr-tip-placeholder="add_child_btn" ng-if="$ctrl.mainObject.setting.isLevel"`,
            },
            {
              key: '删除',
              operateName: 'delete',
              itemExpression: 'ng-if="!($ctrl.mainObject.setting.munalHideOperateColumn&&$first)"',
            },
          ],
        },
      ],
    };
  }
  /**
   * URL and Query transfer each other
   * @description Add query to URL and read query form url
   * @param {string} url - whole url include query
   * @param {object} query - ui query param
   * @param {string} opts.base - based on which,url or query,delete no exist and replace same
   * @param {string} opts.replaceType - replace means only keep replace array,merge means union
   * @returns {object} - {url:"",query:[]}
   */
  transferUrlAndQuery(
    url,
    query,
    opts: { base: string; replaceType: string } = {
      base: 'url',
      replaceType: 'replace',
    }
  ) {
    let urlQuery = [];
    let uiQuery = query;
    // get url query
    new URLSearchParams(url.split('?').slice(1).join('?')).forEach((val, name) => {
      let item: ApiTestQuery = {
        name: name,
        required: true,
        value: val,
      };
      urlQuery.push(item);
    });
    //get replace result
    let origin = opts.base === 'url' ? uiQuery : urlQuery,
      replace = opts.base === 'url' ? urlQuery : uiQuery;
    if (opts.replaceType === 'replace') origin.forEach((val) => (val.required = false));
    let result = [...replace, ...origin];
    for (var i = 0; i < result.length; ++i) {
      for (var j = i + 1; j < result.length; ++j) {
        if (result[i].name === result[j].name) result.splice(j--, 1);
      }
    }
    //joint query
    let search = '';
    result.forEach((val) => {
      if (!val.name || !val.required) return;
      search += `${val.name}=${val.value}&`;
    });
    search = search ? `?${search.slice(0, -1)}` : '';
    url = `${url.split('?')[0]}${search}`;
    return {
      url: url,
      query: result,
    };
  }
  getHTTPStatus(statusCode) {
    let HTTP_CODE_STATUS = [
      {
        status: 'info',
        cap: 199,
        class: 'code_blue',
        fontClass: 'cb',
      },
      {
        status: 'success',
        cap: 299,
        class: 'code_green',
        fontClass: 'cg',
      },
      {
        status: 'redirect',
        cap: 399,
        class: 'code_yellow',
        fontClass: 'cy',
      },
      {
        status: 'clientError',
        cap: 499,
        class: 'code_red',
        fontClass: 'cr',
      },
      {
        status: 'serverError',
        cap: 599,
        class: 'code_red',
        fontClass: 'cr',
      },
    ];
    return HTTP_CODE_STATUS.find((val) => statusCode <= val.cap);
  }
  getTestDataFromHistory(inData: ApiTestHistory) {
    let result = {
      testData: {
        uuid: inData.apiDataID,
        queryParams: [],
        restParams: [],
        requestBody:
          inData.request.requestBodyType === 'raw'
            ? inData.request.requestBody
            : inData.request.requestBody.map((val) => (val.required = true)),
        requestHeaders: inData.response.headers,
        ...inData.request,
      },
      response: JSON.parse(JSON.stringify(inData)),
    };
    return result;
  }
  /**
   * Transfer test data/test history to api data
   * @param {ApiTestHistory} inData.history
   * @param inData.testData - test request info
   * @returns {ApiData}
   */
  getApiFromTestData(inData) {
    let testToEditParams = (arr) => {
      let result = [];
      arr.forEach((val) => {
        if (!val.name) return;
        let item = { ...val, example: val.value };
        delete item.value;
        result.push(item);
      });
      return result;
    };
    let result = {
      ...inData.testData,
      responseHeaders: inData.history.response.headers,
      responseBodyType: 'json',
      responseBodyJsonType: 'object',
      responseBody: [],
    };
    delete result.uuid;
    ['requestHeaders', 'requestBody', 'restParams', 'queryParams'].forEach((keyName) => {
      if (!result[keyName] || typeof result[keyName] !== 'object') return;
      result[keyName] = testToEditParams(result[keyName]);
    });
    if (inData.history.response.responseType === 'text') {
      let bodyInfo = text2UiData(inData.history.response.body);
      console.log(bodyInfo);
      result.responseBody = bodyInfo.data;
      result.responseBodyType = bodyInfo.textType;
      result.responseBodyJsonType = bodyInfo.rootType;
    }
    return result;
  }
  getTestDataFromApi(inData) {
    let editToTestParams = (arr) => {
      arr.forEach((val) => {
        val.value = val.example;
        delete val.example;
      });
    };
    ['queryParams', 'restParams', 'requestHeaders'].forEach((keyName) => {
      editToTestParams(inData[keyName]);
    });
    //handle query and url
    let tmpResult = this.transferUrlAndQuery(inData.uri, inData.queryParams, {
      base: 'url',
      replaceType: 'merge',
    });
    inData.uri = tmpResult.url;
    inData.queryParams = tmpResult.query;
    //parse body
    switch (inData.requestBodyType) {
      case 'json':
      case 'xml': {
        inData.requestBody = treeToListHasLevel(inData.requestBody, {
          listDepth: 0,
          mapItem: (val) => {
            let typeSorts = [
              {
                type: 'string',
                match: ['file', 'date', 'datetime', 'char', 'byte'],
              },
              {
                type: 'number',
                match: ['int', 'float', 'double', 'short', 'long'],
              },
              {
                type: 'object',
                match: ['json'],
              },
            ];
            typeSorts.some((typeItem) => {
              if (typeItem.match.includes(val.type)) {
                val.type = typeItem.type;
                return true;
              }
            });
            val.value = val.example;
            return val;
          },
        });
        break;
      }
      case 'formData': {
        inData.requestBody.forEach((val) => {
          val.value = val.example;
          val.type = 'string';
          delete val.example;
        });
        break;
      }
    }
    return inData;
  }
}
