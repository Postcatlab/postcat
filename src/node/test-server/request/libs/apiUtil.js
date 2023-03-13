/**
 * @name 返回通用方法
 * @author Postcat
 */
let _LIB_WORKER_THREAD = require('./exec_worker_thread');
let CryptoJS = require('crypto-js');
let privateFun = {},
  _LibsCommon = require('./common'),
  // _LibsZlib = require('./zlib'),
  _LibsEncrypt = require('./encrypt').core,
  _Xml_Class = new (require('./xml').core)();
const DOMAIN_CONSTANT = require('../domain.json');
const DOMAIN_REGEX =
  '(^((http|wss|ws|ftp|https)://))|(^(((http|wss|ws|ftp|https)://)|)(([\\w\\-_]+([\\w\\-\\.]*)?(\\.(' +
  DOMAIN_CONSTANT.join('|') +
  ')))|((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|(localhost))((\\/)|(\\?)|(:)|($)))';
const TIMINGSUMMARY = {
  NS_PER_SEC: 1e9,
  MS_PER_NS: 1e6
};
const { NodeVM } = require('./script-engines/vm2/index');
const querystring = require('querystring');

const { JSDOM } = require('jsdom');
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;
const window = document.defaultView,
  $ = require('jquery')(window);

const pmRuntime = require('postman-sandbox');
/**
 * @desc 重置env
 * @param {object} inputSanboxVar 沙箱中的env变量
 * @param {object} inputBaiscEnv 基础的env
 */
privateFun.resetEnv = (inputBaiscEnv, inputSanboxVar) => {
  let tmpResult = Object.assign({}, inputBaiscEnv);
  tmpResult.envParam = _LibsCommon.deepCopy(inputSanboxVar.envParam);
  ['http'].map(val => {
    tmpResult[val] = {};
    for (let itemKey in inputSanboxVar[val]) {
      if (['extraFormDataParam', 'queryParam', 'headerParam', 'baseUrlParam', 'requestScript', 'responseScript'].indexOf(itemKey) > -1) {
        tmpResult[val][itemKey] = inputSanboxVar[val][itemKey];
      }
    }
  });
  return tmpResult;
};
privateFun.replaceRestParam = (inputParamKey, inputParamInfo, inputUrl) => {
  let tmpUrl = inputUrl.split(`{{${inputParamKey}}}`).join('eoGlobal#');
  if (inputParamInfo && (tmpUrl.indexOf(`:${inputParamKey}`) > -1 || tmpUrl.indexOf(`{${inputParamKey}}`) > -1)) {
    tmpUrl = _LibsCommon.replaceAll(`:${inputParamKey}`, inputParamInfo, tmpUrl);
    tmpUrl = _LibsCommon.replaceAll(`{${inputParamKey}}`, inputParamInfo, tmpUrl);
  }
  return _LibsCommon.replaceAll('eoGlobal#', `{{${inputParamKey}}}`, tmpUrl);
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
privateFun.getHttpTiming = timingSummary => {
  return {
    dnsTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.startAt, timingSummary.dnsTiming),
    tcpTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.dnsTiming || timingSummary.startAt, timingSummary.tcpTiming),
    tlsTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.tcpTiming, timingSummary.tlsTiming),
    requestSentTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.tlsTiming || timingSummary.tcpTiming, timingSummary.firstByteTiming),
    firstByteTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.startAt, timingSummary.firstByteTiming),
    contentDeliveryTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.firstByteTiming, timingSummary.endAt),
    responseTiming: _LibsEncrypt.getMicrosToMsStr(timingSummary.startAt, timingSummary.endAt)
  };
};
privateFun.getBaiscEoFn = (inputSanboxVar, inputEnv = {}) => {
  let tmpResult = {
    md5: _LibsEncrypt.md5,
    sha1: _LibsEncrypt.sha1,
    sha224: _LibsEncrypt.sha224,
    sha256: _LibsEncrypt.sha256,
    sha384: _LibsEncrypt.sha384,
    sha512: _LibsEncrypt.sha512,
    HmacSHA1: _LibsEncrypt.HmacSHA1,
    HmacSHA224: _LibsEncrypt.HmacSHA224,
    HmacSHA256: _LibsEncrypt.HmacSHA256,
    HmacSHA384: _LibsEncrypt.HmacSHA384,
    HmacSHA512: _LibsEncrypt.HmacSHA512,
    rsaSHA1: _LibsEncrypt.RS1,
    rsaSHA256: _LibsEncrypt.RS256,
    rsaPublicEncrypt: _LibsEncrypt.rsaPublicEncrypt,
    rsaPrivateDecrypt: _LibsEncrypt.rsaPrivateDecrypt,
    rsaPrivateEncrypt: _LibsEncrypt.rsaPrivateEncrypt,
    rsaPublicDecrypt: _LibsEncrypt.rsaPublicDecrypt,
    aesEncrypt: _LibsEncrypt.aesEncrypt,
    aesDecrypt: _LibsEncrypt.aesDecrypt,
    desEncrypt: _LibsEncrypt.desEncrypt,
    desDecrypt: _LibsEncrypt.desDecrypt,
    userFunction: {},
    typeof: _LibsCommon.getTypeOfVar,
    globalFunction: {},
    spaceFunction: {},
    jsonpath: _LibsCommon.jsonpath,
    xpath: _LibsCommon.xpath,
    xmlParse: _LibsCommon.xmlParse,
    jsonParse: _LibsCommon.jsonParse,
    infiniteLoopDetector: _LibsCommon.infiniteLoopDetector,
    /**
     * 输出错误信息并停止继续执行任何代码
     * @param {string} info 输出信息体
     */
    throw_err: tmpInputMsg => {
      throw `codeError_${tmpInputMsg}`;
    },
    globals: {
      get: inputKey => {
        return global.eoTestGlobals[inputKey];
      },
      set: (inputKey, inputVal) => {
        let tmpType = _LibsCommon.getTypeOfVar(inputVal);
        switch (tmpType) {
          case 'String':
          case 'Boolean':
          case 'Number':
          case 'Int':
          case 'Float': {
            global.eoTestGlobals[inputKey] = inputVal;
            break;
          }
          default: {
            throw `codeError_自定义全局变量 ${inputKey} 仅支持储存 string、number、bool 类型数据，您试图为其赋值为 ${tmpType.toLowerCase()} 类型`;
          }
        }
      },
      unset: inputKey => {
        delete global.eoTestGlobals[inputKey];
      },
      clear: () => {
        global.eoTestGlobals = {};
      },
      all: () => {
        return global.eoTestGlobals || '';
      }
    },
    env: {
      envParam: inputEnv.envParam
    },
    crypt: {
      md5: _LibsEncrypt.md5,
      sha1: _LibsEncrypt.sha1,
      sha256: _LibsEncrypt.sha256,
      rsaSHA1: _LibsEncrypt.RS1,
      rsaSHA256: _LibsEncrypt.RS256,
      rsaPublicEncrypt: (tmpInputMsg, tmpInputKey, tmpInputEncoding) => {
        return _LibsEncrypt.rsaPublicEncrypt(tmpInputKey, tmpInputMsg, tmpInputEncoding);
      },
      rsaPrivateDecrypt: (tmpInputMsg, tmpInputKey, tmpInputEncoding) => {
        return _LibsEncrypt.rsaPrivateDecrypt(tmpInputKey, tmpInputMsg, tmpInputEncoding);
      },
      rsaPrivateEncrypt: (tmpInputMsg, tmpInputKey, tmpInputEncoding) => {
        return _LibsEncrypt.rsaPrivateEncrypt(tmpInputKey, tmpInputMsg, tmpInputEncoding);
      },
      rsaPublicDecrypt: (tmpInputMsg, tmpInputKey, tmpInputEncoding) => {
        return _LibsEncrypt.rsaPublicDecrypt(tmpInputKey, tmpInputMsg, tmpInputEncoding);
      },
      aesEncrypt: _LibsEncrypt.aesEncrypt,
      aesDecrypt: _LibsEncrypt.aesDecrypt,
      desEncrypt: _LibsEncrypt.desEncrypt,
      desDecrypt: _LibsEncrypt.desDecrypt
    },
    json: {
      encode(inputObj) {
        return JSON.stringify(inputObj);
      },
      decode(inputStr) {
        try {
          return JSON.parse(inputStr);
        } catch (JSON_PARSE_ERR) {
          throw `codeError_${JSON_PARSE_ERR.stack}`;
        }
      }
    },
    xml: {
      encode(inputObj) {
        return new xml2json.Builder().buildObject(inputObj);
      },
      decode: _LibsCommon.xmlParse
    },
    base64: {
      encode(inputData) {
        return Buffer.from(inputData).toString('base64');
      },
      decode(inputData) {
        return Buffer.from(inputData, 'base64').toString();
      }
    },
    urlEncode(inputData) {
      return encodeURIComponent(inputData);
    },
    urlDecode(inputData) {
      return decodeURIComponent(inputData);
    },
    filePath: (inputFilePath, inputFileName) => {
      let tmpLastIndex = inputFilePath.lastIndexOf('/'),
        tmpFileUUID;
      if (tmpLastIndex === -1) {
        tmpFileUUID = inputFilePath;
      } else {
        tmpFileUUID = inputFilePath.substr(tmpLastIndex + 1, inputFilePath.length);
      }
      try {
        inputFilePath = global._FILEOBJ[tmpFileUUID].filePath;
        inputFileName = global._FILEOBJ[tmpFileUUID].fileName || tmpFileUUID;
      } catch (PARSE_ERR) {}
      return privateFun.filePath(inputFilePath, inputFileName);
    }
    // gzip: {
    //   zip: _LibsZlib.fnGzip,
    //   unzip: _LibsZlib.fnGunzip,
    // },
    // deflate: {
    //   zip: _LibsZlib.fnDeflate,
    //   unzip: _LibsZlib.fnInflate,
    // },
  };
  ['http'].map(val => {
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
  let tmpResult = Object.assign({}, inputSanboxVar.pc, privateFun.getBaiscEoFn(inputSanboxVar, inputEnv));
  tmpResult.execute = tmpInputTestData => {
    return privateFun.setExecWorkerThread({
      opr: 'exec_http',
      data: tmpInputTestData,
      env: Object.assign({}, inputSanboxVar.pc.env, {
        envAuth: inputEnv.envAuth,
        http: Object.assign(
          {},
          {
            requestScript: '',
            responseScript: ''
          }
        )
      }),
      opts: {
        globalHeader: inputOpts.globalHeader
      }
    });
  };
  return tmpResult;
};
privateFun.parseRealSendUrl = (inputBasicData, inputEnv) => {
  let tmpQueryParam = JSON.stringify(Object.assign({}, inputEnv.queryParam, inputBasicData.queryParam));
  let tmpEnvGlobals = Object.assign({}, global.eoTestGlobals || {}, inputEnv.envParam || {}),
    tmpResult = inputBasicData.apiUrl;
  for (let key in tmpEnvGlobals) {
    let val = tmpEnvGlobals[key];
    tmpQueryParam = _LibsCommon.replaceAll('{{' + key + '}}', val, tmpQueryParam);
    tmpResult = _LibsCommon.replaceAll('{{' + key + '}}', val, tmpResult);
  }
  tmpQueryParam = querystring.stringify(JSON.parse(tmpQueryParam));
  tmpResult += tmpQueryParam ? '?' + tmpQueryParam : '';
  if (!new RegExp(_LibsCommon.DOMAIN_REGEX).test(tmpResult)) {
    tmpResult = (inputEnv.baseUrlParam || '') + tmpResult;
  }
  for (let key in inputBasicData.restParam) {
    tmpResult = privateFun.replaceRestParam(key, inputBasicData.restParam[key], tmpResult);
  }
  return tmpResult;
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
      responseHeaderParam: inputInitialData.responseHeaders || {}
    };
  tmpTypes.map(val => {
    inputSanboxVar[val] = _LibsCommon.deepCopy(tmpBasicConf);
    inputSanboxVar[val].url = {
      parse() {
        return privateFun.parseRealSendUrl(
          {
            baseUrlParam: inputSanboxVar[val].baseUrlParam,
            queryParam: inputSanboxVar[val].queryParam,
            apiUrl: inputSanboxVar[val].apiUrl,
            restParam: inputSanboxVar[val].restParam
          },
          {
            baseUrlParam: inputSanboxVar.env[val].baseUrlParam,
            queryParam: inputSanboxVar.env[val].queryParam,
            envParam: inputSanboxVar.env.envParam
          }
        );
      },
      get: () => {
        return inputSanboxVar[val].apiUrl;
      },
      set: inputVal => {
        inputSanboxVar[val].apiUrl = inputVal;
      }
    };
    inputSanboxVar[val].query = {
      get: inputKey => {
        return inputSanboxVar[val].queryParam[inputKey];
      },
      set: (inputKey, inputVal) => {
        inputSanboxVar[val].queryParam[inputKey] = inputVal;
      },
      unset: inputKey => {
        delete inputSanboxVar[val].queryParam[inputKey];
      },
      clear: () => {
        inputSanboxVar[val].queryParam = {};
      }
    };
    inputSanboxVar[val].header = {
      get: inputKey => {
        return inputSanboxVar[val].headerParam[inputKey];
      },
      set: (inputKey, inputVal) => {
        inputSanboxVar[val].headerParam[inputKey] = inputVal;
      },
      unset: inputKey => {
        delete inputSanboxVar[val].headerParam[inputKey];
      },
      clear: () => {
        inputSanboxVar[val].headerParam = {};
      }
    };
    inputSanboxVar[val].rest = {
      get: inputKey => {
        return inputSanboxVar[val].restParam[inputKey];
      },
      set: (inputKey, inputVal) => {
        inputSanboxVar[val].restParam[inputKey] = inputVal;
      },
      unset: inputKey => {
        delete inputSanboxVar[val].restParam[inputKey];
      },
      clear: () => {
        inputSanboxVar[val].restParam = {};
      }
    };
    if (inputIsResponse) {
      inputSanboxVar[val].response = {
        get: () => {
          return inputSanboxVar[val].responseParam;
        },
        set: inputVal => {
          inputSanboxVar[val].responseParam = inputVal;
        }
      };
      inputSanboxVar[val].responseHeader = {
        get: inputKey => {
          return inputSanboxVar[val].responseHeaderParam[inputKey];
        },
        set: (inputKey, inputVal) => {
          inputSanboxVar[val].responseHeaderParam[inputKey] = inputVal;
        },
        unset: inputKey => {
          delete inputSanboxVar[val].responseHeaderParam[inputKey];
        },
        clear: () => {
          inputSanboxVar[val].responseHeaderParam = {};
        }
      };
    }
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
  //!Can't delete,for eval warning tips
  let tmpTitle = inputData.title || (inputData.isReturnSoonWhenExecCode ? '环境-API 前置脚本' : '');
  let tmpErrorContent, tmpStatus;
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
      $: $,
      window: window,
      document: document,
      pc: {
        info: (tmpInputMsg, tmpInputType) => {
          let tmpInputMsgType = ['[object Date]'].includes(Object.prototype.toString.call(tmpInputMsg));

          let tmpText;
          try {
            tmpText = tmpInputMsgType
              ? tmpInputMsg.toString()
              : typeof tmpInputMsg === 'object'
              ? JSON.stringify(tmpInputMsg)
              : tmpInputMsg;
          } catch (JSON_STRINGIFY_ERROR) {
            tmpText = tmpInputMsg.toString();
          }
          tmpReportList.push({
            content: tmpText,
            type: tmpInputType || 'throw'
          });
        },
        error: tmpInputMsg => {
          let tmpInputMsgType = ['[object Date]'].includes(Object.prototype.toString.call(tmpInputMsg));
          let tmpText;
          try {
            tmpText = tmpInputMsgType
              ? tmpInputMsg.toString()
              : typeof tmpInputMsg === 'object'
              ? JSON.stringify(tmpInputMsg)
              : tmpInputMsg;
          } catch (JSON_STRINGIFY_ERROR) {
            tmpText = tmpInputMsg.toString();
          }
          tmpReportList.push({
            content: tmpText,
            type: 'assert_error'
          });
          tmpErrorContent = eval(global.eoLang['assertError']);
          tmpStatus = 'assertError';
        },
        stop: tmpInputMsg => {
          let tmpInputMsgType = ['[object Date]'].includes(Object.prototype.toString.call(tmpInputMsg));
          let tmpText;
          try {
            tmpText = tmpInputMsgType
              ? tmpInputMsg.toString()
              : typeof tmpInputMsg === 'object'
              ? JSON.stringify(tmpInputMsg)
              : tmpInputMsg;
          } catch (JSON_STRINGIFY_ERROR) {
            tmpText = tmpInputMsg.toString();
          }
          tmpReportList.push({
            content: tmpText,
            type: 'interrupt'
          });
          throw 'interrupt';
        }
      }
    };
  //TODO compatible with old version
  tmpSanboxObj.eo = tmpSanboxObj.pc;
  const tmpVm = new NodeVM({
      sandbox: tmpSanboxObj,
      require: {
        external: true,
        builtin: ['crypto']
      }
    }),
    tmpCodeEvalObj = tmpVm._context;
  tmpCodeEvalObj.pc = privateFun.constructUiCodeBasicFn(tmpCodeEvalObj, tmpBasicEnv, inputOpts);
  privateFun.setTypesRefFns(tmpCodeEvalObj.pc, inputData);
  let tmpTargetTypeData = tmpCodeEvalObj.pc[tmpApiType],
    tmpTargetTypeEnv = tmpCodeEvalObj.pc.env[tmpApiType],
    tmpNeedToExecRequestScript = tmpTargetTypeEnv.requestScript && !inputData.ingnoreRequestScript;
  if (inputScript || tmpNeedToExecRequestScript) {
    try {
      // // execute common function
      // if (inputOpts) {
      //   _LibsCommon.execFnDefine(inputOpts.functionCode || [], tmpVm, tmpCodeEvalObj.eo);
      // }
      if (!inputData.isReturnSoonWhenExecCode && tmpNeedToExecRequestScript) {
        tmpNowIsExecuteEnvScript = true;
        tmpVm.run(_LibsCommon.infiniteLoopDetector.wrap(tmpTargetTypeEnv.requestScript || '', 'pc.infiniteLoopDetector'));
      }
      tmpVm.run(_LibsCommon.infiniteLoopDetector.wrap(inputScript || '', 'pc.infiniteLoopDetector'));
    } catch (Err) {
      switch (Err) {
        case 'info':
        case 'interrupt':
        case 'illegal':
        case 'localhost':
        case 'timeout': {
          tmpStatus = 'terminateRequest';
          switch (Err) {
            case 'info': {
              tmpStatus = 'info';
              tmpErrorContent = 'pc.info 触发中断';
              break;
            }
            case 'interrupt': {
              tmpErrorContent = eval(global.eoLang['42c487b2-4b68-4dd1-834e-e1c978c8ea51']);
              break;
            }
            default: {
              tmpErrorContent = global.eoLang['d6fa1d73-6a43-477f-a6df-6752661c9df3'];
              break;
            }
          }
          break;
        }
        default: {
          tmpStatus = 'beforeCodeError';
          if (/^codeError_/.test(Err)) {
            tmpErrorContent = Err.split('codeError_')[1];
          } else {
            let tmpErrParseObj = _LibsCommon.execCodeErrWarning(Err);
            let tmpErrorLine = tmpErrParseObj.row,
              tmpErrorColumn = tmpErrParseObj.col,
              tmpFnName = tmpErrParseObj.fn; //不能删，错误信息的时候需要
            tmpErrorContent = tmpFnName
              ? eval(`\`${global.eoLang['publicFnExecuteErrMsg']}\``)
              : eval(`\`${global.eoLang['requestPreReduceErrMsg']}\``);
          }
        }
      }
    }
    if (tmpStatus) {
      return {
        status: tmpStatus,
        content: tmpErrorContent,
        url: tmpTargetTypeData.url.parse(),
        headers: tmpTargetTypeData.headerParam,
        params: tmpTargetTypeData.bodyParseParam || tmpTargetTypeData.bodyParam,
        env: privateFun.resetEnv(tmpBasicEnv, tmpCodeEvalObj.pc.env),
        reportList: tmpReportList
      };
    }
  }
  let tmpOutput = {
      status: 'finish',
      url: tmpTargetTypeData.apiUrl,
      headers: {},
      params: null,
      env: privateFun.resetEnv(tmpBasicEnv, tmpCodeEvalObj.pc.env),
      reportList: tmpReportList
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

        tmpParams = _Xml_Class.jsonToXml()(JSON.parse(tmpTargetTypeData.bodyParam), inputData.xmlAttrObj);
        break;
      }
      case '1': {
        tmpParams =
          typeof tmpTargetTypeData.bodyParam === 'string' ? tmpTargetTypeData.bodyParam : JSON.stringify(tmpTargetTypeData.bodyParam);
        break;
      }
    }
    let tmpEnvGlobals = Object.assign({}, global.eoTestGlobals || {}, tmpCodeEvalObj.pc.env.envParam || {});
    for (let key in tmpEnvGlobals) {
      let val = tmpEnvGlobals[key];
      let templateParamObject = {};
      let templateHeaderObject = {};
      for (let tmp_query_param_key in tmp_query_param_obj) {
        let tmp_query_param_val = _LibsCommon.replaceAll('{{' + key + '}}', val || '', tmp_query_param_obj[tmp_query_param_key]);
        delete tmp_query_param_obj[tmp_query_param_key];
        tmp_query_param_obj[_LibsCommon.replaceAll('{{' + key + '}}', val || '', tmp_query_param_key)] = tmp_query_param_val;
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
                          tmpParams[tmpHadReplaceString]
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
    tmpNowIsExecuteEnvScript,
    tmpBasicEnv = inputEnv || _LibsCommon.parseEnv();
  let tmpTitle = tmpNowIsExecuteEnvScript ? '环境-API 后置脚本' : inputOpts.title,
    tmpStatus,
    tmpErrorContent; //不可删，与提示预警有关
  let tmpBindObj = (inputOpts || {}).bindObj || {};
  const tmpVm = new NodeVM({
      sandbox: {
        CryptoJS: CryptoJS,
        $: $,
        window: window,
        document: document,
        eo: {
          info: (tmpInputMsg, tmpInputType) => {
            let tmpText;
            try {
              tmpText = typeof tmpInputMsg === 'object' ? JSON.stringify(tmpInputMsg) : tmpInputMsg;
            } catch (JSON_STRINGIFY_ERROR) {
              tmpText = tmpInputMsg.toString();
            }
            tmpReportList.push({
              content: tmpText,
              type: tmpInputType || 'throw'
            });
          },
          error: tmpInputMsg => {
            let tmpText;
            try {
              tmpText = typeof tmpInputMsg === 'object' ? JSON.stringify(tmpInputMsg) : tmpInputMsg;
            } catch (JSON_STRINGIFY_ERROR) {
              tmpText = tmpInputMsg.toString();
            }
            tmpReportList.push({
              content: tmpText,
              type: 'assert_error'
            });
            tmpErrorContent = eval(global.eoLang['assertError']);
            tmpStatus = 'assertError';
          },
          stop: tmpInputMsg => {
            let tmpText;
            try {
              tmpText = typeof tmpInputMsg === 'object' ? JSON.stringify(tmpInputMsg) : tmpInputMsg;
            } catch (JSON_STRINGIFY_ERROR) {
              tmpText = tmpInputMsg.toString();
            }
            tmpReportList.push({
              content: tmpText,
              type: 'interrupt'
            });
            throw 'interrupt';
          }
        },
        requestBody: tmpBindObj.requestBody || {},
        requestHeaders: tmpBindObj.requestHeaders || {},
        restParams: tmpBindObj.restParams || {},
        queryParams: tmpBindObj.queryParams || {},
        response: tmpBindObj.response || {},
        responseHeaders: (inputOpts || {}).responseHeaders
      },
      require: {
        external: true,
        builtin: ['crypto']
      }
    }),
    tmpCodeEvalObj = tmpVm._context;
  tmpCodeEvalObj.pc = privateFun.constructUiCodeBasicFn(tmpCodeEvalObj, tmpBasicEnv, inputOpts);
  privateFun.setTypesRefFns(
    tmpCodeEvalObj.pc,
    Object.assign({}, inputOpts, {
      response: inputData
    }),
    true
  );
  let tmpTargetTypeData = tmpCodeEvalObj.pc[tmpApiType],
    tmpTargetTypeEnv = tmpBasicEnv[tmpApiType];
  if (inputScript || tmpTargetTypeEnv.responseScript) {
    try {
      // _LibsCommon.execFnDefine(inputOpts.functionCode || [], tmpVm, tmpCodeEvalObj.eo);
      tmpVm.run(_LibsCommon.infiniteLoopDetector.wrap(inputScript || '', 'pc.infiniteLoopDetector'));
      if (!inputOpts.isReturnSoonWhenExecCode) {
        tmpNowIsExecuteEnvScript = true;
        tmpVm.run(_LibsCommon.infiniteLoopDetector.wrap(tmpTargetTypeEnv.responseScript || '', 'pc.infiniteLoopDetector'));
      }
    } catch (Err) {
      switch (Err) {
        case 'info':
        case 'interrupt':
        case 'illegal':
        case 'localhost':
        case 'timeout': {
          tmpStatus = 'terminateRequest';
          switch (Err) {
            case 'info': {
              tmpStatus = 'info';
              tmpErrorContent = 'pc.info 触发中断';
              break;
            }
            case 'interrupt': {
              tmpErrorContent = eval(global.eoLang['a589da5d-3c96-487c-8aaa-645acb3bd8f6']);
              break;
            }
            default: {
              tmpErrorContent = global.eoLang['d6fa1d73-6a43-477f-a6df-6752661c9df3'];
              break;
            }
          }
          break;
        }
        default: {
          tmpStatus = 'afterCodeError';
          if (/^codeError_/.test(Err)) {
            tmpErrorContent = Err.split('codeError_')[1];
          } else {
            let tmpErrParseObj = _LibsCommon.execCodeErrWarning(Err);
            let tmpErrorLine = tmpErrParseObj.row,
              tmpErrorColumn = tmpErrParseObj.col,
              tmpFnName = tmpErrParseObj.fn; //不能删，错误信息的时候需要
            tmpErrorContent = tmpFnName
              ? eval(`\`${global.eoLang['publicFnExecuteErrMsg']}\``)
              : eval(`\`${global.eoLang['responsePreReduceErrMsg']}\``);
          }
        }
      }
    }
    if (tmpStatus) {
      return {
        status: tmpStatus,
        errorReason: tmpErrorContent,
        env: privateFun.resetEnv(tmpBasicEnv, tmpCodeEvalObj.pc.env),
        reportList: tmpReportList
      };
    }
  }
  return {
    status: 'finish',
    content: tmpTargetTypeData.responseParam,
    env: privateFun.resetEnv(tmpBasicEnv, tmpCodeEvalObj.pc.env),
    reportList: tmpReportList
  };
};
privateFun.requestPreReduceByPromise = (inputData, inputCode, inputOptions) => {
  return new Promise(resolve => {
    let tmpResponse = privateFun.pmRuntime();
    // let tmpResponse = privateFun.parseBeforeCode(inputData, inputCode, inputOptions);
    resolve(tmpResponse);
  });
};
privateFun.responsePreReduceByPromise = (inputData, inputCode, inputEnv, inputOptions) => {
  return new Promise(resolve => {
    let tmpResponse = privateFun.parseAfterCode(inputData, inputCode, inputEnv, inputOptions);
    resolve(tmpResponse);
  });
};
exports.getMicrosToMs = privateFun.getMicrosToMs;
exports.getHttpTiming = privateFun.getHttpTiming;
exports.requestPreReduceByPromise = privateFun.requestPreReduceByPromise;
exports.responsePreReduceByPromise = privateFun.responsePreReduceByPromise;
