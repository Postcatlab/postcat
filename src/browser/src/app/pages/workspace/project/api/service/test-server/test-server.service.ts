import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { ApiBodyType, ApiParamsType, JsonRootType, requestMethodMap } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { ApiTestUtilService } from 'pc/browser/src/app/pages/workspace/project/api/service/api-test-util.service';
import {
  ApiTestResData,
  requestDataOpts,
  TestServer,
  TestServerRes
} from 'pc/browser/src/app/pages/workspace/project/api/service/test-server/test-server.model';
import { ApiData, BodyParam } from 'pc/browser/src/app/services/storage/db/models/apiData';
import { whatType } from 'pc/browser/src/app/shared/utils/index.utils';

import { TestLocalNodeData } from './local-node/api-server-data.model';

@Injectable()
export abstract class TestServerService implements TestServer {
  constructor(@Inject(LOCALE_ID) protected locale: string, protected apiTestUtil: ApiTestUtilService) {}
  abstract init(receiveMessage: (message: any) => void): void;
  abstract send(action: string, message: any): void;
  formatRequestData(data: Partial<ApiData>, opts: requestDataOpts = { env: {}, lang: 'en', globals: {} }) {
    const formatHeaders = inArr => {
      if (!Array.isArray(inArr)) {
        return [];
      }
      return inArr
        .filter(val => val.name && val.isRequired)
        .map((val: BodyParam) => ({
          headerName: val.name,
          headerValue: val['paramAttr.example']
        }));
    };
    const formatBody = (inData: Partial<ApiData>) => {
      switch (inData.apiAttrInfo.contentType) {
        case ApiBodyType.Binary:
        case ApiBodyType.Raw: {
          return inData.requestParams.bodyParams[0].binaryRawData;
        }
        case ApiBodyType['FormData']: {
          return inData.requestParams.bodyParams
            .filter(val => val.name && val.isRequired)
            .map(val => ({
              listDepth: 0,
              paramKey: val.name,
              //@ts-ignore
              files: val.files?.map(file => file.content),
              paramType: val.dataType === ApiParamsType.file ? '1' : '0',
              paramInfo: val.paramAttr?.example || ''
            }));
        }
      }
    };
    const result: TestLocalNodeData = {
      lang: opts.lang,
      globals: opts.globals,
      URL: this.apiTestUtil.formatUri(data.uri, data.requestParams.restParams),
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
      authInfo: data.authInfo || {},
      beforeInject: data.apiAttrInfo.beforeInject || '',
      afterInject: data.apiAttrInfo.afterInject || '',
      testTime: formatDate(new Date(), 'YYYY-MM-dd HH:mm:ss', this.locale)
    };
    const rootType = [JsonRootType.Object, JsonRootType.Array].indexOf(data.apiAttrInfo.contentType);
    if (rootType !== -1) {
      result.apiRequestParamJsonType = rootType.toString();
    }
    pcConsole.log('formatRequestData', result);
    return result;
  }
  formatResponseData({ globals, report, history, id }): TestServerRes {
    // pcConsole.log('eoFormatResponseData', globals, report, history, id);
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
        headers: (report.request.headers || []).map(val => ({ name: val.key, value: val.value })),
        body:
          whatType(history.requestInfo.params) === 'array'
            ? history.requestInfo.params.map(val => ({ ...val, name: val.key }))
            : history.requestInfo.params,
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
  }
  abstract close(): void;
}
