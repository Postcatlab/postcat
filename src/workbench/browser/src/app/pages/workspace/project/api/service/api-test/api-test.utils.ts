import { formatDate } from '@angular/common';
import { ApiBodyType, ApiParamsType, JsonRootType, requestMethodMap } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import {
  TestServerRes,
  requestDataOpts,
  ApiTestResData
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/test-server.model';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BodyParam, RestParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

import { TestLocalNodeData } from './local-node/api-server-data.model';
const globalStorageKey = 'EO_TEST_VAR_GLOBALS';

/**
 * Handle Test url,such as replace rest
 *
 * @param uri
 * @param rest
 * @returns
 */
export const formatUri = (uri, rest: RestParam[] = []) => {
  if (!Array.isArray(rest)) {
    return uri;
  }
  let result = uri;
  const restByName = rest.reduce((acc, val) => {
    if (!(val.isRequired && val.name)) {
      return acc;
    }
    return { ...acc, [val.name]: val.paramAttr?.example || '' };
  }, {});
  Object.keys(restByName).forEach(restName => {
    try {
      result = result.replace(new RegExp(`{${restName}}`, 'g'), restByName[restName]);
    } catch (e) {}
  });
  return result;
};

export const eoFormatRequestData = (data: ApiData, opts: requestDataOpts = { env: {}, lang: 'en', globals: {} }, locale) => {
  const formatHeaders = inArr => {
    if (!Array.isArray(inArr)) {
      return [];
    }
    return inArr
      .filter(val => val.name)
      .map((val: BodyParam) => ({
        checkbox: !!val.isRequired,
        headerName: val.name,
        headerValue: val.paramAttr.example
      }));
  };
  const formatBody = (inData: ApiData) => {
    switch (inData.apiAttrInfo.contentType) {
      case ApiBodyType.Binary:
      case ApiBodyType.Raw: {
        return inData.requestParams.bodyParams[0].binaryRawData;
      }
      case ApiBodyType['FormData']: {
        return inData.requestParams.bodyParams
          .filter(val => val.name)
          .map(val => ({
            checkbox: !!val.isRequired,
            listDepth: 0,
            paramKey: val.name,
            //@ts-ignore
            files: val.files?.map(file => file.content),
            paramType: val.dataType === ApiParamsType.file ? '1' : '0',
            paramInfo: val.paramAttr?.example
          }));
      }
    }
  };
  const result: TestLocalNodeData = {
    lang: opts.lang,
    globals: opts.globals,
    URL: formatUri(data.uri, data.requestParams.restParams),
    method: requestMethodMap[data.apiAttrInfo.requestMethod],
    methodType: data.apiAttrInfo.requestMethod.toString(),
    httpHeader: data.protocol,
    headers: formatHeaders(data.requestParams.headerParams),
    requestType: data.apiAttrInfo.contentType.toString(),
    params: formatBody(data),
    auth: { status: '0' },
    apiRequestParamJsonType: '0',
    advancedSetting: { requestRedirect: 1, checkSSL: 0, sendEoToken: 1, sendNocacheToken: 0 },
    env: {
      paramList: (opts.env.parameters || []).map(val => ({ paramKey: val.name, paramValue: val.value })),
      frontURI: opts.env.hostUri
    },
    beforeInject: data.apiAttrInfo.beforeInject || '',
    afterInject: data.apiAttrInfo.afterInject || '',
    testTime: formatDate(new Date(), 'YYYY-MM-dd HH:mm:ss', locale)
  };
  const rootType = [JsonRootType.Object, JsonRootType.Array].indexOf(data.apiAttrInfo.contentType);
  if (rootType !== -1) {
    result.apiRequestParamJsonType = rootType.toString();
  }
  return result;
};
export const eoFormatResponseData = ({ globals, report, history, id }): TestServerRes => {
  pcConsole.log('eoFormatResponseData', globals, report, history, id);
  let result: TestServerRes;
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

  //Test error
  if (['error'].includes(report.status)) {
    result = {
      status: 'error',
      globals,
      id,
      response: {
        reportList,
        ...report.general
      }
    };
    return result;
  }

  //Test success
  const response: ApiTestResData = {
    statusCode: history.resultInfo.httpCode,
    ...history.general,
    time: history.resultInfo.testDeny,
    responseLength: history.resultInfo.responseLength,
    responseType: history.resultInfo.responseType,
    body: history.resultInfo.body,
    contentType: history.resultInfo.contentType,
    reportList,
    headers: (history.resultInfo.headers || []).map(val => ({ name: val.key, value: val.value })),
    blobFileName: report.blobFileName,
    request: {
      uri: history.requestInfo.URL,
      headers: history.requestInfo.headers,
      body: history.requestInfo.params,
      contentType: ['formData', 'raw', 'json', 'xml', 'binary'][history.requestInfo.requestType] || 'raw'
    }
  };

  result = {
    status: 'finish',
    id,
    globals,
    response
  };
  return result;
};
export const DEFAULT_UNIT_TEST_RESULT: ApiTestResData = {
  redirectTimes: 0,
  downloadSize: 0,
  downloadRate: '0',
  time: '0',
  statusCode: 0,
  timingSummary: [],
  headers: [],
  responseLength: 0,
  responseType: 'text',
  contentType: 'text/html',
  body: $localize`The test service connection failed, please submit an Issue to contact the community`,
  reportList: [],
  request: {
    uri: 'http:///',
    headers: [{ name: 'Content-Type', value: 'application/json' }],
    body: '{}',
    contentType: 'raw'
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
