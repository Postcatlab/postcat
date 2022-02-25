import { listToTreeHasLevel } from '../../../utils/tree/tree.utils';
import { formatDate } from '@angular/common';
import { TestLocalNodeData } from './local-node/api-server-data.model';
import { ApiBodyType, ApiTestResGeneral, ApiTestHistoryResponse } from 'eoapi-core';
const METHOD = ['POST', 'GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'],
  PROTOCOL = ['http', 'https'],
  REQUEST_BODY_TYPE = ['formData', 'raw', 'json', 'xml', 'binary'];

export const eoFormatRequestData = (data, opts = { env: {} }, locale) => {
  const formatUri = (uri, rest) => {
    let result = uri;
    const restByName = rest.reduce((acc, val) => {
      if (!val.required || !val.name) {
        return acc;
      }
      return { ...acc, [val.name]: val.value };
    }, {});
    Object.keys(restByName).forEach((restName) => {
      result = result.replace(new RegExp(`{${restName}}`, 'g'), restByName[restName]);
    });
    return result;
  };
  const formatList = (inArr) => {
    const result = [];
    inArr.forEach((val) => {
      if (!val.name) {
        return;
      }
      result.push({
        checkbox: val.required,
        headerName: val.name,
        headerValue: val.value,
      });
    });
    return result;
  };
  const formatBody = (inData) => {
    let result;
    switch (inData.requestBodyType) {
      case ApiBodyType['Form-data']:
      case ApiBodyType.JSON:
      case ApiBodyType.XML: {
        result = [];
        const typeMUI = {
          string: '0',
          file: '1',
          boolean: '8',
          array: '12',
          object: '13',
          number: '14',
          null: '15',
        };
        inData.requestBody.forEach((val) => {
          if (!val.name) {
            return;
          }
          result.push({
            checkbox: val.required,
            listDepth: val.listDepth || 0,
            paramKey: val.name,
            paramType: typeMUI[val.type],
            paramInfo: val.value,
          });
        });
        result = listToTreeHasLevel(result, {
          childKey: 'childList',
        });
        break;
      }
      case ApiBodyType.Raw: {
        // case ApiBodyType.Binary:
        result = inData.requestBody;
        break;
      }
    }
    return result;
  };
  const formatEnv = (env) => {
    let result = {
      paramList: (env.parameters || []).map((val) => ({ paramKey: val.name, paramValue: val.value })),
      frontURI: env.hostUri,
    };
    return result;
  };
  const result: TestLocalNodeData = {
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
    env: formatEnv(opts.env),
    testTime: formatDate(new Date(), 'YYYY-MM-dd HH:mm:ss', locale),
  };
  return result;
};
export const eoFormatResponseData = ({ report, history, id }) => {
  let { httpCode, ...response } = history.resultInfo;
  response = {
    statusCode: httpCode,
    ...response,
    body: response.body || '',
    headers: response.headers.map((val) => ({ name: val.key, value: val.value })),
  };
  let result: {
    report: any;
    general: ApiTestResGeneral;
    response: ApiTestHistoryResponse;
    history: any;
    id: number;
  } = {
    id: id,
    general: report.general,
    response: response,
    report: {
      request: {
        requestHeaders: report.request.headers.map((val) => ({ name: val.key, value: val.value })),
        requestBodyType: REQUEST_BODY_TYPE[report.request.requestType],
        requestBody: report.request.body,
      },
    },
    history: {
      request: {
        uri: history.requestInfo.URL,
        method: history.requestInfo.method,
        protocol: PROTOCOL[history.requestInfo.apiProtocol],
        requestHeaders: history.requestInfo.headers,
        requestBodyJsonType: 'object',
        requestBodyType: REQUEST_BODY_TYPE[history.requestInfo.requestType],
        requestBody: history.requestInfo.params,
      },
    },
  };
  if (result.report.request.requestBodyType === 'formData') {
    result.report.request.requestBody = [];
    for (var keyName in report.request.body) {
      result.report.request.requestBody.push({
        name: keyName,
        value: report.request.body[keyName],
      });
    }
  }
  if (result.history.request.requestBodyType === 'formData') {
    result.history.request.requestBody = result.history.request.requestBody.map((val) => ({
      name: val.key,
      type: 'string',
      value: val.value,
    }));
  }
  return result;
};
