import { formatDate } from '@angular/common';
import { ApiTestRes, requestDataOpts } from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/test-server.model';

import { ApiBodyType } from '../../../../../../modules/api-shared/api.model';
import { ApiData } from '../../../../../../shared/services/storage/index.model';
import { TestLocalNodeData } from './local-node/api-server-data.model';
const METHOD = ['POST', 'GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
const PROTOCOL = ['http', 'https'];
const REQUEST_BODY_TYPE = ['formData', 'raw', 'json', 'xml', 'binary'];
const globalStorageKey = 'EO_TEST_VAR_GLOBALS';

/**
 * Handle Test url,such as replace rest
 *
 * @param uri
 * @param rest
 * @returns
 */
export const formatUri = (uri, rest = []) => {
  if (!Array.isArray(rest)) {
    return uri;
  }
  let result = uri;
  const restByName = rest.reduce((acc, val) => {
    if (!val.required || !val.name) {
      return acc;
    }
    return { ...acc, [val.name]: val.value === undefined ? val.example : val.value };
  }, {});
  Object.keys(restByName).forEach(restName => {
    try {
      result = result.replace(new RegExp(`{${restName}}`, 'g'), restByName[restName]);
    } catch (e) {}
  });
  return result;
};

export const eoFormatRequestData = (
  data: ApiData,
  opts: requestDataOpts = { env: {}, beforeScript: '', afterScript: '', lang: 'en', globals: {} },
  locale
) => {
  const formatList = inArr => {
    if (!Array.isArray(inArr)) {
      return [];
    }
    return inArr
      .filter(val => val.name)
      .map(val => ({
        checkbox: val.required,
        headerName: val.name,
        headerValue: val.value
      }));
  };
  const formatBody = inData => {
    switch (inData.requestBodyType) {
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
        return inData.requestBody;
      }
      case ApiBodyType['Form-data']: {
        const typeMUI = {
          string: '0',
          file: '1',
          boolean: '8',
          array: '12',
          object: '13',
          number: '14',
          null: '15'
        };
        return inData.requestBody
          .filter(val => val.name)
          .map(val => ({
            checkbox: val.required,
            listDepth: 0,
            paramKey: val.name,
            files: val.files?.map(file => file.content),
            paramType: typeMUI[val.type],
            paramInfo: val.value === undefined ? val.example : val.value
          }));
      }
    }
  };
  const result: TestLocalNodeData = {
    lang: opts.lang,
    globals: opts.globals,
    URL: formatUri(data.uri, data.restParams),
    method: data.method,
    methodType: METHOD.indexOf(data.method).toString(),
    httpHeader: PROTOCOL.indexOf(data.protocol),
    headers: formatList(data.requestHeaders),
    requestType: REQUEST_BODY_TYPE.indexOf(data.requestBodyType).toString(),
    apiRequestParamJsonType: ['object', 'array'].indexOf(data.requestBodyJsonType).toString(),
    params: formatBody(data),
    auth: { status: '0' },
    advancedSetting: { requestRedirect: 1, checkSSL: 0, sendEoToken: 1, sendNocacheToken: 0 },
    env: {
      paramList: (opts.env.parameters || []).map(val => ({ paramKey: val.name, paramValue: val.value })),
      frontURI: opts.env.hostUri
    },
    beforeInject: opts.beforeScript,
    afterInject: opts.afterScript,
    testTime: formatDate(new Date(), 'YYYY-MM-dd HH:mm:ss', locale)
  };
  return result;
};
export const eoFormatResponseData = ({ globals, report, history, id }): ApiTestRes => {
  let result: ApiTestRes;
  const reportList = report.reportList || [];
  //preScript code tips
  if (report.errorReason) {
    reportList.unshift({
      type: 'interrupt',
      content: report.errorReason
    });
  }
  //afterScript code tips
  if (report.response?.errorReason) {
    reportList.push({
      type: 'interrupt',
      content: report.response?.errorReason
    });
  }
  if (['error'].includes(report.status)) {
    result = {
      status: 'error',
      globals,
      id,
      response: {
        reportList
      }
    };
    return result;
  }
  let { httpCode, ...response } = history.resultInfo;
  response = {
    statusCode: httpCode,
    ...response,
    reportList,
    body: response.body || '',
    headers: response.headers.map(val => ({ name: val.key, value: val.value }))
  };
  (response = { blobFileName: report.blobFileName, ...response }),
    (result = {
      status: 'finish',
      id,
      globals,
      general: report.general,
      response,
      //For add test history
      history: {
        general: report.general,
        response,
        beforeScript: history.beforeInject,
        afterScript: history.afterInject,
        request: {
          uri: history.requestInfo.URL,
          method: history.requestInfo.method,
          protocol: PROTOCOL[history.requestInfo.apiProtocol],
          requestHeaders: history.requestInfo.headers,
          requestBodyType: REQUEST_BODY_TYPE[history.requestInfo.requestType],
          requestBody: history.requestInfo.params
        }
      }
    });
  if (result.history.request.requestBodyType === 'formData') {
    result.history.request.requestBody = result.history.request.requestBody.map(val => ({
      name: val.key,
      type: 'string',
      value: val.value
    }));
  }
  return result;
};
export const DEFAULT_UNIT_TEST_RESULT = {
  general: { redirectTimes: 0, downloadSize: 0, downloadRate: 0, time: '0.00ms' },
  response: {
    statusCode: 0,
    headers: [],
    testDeny: '0.00',
    responseLength: 0,
    responseType: 'text',
    reportList: [],
    body: $localize`The test service connection failed, please submit an Issue to contact the community`
  },
  report: {
    request: {
      requestHeaders: [{ name: 'Content-Type', value: 'application/json' }],
      requestBodyType: 'raw',
      requestBody: '{}'
    }
  },
  history: {
    request: {
      uri: 'http:///',
      method: 'POST',
      protocol: 'http',
      requestHeaders: [{ name: 'Content-Type', value: 'application/json' }],
      requestBodyJsonType: 'object',
      requestBodyType: 'raw',
      requestBody: '{}'
    }
  }
};

export const getGlobals = (): object => {
  let result = null;
  const global = localStorage.getItem(globalStorageKey);
  try {
    result = JSON.parse(global);
  } catch (e) {}
  return result || {};
};
export const setGlobals = globals => {
  if (!globals) {
    return;
  }
  localStorage.setItem(globalStorageKey, JSON.stringify(globals));
};
