/**
 * @name 通用方法
 * @author Postcat
 */
'use strict';
let _LibsDataConstructor = new (require('./data_constructor').core)();
let xml2json = require('xml2js');
let privateFun = {};
const CONFIG = require('../config.json');
const LOCAL_REGEXP_CONST = 'eoundefined$';
/**
 * @desc 处理用户脚本允许错误时返回的内容
 * @param {object} input_err 错误对象
 */
privateFun.execCodeErrWarning = input_err => {
  let tmp_error_row, tmp_error_col, tmp_fn_name;
  if (/<anonymous>:(.*):(.*)\)/.test(input_err.stack)) {
    tmp_error_row = RegExp.$1;
    tmp_error_col = RegExp.$2;
  }
  if (!/ is not a function/.test(input_err.stack)) {
    if (/eo\.userFunction\.(.+) \(vm\.js:(.*):(.*)\)/.test(input_err.stack)) {
      let tmp_stack_text = input_err.stack.substr(input_err.stack.indexOf('eo.userFunction.'), input_err.stack.length);
      tmp_fn_name = tmp_stack_text.substr(0, tmp_stack_text.indexOf(' '));
      tmp_error_row = RegExp.$2;
      tmp_error_col = RegExp.$3;
      tmp_error_row--;
    } else if (/eo\.globalFunction\.(.+) \(vm\.js:(.*):(.*)\)/.test(input_err.stack)) {
      let tmp_stack_text = input_err.stack.substr(input_err.stack.indexOf('eo.globalFunction.'), input_err.stack.length);
      tmp_fn_name = tmp_stack_text.substr(0, tmp_stack_text.indexOf(' '));
      tmp_error_row = RegExp.$2;
      tmp_error_col = RegExp.$3;
      if (tmp_error_row === '1') {
        tmp_error_col = tmp_error_col - 101;
      }
      tmp_error_row--;
    } else if (/eo\.spaceFunction\.(.+) \(vm\.js:(.*):(.*)\)/.test(input_err.stack)) {
      let tmp_stack_text = input_err.stack.substr(input_err.stack.indexOf('eo.spaceFunction.'), input_err.stack.length);
      tmp_fn_name = tmp_stack_text.substr(0, tmp_stack_text.indexOf(' '));
      tmp_error_row = RegExp.$2;
      tmp_error_col = RegExp.$3;
      if (tmp_error_row === '1') {
        tmp_error_col = tmp_error_col - 101;
      }
      tmp_error_row--;
    } else {
      if (input_err.stack.indexOf('^') > -1) {
        if (/vm\.js:(.*)\n/.test(input_err.stack)) {
          tmp_error_row = RegExp.$1;
          tmp_error_col = RegExp.$2;
        }
        let tmp_last_index = input_err.stack.indexOf('^');
        let tmp_first_index = input_err.stack.substr(0, tmp_last_index).lastIndexOf('\n');
        tmp_error_col = tmp_last_index - tmp_first_index;
      } else {
        if (/vm\.js:(.*):(.*)\)/.test(input_err.stack)) {
          tmp_error_row = RegExp.$1;
          tmp_error_col = RegExp.$2;
        }
      }
      if (tmp_error_row === '1') {
        tmp_error_col = tmp_error_col - 62;
      }
    }
  }
  return {
    row: tmp_error_row,
    col: tmp_error_col,
    fn: tmp_fn_name
  };
};
/**
 * 截断死循环
 * @return {class}   截断类
 */
privateFun.infiniteLoopDetector = function () {
  let map = {};
  // define an InfiniteLoopError class
  function InfiniteLoopError(msg, type) {
    Error.call(this, msg);
    this.type = 'InfiniteLoopError';
  }

  function infiniteLoopDetector(id) {
    if (id in map) {
      // 非首次执行，此处可以优化，性能太低
      if (Date.now() - map[id] > CONFIG.MAX_TIME_LOOP) {
        delete map[id];
        throw new Error('Loop running too long!', 'InfiniteLoopError');
      }
    } else {
      // 首次运行，记录循环开始的时间。之所有把非首次运行的判断写在前面的if里是因为上面会执行更多次
      map[id] = Date.now();
    }
  }

  infiniteLoopDetector.wrap = function (codeStr, key) {
    if (typeof codeStr !== 'string') {
      throw new Error(
        'Can only wrap code represented by string, not any other thing at the time! If you want to wrap a function, convert it to string first.'
      );
    }
    if (codeStr.indexOf('pc.execBsh') > -1) return codeStr;
    // this is not a strong regex, but enough to use at the time
    return codeStr.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, function (loopHead) {
      let id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
      return (key || `infiniteLoopDetector`) + `(${id});${loopHead}` + (key || `infiniteLoopDetector`) + `(${id});`;
    });
  };
  return infiniteLoopDetector;
};
/**
 * 解析结果类型
 * @param {any} object
 */
privateFun.typeof = function (object) {
  var tf = typeof object,
    ts = Object.prototype.toString.call(object);
  return null === object
    ? 'Null'
    : 'undefined' == tf
    ? 'Undefined'
    : 'boolean' == tf
    ? 'Boolean'
    : 'number' == tf
    ? Number.isInteger(object)
      ? 'Int'
      : /^(-?\d+)(\.\d+)?$/.test(object)
      ? 'Float'
      : 'Number'
    : 'string' == tf
    ? 'String'
    : '[object Function]' == ts
    ? 'Function'
    : '[object Array]' == ts
    ? 'Array'
    : '[object Date]' == ts
    ? 'Date'
    : 'Object';
};
privateFun.deepCopy = inputObject => {
  try {
    return JSON.parse(JSON.stringify(inputObject));
  } catch (JSON_STRINGIFY_ERROR) {
    return inputObject;
  }
};
/**
 * @desc 解析请求信息，组合成合适的对象
 * @param [object] inputData 原始待组合对象
 * @return [object]
 */
privateFun.parseRequestDataToObj = inputData => {
  let tmpOutputObj = {
      restParams: inputData.restParams,
      queryParams: inputData.queryParams,
      requestBody: null
    },
    tmpRequestBody = inputData.requestBody.body;
  try {
    switch (inputData.requestType) {
      case '2': {
        tmpRequestBody = JSON.parse(tmpRequestBody);
        break;
      }
      case '3': {
        xml2json.parseString(
          tmpRequestBody,
          {
            explicitArray: false,
            ignoreAttrs: true
          },
          function (error, result) {
            if (!error) {
              tmpRequestBody = result;
            }
          }
        );
        break;
      }
      case '1': {
        tmpOutputObj.raw = tmpRequestBody;
        tmpRequestBody = {
          raw: tmpRequestBody
        };
        break;
      }
      case '4': {
        tmpOutputObj.binary = tmpRequestBody;
        tmpRequestBody = {
          binary: tmpRequestBody
        };
        break;
      }
    }
  } catch (PARSE_REQUEST_BODY_DATA_ERR) {
    console.error(new Date() + '：PARSE_REQUEST_BODY_DATA_ERR：：', PARSE_REQUEST_BODY_DATA_ERR);
  }
  tmpOutputObj.requestBody = tmpRequestBody;
  return tmpOutputObj;
};
privateFun.bodyQueryToJson = function (inputArray, inputOptions) {
  inputOptions = inputOptions || {
    apiRequestParamJsonType: 0
  };
  let tmpXmlAttrObj = {};
  let tmpJsonObj = _LibsDataConstructor.eo_define_arr_to_json(inputArray, {}, inputOptions, tmpXmlAttrObj);
  if (inputOptions.isXml) {
    return {
      value: JSON.stringify(tmpJsonObj),
      attr: tmpXmlAttrObj
    };
  }
  if ((inputOptions.apiRequestParamJsonType || 0).toString() == '1') {
    return JSON.stringify([tmpJsonObj]).replace(/("eo_big_int_)(((?!").)*)(")/g, '$2');
  } else {
    return JSON.stringify(tmpJsonObj).replace(/("eo_big_int_)(((?!").)*)(")/g, '$2');
  }
};
/**
 * 解析环境变量
 * @param  {array} env 环境变量
 * @return  object  返回环境
 */
privateFun.parseEnv = function (env) {
  env = env || {};
  //设置全局的配置：环境变量、全局脚本、环境ID、环境名称
  let tmpConf = {
    envID: env.envID || 0,
    envName: env.envName || '',
    envParam: {},
    startup: env.globalBeforeProcess || '',
    teardown: env.globalAfterProcess || '',
    envAuth: env.envAuth || {
      status: '0'
    }
  };
  //处理全局变量
  try {
    for (let val of env.paramList) {
      if (val.paramKey)
        tmpConf.envParam[val.paramKey] = JSON.stringify(val.paramValue || '')
          .replace(/^"/, '')
          .replace(/"$/, '');
    }
  } catch (MAP_ERR) {}
  //轮询协议，设置协议配置
  let tmpProtocolRef = ['http', 'socket', 'websocket', 'rpc'],
    tmpIsLessThan780 = !env.hasOwnProperty('socket');
  let tmpBuildArr = [
    {
      origin: 'additionalParamList',
      target: 'extraFormDataParam',
      key: 'paramKey',
      value: 'paramValue'
    },
    {
      origin: 'urlParamList',
      target: 'queryParam',
      key: 'paramKey',
      value: 'paramValue'
    },
    {
      origin: 'headerList',
      target: 'headerParam',
      key: 'headerName',
      value: 'headerValue'
    }
  ];
  for (let key of tmpProtocolRef) {
    let tmpEnvItem = (tmpIsLessThan780 || key === 'http' ? env : env[key]) || {};
    let tmpItem = {
      baseUrlParam: tmpEnvItem.host || tmpEnvItem.frontURI || '',
      headerParam: {},
      extraFormDataParam: {},
      queryParam: {},
      requestScript: tmpEnvItem.beforeInject || '',
      responseScript: tmpEnvItem.afterInject || ''
    };
    if (tmpEnvItem.hasOwnProperty('connectInject')) {
      tmpItem.connectInject = tmpEnvItem.connectInject || '';
    }
    tmpBuildArr.map(item => {
      if (tmpEnvItem[item.origin]) {
        tmpEnvItem[item.origin].map(val => {
          if (val[item.key]) tmpItem[item.target][val[item.key]] = val[item.value] || '';
        });
      }
    });
    tmpConf[key] = tmpItem;
  }
  return tmpConf;
};
/**
 * merge对象数据
 * @param {object} inputTargetItem 目标对象
 * @param {object} inputSourceItem 源对象
 * @returns {object} 已合并输出对象
 */
privateFun.mergeObj = (inputTargetItem, inputSourceItem) => {
  let tmpOutputObj = privateFun.deepCopy(inputTargetItem);
  for (let key in inputSourceItem) {
    if (tmpOutputObj[key] || tmpOutputObj[key] === 0 || tmpOutputObj[key] === null || tmpOutputObj[key] === false) continue;
    tmpOutputObj[key] = inputSourceItem[key];
  }
  return tmpOutputObj;
};
exports.mergeObj = privateFun.mergeObj;
exports.parseEnv = privateFun.parseEnv;
exports.deepCopy = privateFun.deepCopy;
exports.getTypeOfVar = privateFun.typeof;
exports.parseRequestDataToObj = privateFun.parseRequestDataToObj;
exports.bodyQueryToJson = privateFun.bodyQueryToJson;
exports.LOCAL_REGEXP_CONST = LOCAL_REGEXP_CONST;
exports.replaceAll = function () {
  return _LibsDataConstructor.text_replace_all(...arguments);
};
exports.execCodeErrWarning = privateFun.execCodeErrWarning;
exports.infiniteLoopDetector = privateFun.infiniteLoopDetector();
