/**
 * @name 返回通用方法
 * @author 广州银云信息科技有限公司
 */
let _LIB_WORKER_THREAD = require('./exec_worker_thread');
let CryptoJS = require('crypto-js');
let privateFun = {},
  _LibsCommon = require('./common'),
  _LibsEncrypt = require('./encrypt').core,
  _Xml_Class = new (require('./xml').core)();
const DOMAIN_CONSTANT = require('../domain.json');
const DOMAIN_REGEX =
  '(^((http|wss|ws|ftp|https)://))|(^(((http|wss|ws|ftp|https)://)|)(([\\w\\-_]+([\\w\\-\\.]*)?(\\.(' +
  DOMAIN_CONSTANT.join('|') +
  ')))|((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|(localhost))((\\/)|(\\?)|(:)|($)))';
const TIMINGSUMMARY = {
  NS_PER_SEC: 1e9,
  MS_PER_NS: 1e6,
};
const { NodeVM } = require('./vm2/index');
let querystring = require('querystring');
/**
 * @desc 重置env
 * @param {object} inputSanboxVar 沙箱中的env变量
 * @param {object} inputBaiscEnv 基础的env
 */
privateFun.resetEnv = (inputBaiscEnv, inputSanboxVar) => {
  let tmpResult = Object.assign({}, inputBaiscEnv);
  tmpResult.envParam = _LibsCommon.deepCopy(inputSanboxVar.envParam);
  ['http'].map((val) => {
    tmpResult[val] = {};
    for (let itemKey in inputSanboxVar[val]) {
      if (
        ['extraFormDataParam', 'queryParam', 'headerParam', 'baseUrlParam', 'requestScript', 'responseScript'].indexOf(
          itemKey
        ) > -1
      ) {
        tmpResult[val][itemKey] = inputSanboxVar[val][itemKey];
      }
    }
  });
  return tmpResult;
};
privateFun.getMicrosToMs = (inputStartTime, inputEndTime) => {
  if (inputStartTime === undefined || inputEndTime === undefined) return 0.0;
  let tmpSecondDiff = inputEndTime[0] - inputStartTime[0];
  let tmpNanoSecondDiff = inputEndTime[1] - inputStartTime[1];
  let tmpDiffInNanoSecond = tmpSecondDiff * TIMINGSUMMARY.NS_PER_SEC + tmpNanoSecondDiff;
  let tmpOutput = tmpDiffInNanoSecond / TIMINGSUMMARY.MS_PER_NS;
  if (tmpOutput < 0) {
    return 0.0;
  } else {
    return tmpOutput;
  }
};
privateFun.getHttpTiming = (timingSummary) => {
  return {
    dnsTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.startAt, timingSummary.dnsTiming),
    tcpTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.dnsTiming || timingSummary.startAt, timingSummary.tcpTiming),
    tlsTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.tcpTiming, timingSummary.tlsTiming),
    requestSentTiming: _LibsEncrypt.getMicrosToMsStr(
      timingSummary.tlsTiming || timingSummary.tcpTiming,
      timingSummary.firstByteTiming
    ),
    firstByteTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.startAt, timingSummary.firstByteTiming),
    contentDeliveryTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.firstByteTiming, timingSummary.endAt),
    responseTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.startAt, timingSummary.endAt),
  };
};
privateFun.getBaiscEoFn = (inputSanboxVar, inputEnv = {}) => {
  let tmpResult = {
    env: {
      envParam: inputEnv.envParam,
    },
  };
  ['http', 'websocket', 'socket', 'rpc'].map((val) => {
    tmpResult.env[val] = _LibsCommon.deepCopy(inputEnv[val]) || {};
  });
  return tmpResult;
};
privateFun.setExecWorkerThread = (inputPostMsg, inputMsgCallback) => {
  return new _LIB_WORKER_THREAD.core(inputPostMsg, inputMsgCallback);
};

/**
 * @desc 主要用于UI脚本中公用函数补全
 * @param {*} inputSanboxVar 沙盒变量
 * @param {*} inputEnv 环境
 * @param {*} inputOpts 可选配置项，主要结构需要(globalHeader:全局头部)
 */
privateFun.constructUiCodeBasicFn = (inputSanboxVar, inputEnv, inputOpts = {}) => {
  inputOpts = inputOpts || {};
  let tmpResult = Object.assign({}, inputSanboxVar.eo, privateFun.getBaiscEoFn(inputSanboxVar, inputEnv));
  tmpResult.env['http'] = _LibsCommon.deepCopy(inputEnv['http']) || {};
  return tmpResult;
};

/**
 * @desc 构造各种类型的sanbox结构
 * @param {object} inputSanboxVar 沙箱中的变量
 * @param {object} inputInitialData 初始化的变量集合
 * @param {boolean} inputIsResponse 是否为返回信息
 */
privateFun.setTypesRefFns = (inputSanboxVar, inputInitialData, inputIsResponse) => {
  let tmpTypes = ['http', 'socket', 'rpc', 'websocket'],
    tmpBasicConf = {
      apiUrl: (inputInitialData.url || '').split('?')[0],
      bodyParam: inputInitialData.raw || '',
      bodyParseParam: inputInitialData.params || {},
      queryParam: inputInitialData.query || {},
      headerParam: inputInitialData.headers || {},
      restParam: inputInitialData.rest || {},
      responseParam: inputInitialData.response || '',
      responseHeaderParam: inputInitialData.responseHeaders || {},
    };
  tmpTypes.map((val) => {
    inputSanboxVar[val] = _LibsCommon.deepCopy(tmpBasicConf);
    inputSanboxVar[val].url = {
      parse() {
        return privateFun.parseRealSendUrl(
          {
            baseUrlParam: inputSanboxVar[val].baseUrlParam,
            queryParam: inputSanboxVar[val].queryParam,
            apiUrl: inputSanboxVar[val].apiUrl,
            restParam: inputSanboxVar[val].restParam,
          },
          {
            baseUrlParam: inputSanboxVar.env[val].baseUrlParam,
            queryParam: inputSanboxVar.env[val].queryParam,
            envParam: inputSanboxVar.env.envParam,
          }
        );
      },
      get: () => {
        return inputSanboxVar[val].apiUrl;
      },
      set: (inputVal) => {
        inputSanboxVar[val].apiUrl = inputVal;
      },
    };
    inputSanboxVar[val].query = {
      get: (inputKey) => {
        return inputSanboxVar[val].queryParam[inputKey];
      },
      set: (inputKey, inputVal) => {
        inputSanboxVar[val].queryParam[inputKey] = inputVal;
      },
      unset: (inputKey) => {
        delete inputSanboxVar[val].queryParam[inputKey];
      },
      clear: () => {
        inputSanboxVar[val].queryParam = {};
      },
    };
    inputSanboxVar[val].header = {
      get: (inputKey) => {
        return inputSanboxVar[val].headerParam[inputKey];
      },
      set: (inputKey, inputVal) => {
        inputSanboxVar[val].headerParam[inputKey] = inputVal;
      },
      unset: (inputKey) => {
        delete inputSanboxVar[val].headerParam[inputKey];
      },
      clear: () => {
        inputSanboxVar[val].headerParam = {};
      },
    };
    inputSanboxVar[val].rest = {
      get: (inputKey) => {
        return inputSanboxVar[val].restParam[inputKey];
      },
      set: (inputKey, inputVal) => {
        inputSanboxVar[val].restParam[inputKey] = inputVal;
      },
      unset: (inputKey) => {
        delete inputSanboxVar[val].restParam[inputKey];
      },
      clear: () => {
        inputSanboxVar[val].restParam = {};
      },
    };
    if (inputIsResponse) {
      inputSanboxVar[val].response = {
        get: () => {
          return inputSanboxVar[val].responseParam;
        },
        set: (inputVal) => {
          inputSanboxVar[val].responseParam = inputVal;
        },
      };
      inputSanboxVar[val].responseHeader = {
        get: (inputKey) => {
          return inputSanboxVar[val].responseHeaderParam[inputKey];
        },
        set: (inputKey, inputVal) => {
          inputSanboxVar[val].responseHeaderParam[inputKey] = inputVal;
        },
        unset: (inputKey) => {
          delete inputSanboxVar[val].responseHeaderParam[inputKey];
        },
        clear: () => {
          inputSanboxVar[val].responseHeaderParam = {};
        },
      };
    }
  });
};
/**
 * @desc 构造各种类型的sanbox结构
 * @param {object} inputSanboxVar 沙箱中的变量
 * @param {object} inputInitialData 初始化的变量集合
 * @param {boolean} inputIsResponse 是否为返回信息
 */
privateFun.setTypesRefFns = (inputSanboxVar, inputInitialData, inputIsResponse) => {
  let tmpTypes = ['http'],
    tmpBasicConf = {
      apiUrl: (inputInitialData.url || '').split('?')[0],
      bodyParam: inputInitialData.raw || '',
      bodyParseParam: inputInitialData.params || {},
      queryParam: inputInitialData.query || {},
      headerParam: inputInitialData.headers || {},
      restParam: inputInitialData.rest || {},
      responseParam: inputInitialData.response || '',
      responseHeaderParam: inputInitialData.responseHeaders || {},
    };
  tmpTypes.map((val) => {
    inputSanboxVar[val] = _LibsCommon.deepCopy(tmpBasicConf);
  });
};
/**
 * 前置脚本代码
 * @param {string} inputData 请求可分别赋值信息
 * @param {string} inputScript 前置脚本代码
 * @param {object} inputOpts options
 * @return {object} 前置组合请求信息
 */
privateFun.parseBeforeCode = function (inputData, inputScript, inputOpts = {}) {
  let tmpBasicEnv = inputData.env || _LibsCommon.parseEnv(),
    tmpApiType = inputOpts.type || 'http';
  inputData = JSON.parse(JSON.stringify(inputData));
  
  let tmpReportList = [],
    tmpBinary = inputData.binary,
    tmpSanboxObj = {
      requestBody: inputData.requestBody || {},
      requestHeaders: inputData.requestHeaders || {},
      restParams: inputData.restParams || {},
      queryParams: inputData.queryParams || {},
      responseHeaders: inputData.responseHeaders || {},
      response: inputData.response || {},
      CryptoJS: CryptoJS,
      eo: {},
    };
  const tmpVm = new NodeVM({
      sandbox: tmpSanboxObj,
      require: {
        external: true,
        builtin: ['crypto'],
      },
    }),
    tmpCodeEvalObj = tmpVm._context;
  tmpCodeEvalObj.eo = privateFun.constructUiCodeBasicFn(tmpCodeEvalObj, tmpBasicEnv, inputOpts);
  privateFun.setTypesRefFns(tmpCodeEvalObj.eo, inputData);
  let tmpTargetTypeData = tmpCodeEvalObj.eo[tmpApiType],
    tmpTargetTypeEnv = tmpCodeEvalObj.eo.env[tmpApiType];
  let tmpOutput = {
      status: 'finish',
      url: tmpTargetTypeData.apiUrl,
      headers: {},
      params: null,
      env: privateFun.resetEnv(tmpBasicEnv, tmpCodeEvalObj.eo.env),
      reportList: tmpReportList,
    },
    tmpParams,
    tmpHeaders;
  if (inputData.isReturnSoonWhenExecCode) return tmpOutput;
  try {
    let tmp_query_param_obj = Object.assign({}, tmpTargetTypeEnv.queryParam, tmpTargetTypeData.queryParam);
    tmpHeaders = Object.assign({}, tmpTargetTypeEnv.headerParam, tmpTargetTypeData.headerParam);
    switch (inputData.requestType.toString()) {
      case '0': {
        tmpParams = _LibsCommon.mergeObj(tmpTargetTypeData.bodyParseParam, tmpTargetTypeEnv.extraFormDataParam);
        break;
      }
      case '2': {
        if (/^\[/.test(tmpTargetTypeData.bodyParam)) {
          tmpParams = JSON.stringify([JSON.parse(tmpTargetTypeData.bodyParam)[0]]);
        } else {
          tmpParams = tmpTargetTypeData.bodyParam;
        }
        break;
      }
      case '3': {
        /**
         * @desc 去除xml自动补全额外参数功能
         */

        tmpParams = _Xml_Class.jsonToXml()(tmpTargetTypeData.bodyParseParam, inputData.xmlAttrObj);
        break;
      }
      case '1': {
        tmpParams =
          typeof tmpTargetTypeData.bodyParam === 'string'
            ? tmpTargetTypeData.bodyParam
            : JSON.stringify(tmpTargetTypeData.bodyParam);
        break;
      }
    }
    let tmpEnvGlobals = Object.assign({}, global.eoTestGlobals || {}, tmpCodeEvalObj.eo.env.envParam || {});
    for (let key in tmpEnvGlobals) {
      let val = tmpEnvGlobals[key];
      let templateParamObject = {};
      let templateHeaderObject = {};
      for (let tmp_query_param_key in tmp_query_param_obj) {
        let tmp_query_param_val = _LibsCommon.replaceAll(
          '{{' + key + '}}',
          val || '',
          tmp_query_param_obj[tmp_query_param_key]
        );
        delete tmp_query_param_obj[tmp_query_param_key];
        tmp_query_param_obj[_LibsCommon.replaceAll('{{' + key + '}}', val || '', tmp_query_param_key)] =
          tmp_query_param_val;
      }
      tmpOutput.url = _LibsCommon.replaceAll('{{' + key + '}}', val || '', tmpOutput.url);
      for (let childKey in tmpHeaders) {
        tmpHeaders[childKey] = _LibsCommon.replaceAll('{{' + key + '}}', val, tmpHeaders[childKey]);
        if (childKey.indexOf('{{' + key + '}}') > -1) {
          templateHeaderObject[_LibsCommon.replaceAll('{{' + key + '}}', val, childKey)] = tmpHeaders[childKey];
        } else {
          templateHeaderObject[childKey] = tmpHeaders[childKey];
        }
      }
      tmpHeaders = templateHeaderObject;
      if (!tmpBinary) {
        switch (typeof tmpParams) {
          case 'string': {
            tmpParams = _LibsCommon.replaceAll('{{' + key + '}}', val, tmpParams);
            break;
          }
          default: {
            for (let childKey in tmpParams) {
              switch (typeof tmpParams[childKey]) {
                case 'string': {
                  tmpParams[childKey] = _LibsCommon.replaceAll('{{' + key + '}}', val, tmpParams[childKey]);
                  break;
                }
                default: {
                  for (let grandSonKey in tmpParams[childKey]) {
                    let grandSonVal = tmpParams[childKey][grandSonKey];
                    switch (typeof grandSonVal) {
                      case 'string': {
                        tmpParams[childKey][grandSonKey] = _LibsCommon.replaceAll('{{' + key + '}}', val, grandSonVal);
                        break;
                      }
                    }
                  }
                  break;
                }
              }
              if (childKey.indexOf('{{' + key + '}}') > -1) {
                let tmpHadReplaceString = _LibsCommon.replaceAll('{{' + key + '}}', val, childKey);
                templateParamObject[tmpHadReplaceString] = tmpParams[childKey];
                if (tmpParams[tmpHadReplaceString]) {
                  switch (_LibsCommon.getTypeOfVar(templateParamObject[tmpHadReplaceString])) {
                    case 'Array': {
                      if (_LibsCommon.getTypeOfVar(tmpParams[tmpHadReplaceString]) == 'Array') {
                        templateParamObject[tmpHadReplaceString] = templateParamObject[tmpHadReplaceString].concat(
                          tmpParams[tmpHadReplaceString]
                        );
                      } else {
                        templateParamObject[tmpHadReplaceString] = templateParamObject[tmpHadReplaceString].push(
                          tmpParams[tmpHadReplaceString]
                        );
                      }
                      break;
                    }
                    default: {
                      if (_LibsCommon.getTypeOfVar(tmpParams[tmpHadReplaceString]) == 'Array') {
                        templateParamObject[tmpHadReplaceString] = tmpParams[tmpHadReplaceString].push(
                          templateParamObject[tmpHadReplaceString]
                        );
                      } else {
                        templateParamObject[tmpHadReplaceString] = [
                          templateParamObject[tmpHadReplaceString],
                          tmpParams[tmpHadReplaceString],
                        ];
                      }
                      break;
                    }
                  }
                }
              } else {
                templateParamObject[childKey] = tmpParams[childKey];
              }
            }
            tmpParams = templateParamObject;
          }
        }
      }
    }
    tmpOutput.headers = tmpHeaders;
    tmpOutput.queryParams = tmp_query_param_obj;
    let queryString = querystring.stringify(tmpOutput.queryParams);
    tmpOutput.url += queryString ? '?' + queryString : '';
    for (let key in tmpTargetTypeData.restParam) {
      tmpOutput.url = privateFun.replaceRestParam(key, tmpTargetTypeData.restParam[key], tmpOutput.url);
    }
    if (tmpBinary) {
      tmpOutput.params = {};
    } else {
      tmpOutput.params = tmpParams;
    }
    if (!new RegExp(DOMAIN_REGEX).test(tmpOutput.url)) {
      tmpOutput.url = (tmpTargetTypeEnv.baseUrlParam || '') + tmpOutput.url;
    }
    if (!/"content-type":/i.test(JSON.stringify(tmpOutput.headers))) {
      switch (inputData.requestType.toString()) {
        case '0': {
          tmpOutput.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          break;
        }
        case '2': {
          tmpOutput.headers['Content-Type'] = 'application/json';
          break;
        }
        case '3': {
          tmpOutput.headers['Content-Type'] = 'application/xml';
          break;
        }
        case '4': {
          if (/(data:)(.*)(;base64),/.test(tmpBinary)) {
            tmpOutput.headers['Content-Type'] = RegExp.$2;
          } else {
            tmpOutput.headers['Content-Type'] = 'false';
          }
          break;
        }
      }
    }
  } catch (e) {
    console.error(new Date() + '：libs/common.js 217:', e);
  }
  return tmpOutput;
};
/**
 * 后置脚本代码
 * @param {string} inputData 返回结果信息
 * @param {string} inputScript 后置脚本代码
 * @param {object} inputEnv env
 * @param {object} inputOpts options
 * @return {object} 后置组合请求信息
 */
privateFun.parseAfterCode = function (inputData, inputScript, inputEnv, inputOpts = {}) {
  let tmpReportList = [],
    tmpApiType = inputOpts.type || 'http',
    tmpBasicEnv = inputEnv || _LibsCommon.parseEnv();
  let tmpStatus, tmpErrorContent; //不可删，与提示预警有关
  let tmpBindObj = (inputOpts || {}).bindObj || {};
  const tmpVm = new NodeVM({
      sandbox: {
        CryptoJS: CryptoJS,
        db_result: inputOpts.dbResult || {},
        eo: {},
        requestBody: tmpBindObj.requestBody || {},
        requestHeaders: tmpBindObj.requestHeaders || {},
        restParams: tmpBindObj.restParams || {},
        queryParams: tmpBindObj.queryParams || {},
        response: tmpBindObj.response || {},
        responseHeaders: (inputOpts || {}).responseHeaders,
      },
      require: {
        external: true,
        builtin: ['crypto'],
      },
    }),
    tmpCodeEvalObj = tmpVm._context;
  tmpCodeEvalObj.eo = privateFun.constructUiCodeBasicFn(tmpCodeEvalObj, tmpBasicEnv, inputOpts);
  privateFun.setTypesRefFns(
    tmpCodeEvalObj.eo,
    Object.assign({}, inputOpts, {
      response: inputData,
    }),
    true
  );
  let tmpTargetTypeData = tmpCodeEvalObj.eo[tmpApiType];
  return {
    status: 'finish',
    content: tmpTargetTypeData.responseParam,
    env: privateFun.resetEnv(tmpBasicEnv, tmpCodeEvalObj.eo.env),
    reportList: tmpReportList,
  };
};
privateFun.requestPreReduceByPromise = (inputData, inputCode, inputOptions) => {
  return new Promise((resolve) => {
    let tmpResponse = privateFun.parseBeforeCode(inputData, inputCode, inputOptions);
    resolve(tmpResponse);
  });
};
privateFun.responsePreReduceByPromise = (inputData, inputCode, inputEnv, inputOptions) => {
  return new Promise((resolve) => {
    let tmpResponse = privateFun.parseAfterCode(inputData, inputCode, inputEnv, inputOptions);
    resolve(tmpResponse);
  });
};
exports.getMicrosToMs = privateFun.getMicrosToMs;
exports.getHttpTiming = privateFun.getHttpTiming;
exports.requestPreReduceByPromise = privateFun.requestPreReduceByPromise;
exports.responsePreReduceByPromise = privateFun.responsePreReduceByPromise;
