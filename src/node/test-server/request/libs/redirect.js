(function () {
  'use strict';
  let url = require('url');

  class redirectClass {
    constructor() {}
    checkRedirectStatusFun(inputRes) {
      let tmpLocaltion = inputRes.headers['location'];
      if (inputRes.statusCode >= 300 && inputRes.statusCode < 400 && tmpLocaltion) {
        return {
          status: '3xx',
          uri: tmpLocaltion
        };
      }
      return {
        status: 'xxx'
      };
    }
    structureAjaxFun(inputOption, inputPostData, inputRes) {
      let tmp = {
        redirectStatusObject: this.checkRedirectStatusFun(inputRes),
        callbackArg: {
          postData: typeof inputPostData === 'string' ? inputPostData : Object.assign({}, inputPostData),
          options: null
        },
        protocol: null
      };
      switch (tmp.redirectStatusObject.status) {
        case '3xx': {
          tmp.callbackArg.options = Object.assign({}, inputOption, url.parse(tmp.redirectStatusObject.uri));
          break;
        }
        default: {
          return;
        }
      }
      if (!tmp.callbackArg.options.hostname) {
        tmp.callbackArg.options.hostname = inputOption.hostname;
        tmp.callbackArg.options.protocol = inputOption.protocol;
        tmp.callbackArg.options.port = inputOption.port;
        tmp.callbackArg.options.auth = inputOption.auth;
      }
      if (inputRes.statusCode !== 307) {
        delete tmp.callbackArg.postData;
        if (tmp.callbackArg.options.headers) {
          for (let key in tmp.callbackArg.options.headers) {
            if (/(host)|(content-type)|(content-length)/i.test(key)) {
              delete tmp.callbackArg.options.headers[key];
            }
          }
          if (tmp.callbackArg.options.hostname !== inputOption.hostname.split(':')[0]) {
            for (let key in tmp.callbackArg.options.headers) {
              if (/(authorization)/i.test(key)) {
                delete tmp.callbackArg.options.headers[key];
                break;
              }
            }
          }
        }
      }
      switch (inputRes.statusCode) {
        case 301:
        case 302:
        case 303: {
          tmp.callbackArg.options.method = 'GET';
          break;
        }
      }
      return tmp.callbackArg;
    }
  }
  exports.core = redirectClass;
})();
