(function () {
  'use strict';
  let _RedirectClass = require('./redirect');
  let _ApiUtil = require('./apiUtil');
  let _LibsCommon = require('./common');
  let _HttpPackageClass = new (require('./http.package').core)();
  const CONFIG = require('../config.json');
  let url = require('url'),
    querystring = require('querystring');
  class Main {
    constructor(input_args, input_callback) {
      if (Object.prototype.toString.call(input_args) === '[object SharedArrayBuffer]') {
        global._WORKER_DATA = input_args;
        return;
      }
      try {
        switch (input_args.opr) {
          case 'exec_http': {
            this.execute(input_args.data, input_args.env, input_args.opts, null, tmp_input_res => {
              this.wakeTopThread(tmp_input_res);
            });
            break;
          }
        }
      } catch (EXEC_ERR) {
        console.error(EXEC_ERR);
        this.wakeTopThread(EXEC_ERR.stack || EXEC_ERR);
      }
      return this.EXEC_RESULT;
    }
    //执行ajax http请求
    async execute(input_test_data, input_env, input_opts, input_callback, input_return_callback) {
      let tmp_request_script_data = {};
      input_test_data = _LibsCommon.deepCopy(input_test_data);
      input_env = input_env || _LibsCommon.parseEnv();
      let tmp_target_type_env = input_env.http;
      if (input_test_data.requestScript || tmp_target_type_env.requestScript) {
        tmp_request_script_data = _ApiUtil.scriptExecuteBeforeCode(input_test_data, input_test_data.requestScript || '', {
          env: input_env,
          fnCodeArr: input_opts.fnCodeArr
        });
        if (tmp_request_script_data.status === 'success') {
          input_test_data = tmp_request_script_data.data;
          input_env = tmp_request_script_data.env;
        }
      }
      tmp_target_type_env = input_env.http;
      if (input_test_data.timelimit === 'follow') {
        input_test_data.timelimit = global._TIMEOUTLIMIT || CONFIG.MAX_TIME_LIMIT;
        input_test_data.timelimitType = global._TIMEOUTLIMITTYPE || 'totalTime';
      }
      let tmp_result;
      await new Promise(function (resolve, reject) {
        let tmp_report_data = {
            reportList: tmp_request_script_data.reportList || [],
            response: ''
          },
          tmp_response_str = '';
        if (!input_test_data.hasOwnProperty('params') && input_test_data.hasOwnProperty('body')) {
          input_test_data.params = input_test_data.body;
          input_test_data.isBody = true;
        }
        if (Object.prototype.toString.call(input_test_data.params) === '[object Array]') {
          input_test_data.params = input_test_data.params;
        } else if (typeof input_test_data.params == 'object') {
          input_test_data.params = Object.assign({}, tmp_target_type_env.extraFormDataParam, input_test_data.params);
        } else {
          input_test_data.params = (input_test_data.params || '').toString();
        }
        input_test_data.headers = Object.assign({}, tmp_target_type_env.headerParam, input_test_data.headers || {});
        let template = {
            urlObject: {},
            matchUrlArray: [],
            chunk: {
              array: [],
              length: 0
            },
            queryParam: [],
            jwt: ''
          },
          tmp_test_data = _ApiUtil.parseApiByEnvGlobalParam(input_test_data, input_env.envParam),
          tmp_ajax_xhr,
          tmp_post_data,
          tmp_multi_form;
        tmp_test_data.url = _ApiUtil.parseUri(tmp_test_data.url, tmp_target_type_env.baseUrlParam);
        template.queryParam = url.parse(tmp_test_data.url).query || [];
        input_env.envAuth = input_env.envAuth || {};
        switch (input_env.envAuth.status) {
          case '1': {
            if (input_env.envAuth.basicAuth) {
              tmp_test_data.headers['Authorization'] =
                'Basic ' +
                Buffer.from((input_env.envAuth.basicAuth.username || '') + ':' + (input_env.envAuth.basicAuth.password || '')).toString(
                  'base64'
                );
            }
            break;
          }
          case '2': {
            template.jwt = _LibsCommon.jwt(
              {
                alg: input_env.envAuth.jwtAuth.alg,
                typ: 'JWT'
              },
              input_env.envAuth.jwtAuth.payload,
              input_env.envAuth.jwtAuth.secretSalt
            );
            if (template.jwt == 'jwtError') {
              throw 'jwtError';
            } else if (input_env.envAuth.jwtAuth.isBearer) {
              template.jwt = `Bearer ${template.jwt}`;
            }
            switch (input_env.envAuth.jwtAuth.position) {
              case 'header': {
                tmp_test_data.headers[input_env.envAuth.jwtAuth.tokenName || 'tokenName'] = template.jwt;
                break;
              }
              case 'query': {
                if (tmp_test_data.url.indexOf('?') > -1) {
                  tmp_test_data.url +=
                    (template.queryParam.length > 0 ? '&' : '') + (input_env.envAuth.jwtAuth.tokenName || 'tokenName') + '=' + template.jwt;
                } else {
                  tmp_test_data.url += '?' + (input_env.envAuth.jwtAuth.tokenName || 'tokenName') + '=' + template.jwt;
                }
                break;
              }
            }

            break;
          }
        }
        let tmp_query_str = querystring.stringify(
          Object.assign({}, tmp_target_type_env.queryParam, querystring.parse(url.parse(tmp_test_data.url).query))
        );
        if (tmp_query_str) {
          let tmp_url_param_index = tmp_test_data.url.indexOf('?');
          if (tmp_url_param_index > -1) {
            tmp_test_data.url = `${tmp_test_data.url.substr(0, tmp_url_param_index)}?${tmp_query_str}`;
          } else {
            tmp_test_data.url = `${tmp_test_data.url}?${tmp_query_str}`;
          }
        }
        template.urlObject = url.parse(tmp_test_data.url);
        let tmp_test_opts = {
          path: template.urlObject.path,
          hostname: template.urlObject.hostname,
          port: template.urlObject.port,
          protocol: template.urlObject.protocol,
          headers: tmp_test_data.headers,
          method: input_test_data.method || 'GET'
        };
        if (/"content-type":"multipart\/form-data/i.test(JSON.stringify(tmp_test_data.headers))) {
          tmp_test_data.isMuti = true;
        }
        tmp_post_data = tmp_test_data.params;
        if (input_test_data.bodyType !== 'binary') {
          tmp_report_data.requestBody = {
            body: tmp_test_data.params,
            requestType: typeof tmp_post_data == 'string' ? 1 : 0
          };
          if (tmp_test_data.isMuti) {
            let tmpMutiCallbackObj = _ApiUtil.parseRequestBody(tmp_post_data);
            tmp_multi_form = tmpMutiCallbackObj.class;
            tmp_report_data.requestBody.body = typeof tmp_test_data.params == 'object' ? tmpMutiCallbackObj.params : tmp_post_data;
          } else {
            tmp_post_data = typeof tmp_post_data == 'object' ? querystring.stringify(tmp_post_data || {}) : tmp_post_data;
          }
        } else {
          tmp_report_data.requestBody = {
            body: `[binary]${tmp_test_data.binaryFileName}`,
            requestType: 1
          };
        }
        try {
          tmp_report_data.general = {
            redirectTimes: 0,
            downloadSize: 0,
            downloadRate: 0,
            requestUrl: tmp_test_data.url,
            requestMethod: tmp_test_opts.method,
            name: input_test_data.name,
            timeLimit: input_test_data.timelimit
          };
          if (input_test_data.timelimit > CONFIG.MAX_TIME_LIMIT || !input_test_data.timelimit) {
            input_test_data.timelimit = CONFIG.MAX_TIME_LIMIT;
          }
          tmp_report_data.requestHeaders = tmp_test_opts.headers;
          if (tmp_test_data.isMuti) {
            tmp_test_opts.headers = Object.assign({}, tmp_test_opts.headers, tmp_multi_form.getHeaders());
          } else {
            let tmpJsonStringifyHeaders = JSON.stringify(tmp_test_opts.headers);
            if (!/"content-length":/i.test(tmpJsonStringifyHeaders)) {
              tmp_test_opts.headers['Content-length'] = Buffer.byteLength(tmp_post_data);
            }
            if (!/"content-type":/i.test(tmpJsonStringifyHeaders)) {
              tmp_test_opts.headers['Content-Type'] = tmp_test_data.contentType || 'application/x-www-form-urlencoded';
            }
          }
          tmp_test_opts.headers = _HttpPackageClass.setCookieToHeaders(
            tmp_test_opts.headers,
            tmp_test_opts.hostname,
            input_opts.globalHeader
          );
          if (tmp_request_script_data.status && tmp_request_script_data.status !== 'success') {
            tmp_report_data.general.time = '0.00ms';
            tmp_report_data.general.status = tmp_request_script_data.status;
            tmp_report_data.errorReason = [tmp_request_script_data.msg];
            if (input_callback) input_callback(tmp_report_data);
            reject('error');
            return;
          }
          let tmp_fn_check_is_illegal_url = (tmp_input_hostname, tmp_input_total_time) => {
              let tmp_is_localhost = new RegExp(_LibsCommon.LOCAL_REGEXP_CONST).test(tmp_input_hostname);
              if (!tmp_input_hostname || tmp_is_localhost) {
                tmp_report_data.general.time = tmp_input_total_time.toFixed(2) + 'ms';
                tmp_report_data.general.status = 'error';
                if (input_callback) input_callback(tmp_report_data);
                if (tmp_is_localhost) {
                  tmp_report_data.isLocal = true;
                  tmp_report_data.errorReason = [global.eoLang['63be68fa-31fc-498c-b49c-d3b6db10a95b']];
                  reject('localhost');
                } else {
                  tmp_report_data.errorReason = [global.eoLang['d6fa1d73-6a43-477f-a6df-6752661c9df3']];
                  reject('illegal');
                }
                return true;
              }
            },
            tmp_fn_parse_ajax_resolve = tmp_input_total_time => {
              tmp_report_data.general.time = tmp_input_total_time.toFixed(2) + 'ms';
              tmp_report_data.env = input_env;
              if (input_callback) input_callback(tmp_report_data);
              try {
                return {
                  time: tmp_report_data.general.time,
                  code: tmp_report_data.general.statusCode,
                  response: tmp_response_str,
                  header: tmp_report_data.responseHeaders
                };
              } catch (childE) {
                return {
                  time: tmp_report_data.general.time,
                  code: tmp_report_data.general.statusCode,
                  response: tmp_response_str,
                  header: tmp_report_data.responseHeaders
                };
              }
            };
          if (tmp_fn_check_is_illegal_url(tmp_test_opts.hostname, 0)) return;
          if (tmp_test_opts.method == 'GET') {
            template.matchUrlArray = tmp_test_opts.path.split('?');
            if (template.matchUrlArray.length > 2) {
              template.matchUrlArray = template.matchUrlArray.slice(2).join('?').split('&');
              tmp_test_opts.path += '&' + template.matchUrlArray[0];
            }
          }
          let tmp_fn_ajax_err = (tmp_input_err, tmp_input_total_time) => {
              if (tmp_report_data.general.status == 'timeout') {
                if (typeof input_test_data.timelimitContinue == 'boolean' && !input_test_data.timelimitContinue) {
                  tmp_report_data.general.time = tmp_input_total_time.toFixed(2) + 'ms';
                  if (input_callback) input_callback(tmp_report_data);
                  reject('timeout');
                } else {
                  resolve(tmp_fn_parse_ajax_resolve(tmp_input_total_time));
                }
                return;
              }
              tmp_report_data.general.status = 'error';
              tmp_report_data.errorReason = [tmp_input_err.name + '：' + tmp_input_err.message];
              // tmp_report_data.reportList.push({
              //     type: 'error',
              //     content: tmp_input_err.name + '：' + tmp_input_err.message
              // });
              resolve(tmp_fn_parse_ajax_resolve(tmp_input_total_time));
            },
            tmp_fn_ajax_end = (tmp_input_res, tmp_input_res_obj) => {
              tmp_response_str = tmp_report_data.response = tmp_input_res_obj.str;
              tmp_report_data.general['statusCode'] = tmp_input_res.statusCode;
              tmp_report_data.general.downloadSize = tmp_input_res_obj.chunk.length;
              tmp_report_data.general.downloadRate = (
                (tmp_input_res_obj.chunk.length / tmp_input_res_obj.contentDeliveryTiming / 1024) *
                1000
              ).toFixed(2);
              if (input_test_data.responseScript || tmp_target_type_env.responseScript) {
                let tmpExecutResponseScriptResult = _ApiUtil.scriptExecuteAfterCode(
                  {
                    response: tmp_response_str
                  },
                  input_test_data.responseScript,
                  {
                    env: input_env,
                    functionCode: input_opts.fnCodeArr,
                    globalHeader: input_opts.globalHeader,
                    responseHeaders: tmp_input_res.headers,
                    body: input_test_data.params || input_test_data.body,
                    headers: tmp_ajax_xhr.getHeaders(),
                    query: querystring.parse(url.parse(input_test_data.url).query)
                  }
                );
                tmp_report_data.reportList = [...tmp_report_data.reportList, ...(tmpExecutResponseScriptResult.reportList || [])];
                if (tmpExecutResponseScriptResult.status && tmpExecutResponseScriptResult.status !== 'success') {
                  tmp_report_data.errorReason = [tmpExecutResponseScriptResult.msg];
                  tmp_report_data.general.status = tmpExecutResponseScriptResult.status;
                  tmp_report_data.general.time = tmp_input_res_obj.totalTime.toFixed(2) + 'ms';
                  if (input_callback) input_callback(tmp_report_data);
                  reject('error');
                  return;
                }
                input_env = tmpExecutResponseScriptResult.env;
                tmp_response_str = tmp_report_data.response = tmpExecutResponseScriptResult.data;
              }
              _ApiUtil
                .parseResponse(tmp_input_res.headers, Buffer.concat(tmp_input_res_obj.chunk.array, tmp_input_res_obj.chunk.length), {
                  path: tmp_test_opts.path,
                  size: tmp_report_data.general.downloadSize
                })
                .then(tmp_input_file_obj => {
                  tmp_report_data.returnResultType = tmp_input_file_obj.type;
                  if (tmp_input_file_obj.name) tmp_report_data.general.downloadUrl = tmp_input_file_obj.name;
                  tmp_report_data.general.status = 'finish';
                  tmp_report_data.responseHeaders = tmp_input_res.headers;
                  resolve(tmp_fn_parse_ajax_resolve(tmp_input_res_obj.totalTime));
                });
            };
          let tmp_timeout_type_obj = {
              total: 0,
              first_byte: 1
            },
            tmp_advanced_setting = {};
          if (input_test_data.sendNocacheToken) {
            tmp_advanced_setting.sendNocacheToken = 1;
          }
          if (input_test_data.checkSSL) {
            tmp_advanced_setting.checkSSL = 1;
          }
          if (input_test_data.sendEoToken) {
            tmp_advanced_setting.sendEoToken = 1;
          }
          _HttpPackageClass.socketReduce(
            {
              postData: tmp_test_data.isMuti ? tmp_multi_form : tmp_post_data,
              isMuti: tmp_test_data.isMuti,
              options: tmp_test_opts,
              timeoutLimit: input_test_data.timelimit,
              globalHeader: input_opts.globalHeader,
              timeoutLimitType: tmp_timeout_type_obj[input_test_data.timelimitType] || 'totalTime',
              advancedSetting: tmp_advanced_setting,
              messageEncoding: input_test_data.encode || 'utf-8'
            },
            (tmp_input_ajax_status, tmp_input_data_obj, tmp_input_xhr) => {
              tmp_ajax_xhr = tmp_input_xhr;
              if (tmp_input_ajax_status === 'ajaxTimeout') {
                tmp_report_data.general.status = 'timeout';
                return;
              }
              let tmp_http_total_time = _ApiUtil.getMicrosToMs(tmp_input_data_obj.summaryObj.startAt, tmp_input_data_obj.summaryObj.endAt);
              tmp_report_data.general.timingSummary = [_ApiUtil.getHttpTiming(tmp_input_data_obj.summaryObj)];
              switch (tmp_input_ajax_status) {
                case 'ajax_end': {
                  tmp_report_data.requestHeaders = tmp_ajax_xhr.getHeaders();
                  if (input_test_data.redirect || !input_test_data.hasOwnProperty('redirect')) {
                    let tmp_redirect_class = new _RedirectClass.core();
                    let tmp_redirect_obj = tmp_redirect_class.structureAjaxFun(
                      tmp_test_opts,
                      tmp_multi_form ? tmp_multi_form : tmp_post_data,
                      tmp_input_data_obj.res
                    );
                    if (tmp_redirect_obj) {
                      tmp_report_data.general.redirectTimes++;
                      if (tmp_fn_check_is_illegal_url(tmp_redirect_obj.options.hostname, tmp_http_total_time)) return;
                      _HttpPackageClass.socketReduce(
                        {
                          postData: tmp_redirect_obj.postData,
                          isMuti: tmp_test_data.isMuti,
                          options: tmp_redirect_obj.options,
                          timeoutLimit: input_test_data.timelimit - tmp_http_total_time,
                          globalHeader: input_opts.globalHeader,
                          advancedSetting: tmp_advanced_setting,
                          messageEncoding: input_test_data.encode || 'utf-8'
                        },
                        (tmpInputRedirectAjaxStatus, tmpInputRedirectDataObj) => {
                          if (tmpInputRedirectAjaxStatus === 'ajaxTimeout') {
                            tmp_report_data.general.status = 'timeout';
                            return;
                          }
                          let tmpRedirectHttpTotalTime = _ApiUtil.getMicrosToMs(
                            tmpInputRedirectDataObj.summaryObj.startAt,
                            tmpInputRedirectDataObj.summaryObj.endAt
                          );
                          tmp_report_data.general.timingSummary.push(_ApiUtil.getHttpTiming(tmpInputRedirectDataObj.summaryObj));
                          switch (tmpInputRedirectAjaxStatus) {
                            case 'ajax_end': {
                              tmp_fn_ajax_end(tmpInputRedirectDataObj.res, {
                                chunk: tmpInputRedirectDataObj.chunk,
                                str: tmpInputRedirectDataObj.responseStr,
                                totalTime: tmp_http_total_time + tmpRedirectHttpTotalTime,
                                contentDeliveryTiming: _ApiUtil.getMicrosToMs(
                                  tmpInputRedirectDataObj.summaryObj.firstByteTiming,
                                  tmpInputRedirectDataObj.summaryObj.endAt
                                )
                              });
                              break;
                            }
                            case 'ajaxErr': {
                              tmp_fn_ajax_err(tmpInputRedirectDataObj.errObj, tmp_http_total_time + tmpRedirectHttpTotalTime);
                              break;
                            }
                          }
                        }
                      );
                      return;
                    }
                  }
                  tmp_fn_ajax_end(tmp_input_data_obj.res, {
                    chunk: tmp_input_data_obj.chunk,
                    str: tmp_input_data_obj.responseStr,
                    totalTime: tmp_http_total_time,
                    contentDeliveryTiming: _ApiUtil.getMicrosToMs(
                      tmp_input_data_obj.summaryObj.firstByteTiming,
                      tmp_input_data_obj.summaryObj.endAt
                    )
                  });
                  break;
                }
                case 'ajaxErr': {
                  tmp_fn_ajax_err(tmp_input_data_obj.errObj, tmp_http_total_time);
                  break;
                }
              }
            }
          );
        } catch (e) {
          _HttpPackageClass.clearAjaxTimeout();
          console.error(new Date() + 'automated pro.js 433：', e);
          tmp_report_data.reportList.push({
            type: 'error',
            content: e.name + '：' + e.message
          });
          resolve(tmp_fn_parse_ajax_resolve(0));
        }
      })
        .then(response => {
          tmp_result = response;
        })
        .catch(error => {
          tmp_result = error;
        });
      if (input_test_data.delay) {
        await new Promise(resolve => {
          setTimeout(
            () => {
              resolve('success');
            },
            input_test_data.delay > CONFIG.MAX_TIME_DELAY ? CONFIG.MAX_TIME_DELAY : input_test_data.delay || 0
          );
        });
      }
      input_return_callback(tmp_result);
    }
    //异步操作，作用于纤程唤起
    wakeTopThread(input_text, input_current_fibers) {
      this.EXEC_RESULT = input_text;
      if (input_current_fibers) input_current_fibers.run();
    }
  }
  exports.core = Main;
})();
