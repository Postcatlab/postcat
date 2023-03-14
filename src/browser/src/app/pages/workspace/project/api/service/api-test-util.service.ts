import { Injectable } from '@angular/core';
import { ApiBodyType, ApiParamsType, JsonRootType, Protocol } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { syncUrlAndQuery } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';

import { ApiData } from '../../../../../services/storage/db/models';
import { BodyParam, HeaderParam, RestParam } from '../../../../../services/storage/db/models/apiData';
import { table2json, text2table, json2xml } from '../../../../../shared/utils/data-transfer/data-transfer.utils';
import { eoDeepCopy, JSONParse } from '../../../../../shared/utils/index.utils';
import { ApiEditUtilService } from '../http/edit/api-edit-util.service';
import { ContentType } from '../http/test/api-test.model';
import { ApiTestResData } from './test-server/test-server.model';

@Injectable()
export class ApiTestUtilService {
  globalStorageKey = 'EO_TEST_VAR_GLOBALS';
  constructor(private apiEditUtil: ApiEditUtilService) {}
  getHTTPStatus(statusCode) {
    const HTTP_CODE_STATUS = [
      {
        status: 'info',
        cap: 199,
        class: 'test-default'
      },
      {
        status: 'success',
        cap: 299,
        class: 'test-success'
      },
      {
        status: 'redirect',
        cap: 399,
        class: 'test-warning'
      },
      {
        status: 'clientError',
        cap: 499,
        class: 'test-error'
      },
      {
        status: 'serverError',
        cap: 599,
        class: 'test-error'
      }
    ];
    return HTTP_CODE_STATUS.find(val => statusCode <= val.cap);
  }
  /**
   * Handle api data for judge page has edit
   * Unlike the saved data, the api data being edited is not as strict
   *
   * @param formData
   * @returns apiData
   */
  formatEditingApiData(formData): ApiData {
    return this.apiEditUtil.parseApiUI2Storage(formData, (val: BodyParam) => val?.name || val.paramAttr?.example);
  }

  /**
   * Transfer test/history data to  api ui data
   * Test Page: Save as API
   *
   * @param inData.history
   * @param inData.testData - test request info
   * @returns
   */
  formatUIApiDataToStorage(inData: { request: Partial<ApiData>; response: ApiTestResData }): ApiData {
    inData = eoDeepCopy(inData);
    // pcConsole.log('formatUIApiDataToStorage', inData);
    const result = {
      ...inData.request,
      protocol: Protocol.HTTP,
      responseList: [
        {
          isDefault: 1,
          contentType: ApiBodyType.Raw,
          responseParams: {
            headerParams: this.filterCommonHeader(inData.response?.headers).map(val => ({
              name: val.name,
              isRequired: 1,
              paramAttr: {
                example: JSON.stringify(val.value)
              }
            })),
            bodyParams: []
          }
        }
      ]
    };
    delete result.apiUuid;

    //Transfer Raw request info
    if (result.apiAttrInfo.contentType === ApiBodyType.Raw) {
      const rawData = result.requestParams.bodyParams[0].binaryRawData;
      const tableData = text2table(rawData);
      if (tableData.contentType === ApiBodyType.Raw) {
        result.requestParams.bodyParams = [
          {
            binaryRawData: rawData
          }
        ];
      } else {
        result.requestParams.bodyParams = tableData.data;
      }
      result.apiAttrInfo.contentType = tableData.contentType;
    }

    //Transfer Raw response info
    if (inData?.response?.responseType === 'text') {
      const tableData = text2table(inData.response.body);
      result.responseList[0].contentType = tableData.contentType;
      if (tableData.contentType === ApiBodyType.Raw) {
        result.responseList[0].responseParams.bodyParams = [
          {
            binaryRawData: tableData.data
          }
        ];
      } else {
        result.responseList[0].responseParams.bodyParams = tableData.data;
      }
    }
    // pcConsole.log('formatUIApiDataToStorage', result);
    return result as ApiData;
  }
  /**
   * Handle Test url,such as replace rest
   *
   * @param uri
   * @param rest
   * @returns
   */
  formatUri = (uri, rest: RestParam[] = []) => {
    if (!Array.isArray(rest)) {
      return uri;
    }
    let result = uri;
    const restByName = rest.reduce((acc, val) => {
      if (!(val.isRequired && val.name)) {
        return acc;
      }
      return { ...acc, [val.name]: val['paramAttr.example'] || '' };
    }, {});
    Object.keys(restByName).forEach(restName => {
      try {
        const pattStr = `{${restName}}`;
        result = result.replace(new RegExp(pattStr, 'g'), restByName[restName] || pattStr);
      } catch (e) {}
    });
    return result;
  };
  getGlobals = (): object => {
    let result = null;
    const global = localStorage.getItem(this.globalStorageKey);
    result = JSONParse(global);
    return result || {};
  };
  setGlobals = globals => {
    if (!globals) {
      return;
    }
    localStorage.setItem(this.globalStorageKey, JSON.stringify(globals));
  };
  getTestDataFromApi(inData: Partial<ApiData>): Partial<ApiData> {
    const result = this.apiEditUtil.formatStorageApiDataToUI(inData);

    //handle query and url
    const tmpResult = syncUrlAndQuery(result.uri, result.requestParams.queryParams, {
      method: 'replace',
      //* Query Priority is higher than url
      nowOperate: 'query'
    });
    result.uri = tmpResult.url;
    result.requestParams.queryParams = tmpResult.query;

    //parse body
    const requestBodyType = result.apiAttrInfo.contentType;
    let binaryRawData = '';
    switch (requestBodyType) {
      case ApiBodyType.JSONArray:
      case ApiBodyType.JSON: {
        binaryRawData = JSON.stringify(
          table2json(result.requestParams.bodyParams, {
            rootType: requestBodyType === ApiBodyType.JSON ? JsonRootType.Object : JsonRootType.Array
          })
        );
        break;
      }
      case ApiBodyType.XML: {
        binaryRawData = json2xml(table2json(result.requestParams.bodyParams));
        break;
      }
      case ApiBodyType['FormData']: {
        result.requestParams.bodyParams.forEach(val => {
          val.dataType = val.dataType === ApiParamsType.file ? ApiParamsType.file : ApiParamsType.string;
        });
        break;
      }
      case ApiBodyType.Raw: {
        binaryRawData = result.requestParams.bodyParams?.[0]?.binaryRawData;
        break;
      }
      case ApiBodyType.Binary: {
        binaryRawData = '';
        break;
      }
    }
    if (requestBodyType !== ApiBodyType.FormData) {
      result.requestParams.bodyParams = [
        {
          binaryRawData: binaryRawData
        }
      ];
    }
    //Reset content-type
    if ([ApiBodyType.JSON, ApiBodyType.JSONArray, ApiBodyType.XML].includes(requestBodyType)) {
      //Add/Replace Content-type
      const contentType: ContentType = requestBodyType === ApiBodyType.XML ? 'application/xml' : 'application/json';
      result.requestParams.headerParams = this.addOrReplaceContentType(contentType, result.requestParams.headerParams);
      //Xml、Json change content-type to raw in test page
      result.apiAttrInfo.contentType = ApiBodyType.Raw;
    }

    return result;
  }
  getContentType(headers = []) {
    const existHeader = headers.find(val => val.name.toLowerCase() === 'content-type');
    if (!existHeader) {
      return;
    }
    return existHeader.paramAttr?.example;
  }
  /**
   * @param type content-type be added/replaced
   * @param headers
   */
  addOrReplaceContentType(contentType: ContentType, headers: HeaderParam[] | any = []) {
    const existHeader = headers.find(val => val.name.toLowerCase() === 'content-type');
    if (existHeader) {
      existHeader['paramAttr.example'] = contentType;
      return headers;
    }
    const result = [
      {
        isRequired: 1,
        name: 'content-type',
        'paramAttr.example': contentType
      },
      ...headers
    ];
    return result;
  }
  private filterCommonHeader(headers = []) {
    const commonHeader = [
      'content-type',
      'accept',
      'age',
      'via',
      'accept-ranges',
      'nginx-hit',
      'content-length',
      'accept-encoding',
      'accept-language',
      'connection',
      'host',
      'date',
      'referrer-policy',
      'connection',
      'location',
      'range',
      'transfer-encoding',
      'content-security-policy',
      'strict-transport-security',
      'server',
      'if-match',
      'if-none-match',
      'user-agent',
      'vary',
      'referrer-policy'
    ];
    const result = headers.filter(val => !commonHeader.includes(val.name));
    return result;
  }
}
