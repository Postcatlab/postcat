/**
 * @name 通用方法
 * @author Eoapi
 */
'use strict';
let _LibsDataConstructor = new (require('./data_constructor').core)();
let xml2json = require('xml2js');
let privateFun = {};
const LOCAL_REGEXP_CONST = 'eoundefined$';
privateFun.deepCopy = (inputObject) => {
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
privateFun.parseRequestDataToObj = (inputData) => {
  let tmpOutputObj = {
      restParams: inputData.restParams,
      queryParams: inputData.queryParams,
      requestBody: null,
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
            ignoreAttrs: true,
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
          raw: tmpRequestBody,
        };
        break;
      }
      case '4': {
        tmpOutputObj.binary = tmpRequestBody;
        tmpRequestBody = {
          binary: tmpRequestBody,
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
  }
  let tmpXmlAttrObj={};
  let tmpJsonObj=_LibsDataConstructor.eo_define_arr_to_json(inputArray, {},inputOptions,tmpXmlAttrObj);
  if(inputOptions.isXml){
      return {
          value:JSON.stringify(tmpJsonObj),
          attr:tmpXmlAttrObj
      }
  }
  if ((inputOptions.apiRequestParamJsonType || 0).toString() == '1') {
      return JSON.stringify([tmpJsonObj]).replace(/("eo_big_int_)(((?!").)*)(")/g,"$2");
  } else {
      return JSON.stringify(tmpJsonObj).replace(/("eo_big_int_)(((?!").)*)(")/g,"$2");
  }

}
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
      status: '0',
    },
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
      value: 'paramValue',
    },
    {
      origin: 'urlParamList',
      target: 'queryParam',
      key: 'paramKey',
      value: 'paramValue',
    },
    {
      origin: 'headerList',
      target: 'headerParam',
      key: 'headerName',
      value: 'headerValue',
    },
  ];
  for (let key of tmpProtocolRef) {
    let tmpEnvItem = (tmpIsLessThan780 || key === 'http' ? env : env[key]) || {};
    let tmpItem = {
      baseUrlParam: tmpEnvItem.host || tmpEnvItem.frontURI || '',
      headerParam: {},
      extraFormDataParam: {},
      queryParam: {},
      requestScript: tmpEnvItem.beforeInject || '',
      responseScript: tmpEnvItem.afterInject || '',
    };
    if (tmpEnvItem.hasOwnProperty('connectInject')) {
      tmpItem.connectInject = tmpEnvItem.connectInject || '';
    }
    tmpBuildArr.map((item) => {
      if (tmpEnvItem[item.origin]) {
        tmpEnvItem[item.origin].map((val) => {
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
    if (tmpOutputObj[key] || tmpOutputObj[key] === 0 || tmpOutputObj[key] === null || tmpOutputObj[key] === false)
      continue;
    tmpOutputObj[key] = inputSourceItem[key];
  }
  return tmpOutputObj;
};
exports.mergeObj = privateFun.mergeObj;
exports.parseEnv = privateFun.parseEnv;
exports.deepCopy = privateFun.deepCopy;
exports.parseRequestDataToObj = privateFun.parseRequestDataToObj;
exports.bodyQueryToJson = privateFun.bodyQueryToJson;
exports.LOCAL_REGEXP_CONST=LOCAL_REGEXP_CONST;
exports.replaceAll = function () {
  return _LibsDataConstructor.text_replace_all(...arguments);
};
