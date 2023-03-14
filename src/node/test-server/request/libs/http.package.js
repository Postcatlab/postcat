(function () {
  'use strict';
  var http = require('http'),
    https = require('https'),
    zlib = require('zlib'),
    iconv = require('iconv-lite');
  const _LibsEncrypt = require('./encrypt').core;
  global.PROXY_OBJ = {};
  const SOCKET_HANG_UP_TIP_TEXT_OBJ = {
    SAAS_SERVER: '无法访问目标地址，请检查接口是否能被正常访问'
  };
  class mainClass {
    constructor() {}
    /**
     * @desc 设置默认的请求头部
     */
    setDefaultRequestHeader(inputHeaderObj = {}, inputOptions = {}) {
      let TMP_DEAFULT_HEADER_OBJ = {
        'User-Agent': 'Postcat',
        Accept: '*/*'
      };
      if (inputOptions.sendNocacheToken) {
        TMP_DEAFULT_HEADER_OBJ['Cache-Control'] = 'no-cache';
      }
      if (inputOptions.sendEoToken) {
        TMP_DEAFULT_HEADER_OBJ['Eo-Token'] = _LibsEncrypt.uuidGeneration();
      }
      let tmpRepareStr = JSON.stringify(inputHeaderObj);
      for (let key in TMP_DEAFULT_HEADER_OBJ) {
        let val = TMP_DEAFULT_HEADER_OBJ[key];
        if (!new RegExp(`"${key}":`, 'i').test(tmpRepareStr)) {
          inputHeaderObj[key] = val;
        }
      }
    }
    /**
     * @desc ajax请求数据信息处理
     */
    socketReduce(inputTestData = {}, inputCallback) {
      let _MainClass = this;
      async function main() {
        let tmpEncoding = inputTestData.messageEncoding || 'utf-8';
        inputTestData.advancedSetting = inputTestData.advancedSetting || {
          requestRedirect: 1,
          sendNocacheToken: 0,
          checkSSL: 0,
          sendEoToken: 1
        };
        let tmpSummaryObj = {
            startAt: undefined,
            dnsTiming: undefined,
            tcpTiming: undefined,
            tlsTiming: undefined,
            requestSentTiming: undefined,
            firstByteTiming: undefined,
            endAt: undefined
          },
          tmpChunk = {
            array: [],
            length: 0
          },
          tmpAjaxXhr = {},
          tmpResponseString = '',
          tmpProtocol,
          tmpTimer;
        if (inputTestData.options.method == 'GET') {
          let tmpMatchUrlArr = inputTestData.options.path.split('?');
          if (tmpMatchUrlArr.length > 2) {
            tmpMatchUrlArr = tmpMatchUrlArr.slice(2).join('?').split('&');
            inputTestData.options.path += '&' + tmpMatchUrlArr[0];
          }
        }
        switch (inputTestData.options.protocol) {
          case 'https:': {
            if (!inputTestData.advancedSetting.checkSSL) {
              inputTestData.options.rejectUnauthorized = false;
              inputTestData.options.minVersion = 'TLSv1';
            }
            tmpProtocol = https;
            break;
          }
          default: {
            tmpProtocol = http;
            break;
          }
        }
        _MainClass.setDefaultRequestHeader(inputTestData.options.headers, inputTestData.advancedSetting);
        let tmpPathArr = (inputTestData.options.path || '').split('?');
        tmpPathArr[0] = encodeURI(decodeURI(tmpPathArr[0]));
        inputTestData.options.path = tmpPathArr.join('?');
        try {
          tmpAjaxXhr = tmpProtocol.request(inputTestData.options, tmpInputRes => {
            tmpInputRes.on('data', tmpInputChunk => {
              tmpChunk.array.push(tmpInputChunk);
              tmpChunk.length += tmpInputChunk.length;
              tmpResponseString += tmpInputChunk;
            });
            tmpInputRes.once('readable', () => {
              if (inputTestData.timeoutLimitType === 'firstByte' && tmpTimer) {
                //首字节时间超时
                clearTimeout(tmpTimer);
              }
              tmpSummaryObj.firstByteTiming = process.hrtime();
            });
            tmpInputRes.on('end', () => {
              tmpSummaryObj.endAt = process.hrtime();
              if (tmpTimer) {
                clearTimeout(tmpTimer);
              }
              if (tmpInputRes.headers['set-cookie']) {
                _MainClass.setCookieToHeaders(
                  {
                    cookie: tmpInputRes.headers['set-cookie'].join(';')
                  },
                  inputTestData.options.hostname,
                  inputTestData.globalHeader
                );
              }
              let tmpBuffer = Buffer.concat(tmpChunk.array, tmpChunk.length);
              let tmpFnZlibCallback = (inputErr, inputBuff) => {
                if (!inputErr) {
                  tmpBuffer = inputBuff;
                }
                if (tmpEncoding === 'gbk') {
                  tmpBuffer = Buffer.from(iconv.decode(tmpBuffer, 'gbk'));
                }
                let tmpResponseStr;
                if (inputTestData.pckSplitByHeader) {
                  //是否分割报文头
                  tmpResponseStr = tmpBuffer.toString('utf8', 4);
                } else {
                  tmpResponseStr = tmpBuffer.toString('utf8');
                }
                inputCallback(
                  'ajax_end',
                  {
                    res: tmpInputRes,
                    chunk: tmpChunk,
                    responseStr: tmpResponseStr,
                    summaryObj: tmpSummaryObj
                  },
                  tmpAjaxXhr
                );
              };
              switch (tmpInputRes.headers['content-encoding']) {
                case 'br': {
                  zlib.brotliDecompress(tmpBuffer, tmpFnZlibCallback);
                  break;
                }
                case 'gzip': {
                  zlib.gunzip(tmpBuffer, tmpFnZlibCallback);
                  break;
                }
                case 'deflate': {
                  zlib.inflate(tmpBuffer, tmpFnZlibCallback);
                  break;
                }
                default: {
                  tmpFnZlibCallback(true, tmpBuffer);
                  break;
                }
              }
            });
          });
        } catch (REQUEST_ERR) {
          inputCallback(
            'ajaxErr',
            {
              summaryObj: tmpSummaryObj,
              errObj: REQUEST_ERR
            },
            tmpAjaxXhr
          );
          return;
        }

        tmpAjaxXhr.on('socket', socket => {
          tmpSummaryObj.startAt = process.hrtime();
          _MainClass.ajaxTimer = tmpTimer = setTimeout(function () {
            tmpSummaryObj.endAt = process.hrtime();
            inputCallback(
              'ajaxTimeout',
              {
                summaryObj: tmpSummaryObj
              },
              tmpAjaxXhr
            );
            clearTimeout(tmpTimer);
            tmpAjaxXhr.abort();
          }, inputTestData.timeoutLimit);
          socket.on('lookup', () => {
            tmpSummaryObj.dnsTiming = process.hrtime();
          });
          socket.on('connect', () => {
            tmpSummaryObj.tcpTiming = process.hrtime();
          });
          socket.on('secureConnect', () => {
            tmpSummaryObj.tlsTiming = process.hrtime();
          });
        });

        tmpAjaxXhr.on('error', tmpInputErr => {
          if (tmpTimer) clearTimeout(tmpTimer);
          inputCallback(
            'ajaxErr',
            {
              summaryObj: tmpSummaryObj,
              errObj: /getaddrinfo enotfound/i.test(tmpInputErr.message)
                ? {
                    name: 'API请求地址有误',
                    message: '请检查是否正确填写URL以及URL是否允许访问'
                  }
                : /socket hang up/i.test(tmpInputErr.message)
                ? {
                    name: '请求错误',
                    message:
                      SOCKET_HANG_UP_TIP_TEXT_OBJ['SAAS_SERVER'] ||
                      '无法访问目标地址，请检查接口是否能被正常访问，是否存在网络隔离或防火墙。'
                  }
                : tmpInputErr
            },
            tmpAjaxXhr
          );
        });
        if (!inputTestData.postData) {
          tmpAjaxXhr.end();
        } else if (inputTestData.isMuti) {
          inputTestData.postData.getLength((tmpInputErr, tmpInputLength) => {
            if (!tmpInputErr) {
              tmpAjaxXhr.setHeader('content-length', tmpInputLength);
            }
            inputTestData.postData.pipe(tmpAjaxXhr);
          });
        } else {
          if (typeof inputTestData.postData === 'string') {
            if (tmpEncoding === 'gbk') {
              inputTestData.postData = iconv.encode(inputTestData.postData, 'gbk');
              tmpAjaxXhr.setHeader('Content-Length', Buffer.byteLength(inputTestData.postData));
            } else {
              inputTestData.postData = Buffer.from(inputTestData.postData);
            }
            if (inputTestData.pckSplitByHeader)
              inputTestData.postData = _MainClass.writeInt(inputTestData.postData, Buffer.byteLength(inputTestData.postData, tmpEncoding));
          }
          tmpAjaxXhr.write(inputTestData.postData);
          tmpAjaxXhr.end();
        }
      }
      main();
    }
    writeInt(inputBuff, inputLen) {
      let tmpBytes = new Array(4);
      tmpBytes[0] = inputLen >> 24;
      tmpBytes[1] = inputLen >> 16;
      tmpBytes[2] = inputLen >> 8;
      tmpBytes[3] = inputLen;
      return Buffer.concat([new Buffer(tmpBytes), inputBuff]);
    }
    /**
     * @desc 将cookie注入headers
     */
    setCookieToHeaders(inputHeaders, inputDomain, inputGlobalObj) {
      inputGlobalObj = inputGlobalObj || {};
      let tmpReturnObj,
        tmpSplitCookieArr = [],
        tmpSplitCookieParamArr = [],
        tmpTargetCookirStr = '';
      try {
        tmpReturnObj = JSON.parse(JSON.stringify(inputHeaders || {}).replace(/"cookie":/i, '"cookie":'));
        if (!inputGlobalObj[inputDomain]) {
          for (let key in inputGlobalObj) {
            if (inputDomain.indexOf(key) > -1) {
              inputDomain = key;
              break;
            }
          }
        }
        if (tmpReturnObj.cookie) {
          tmpSplitCookieArr = tmpReturnObj.cookie.split(';');
          if (inputGlobalObj[inputDomain]) {
            if (inputGlobalObj[inputDomain]['cookie']) {
              tmpTargetCookirStr = inputGlobalObj[inputDomain]['cookie'][0] || '';
              for (let key in tmpSplitCookieArr) {
                if (tmpSplitCookieArr[key]) {
                  let splitString = tmpSplitCookieArr[key].split('=')[0];
                  if (tmpTargetCookirStr.indexOf(splitString) > -1) {
                    tmpSplitCookieParamArr = tmpTargetCookirStr.split(splitString + '=');
                    if (tmpSplitCookieParamArr.length > 1) {
                      tmpTargetCookirStr = tmpTargetCookirStr.replace(
                        splitString + '=' + tmpSplitCookieParamArr[1].split(';')[0],
                        tmpSplitCookieArr[key]
                      );
                    } else {
                      tmpTargetCookirStr = tmpTargetCookirStr.replace(splitString, tmpSplitCookieArr[key]);
                    }
                  } else {
                    tmpTargetCookirStr = tmpTargetCookirStr + (/;$/.test(tmpTargetCookirStr) ? '' : ';') + tmpSplitCookieArr[key];
                  }
                }
              }
              inputGlobalObj[inputDomain]['cookie'] = [tmpTargetCookirStr];
            } else {
              inputGlobalObj[inputDomain]['cookie'] = [tmpReturnObj.cookie];
            }
          } else {
            inputGlobalObj[inputDomain] = {
              cookie: [tmpReturnObj.cookie]
            };
          }
        }
      } catch (e) {}
      if (inputGlobalObj[inputDomain]) {
        tmpReturnObj.cookie = inputGlobalObj[inputDomain]['cookie'].join(';');
      }
      return tmpReturnObj;
    }
    clearAjaxTimeout() {
      if (this.ajaxTimer) clearTimeout(this.ajaxTimer);
    }
  }
  exports.core = mainClass;
})();
