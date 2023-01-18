import { formatDate } from '@angular/common';
import {
  ApiBodyType,
  ApiParamsType,
  JsonRootType,
  protocalMap,
  requestMethodMap
} from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import {
  TestServerRes,
  requestDataOpts
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/test-server.model';
import { ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { BodyParam, RestParam } from 'eo/workbench/browser/src/app/shared/services/storage/db/models/apiData';

import { TestLocalNodeData } from './local-node/api-server-data.model';
const PROTOCOL = ['http', 'https'];
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
      response
    });
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
