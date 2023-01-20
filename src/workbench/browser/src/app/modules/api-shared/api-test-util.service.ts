import { Injectable } from '@angular/core';
import { ApiBodyType, ApiParamsType, JsonRootType, Protocol } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';

import { ApiEditUtilService } from '../../pages/workspace/project/api/http/edit/api-edit-util.service';
import { ContentType } from '../../pages/workspace/project/api/http/test/api-test.model';
import { ApiTestResData } from '../../pages/workspace/project/api/service/api-test/test-server.model';
import { ApiData } from '../../shared/services/storage/db/models';
import { BodyParam, HeaderParam } from '../../shared/services/storage/db/models/apiData';
import { table2json, text2table, json2xml } from '../../utils/data-transfer/data-transfer.utils';
import { eoDeepCopy } from '../../utils/index.utils';

@Injectable()
export class ApiTestUtilService {
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
  // getTestDataFromHistory(inData: ApiTestHistory) {
  //   //handle query and url
  //   // const tmpResult = transferUrlAndQuery(inData.request.uri, [], {
  //   //   base: 'url',
  //   //   replaceType: 'merge'
  //   // });
  //   // const result = {
  //   //   testData: {
  //   //     uuid: inData.apiUuid,
  //   //     restParams: [],
  //   //     uri: tmpResult.url,
  //   //     queryParams: tmpResult.query,
  //   //     requestBody: [ApiBodyType.Raw, ApiBodyType.Binary].includes(inData.request.apiAttrInfo.requestBodyType as unknown as ApiBodyType)
  //   //       ? inData.request.requestBody
  //   //       : inData.request?.requestBody?.map(val => (val.required = true)),
  //   //     requestHeaders: inData.response?.headers,
  //   //     ...inData.request
  //   //   },
  //   //   response: eoDeepCopy(inData)
  //   // };
  //   // (result.testData.requestHeaders || []).map(val => (val.required = true));
  //   return inData;
  // }
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
    pcConsole.log('formatUIApiDataToStorage', inData);
    const result = {
      ...inData.request,
      protocol: Protocol.HTTP,
      responseList: [
        {
          isDefault: 1,
          contentType: ApiBodyType.Raw,
          responseParams: {
            headerParams: [],
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
      result.responseList[0].responseParams.bodyParams = tableData.data;
    }
    console.log(result);
    return result as ApiData;
  }

  getTestDataFromApi(inData: Partial<ApiData>): Partial<ApiData> {
    const result = this.apiEditUtil.formatStorageApiDataToUI(inData);

    //handle query and url
    const tmpResult = transferUrlAndQuery(result.uri, result.requestParams.queryParams, {
      base: 'url',
      replaceType: 'merge'
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
    const result = headers;
    const existHeader = headers.find(val => val.name.toLowerCase() === 'content-type');
    if (existHeader) {
      existHeader.paramAttr.example = contentType;
      return result;
    }
    headers.unshift({
      isRequired: 1,
      name: 'content-type',
      'paramAttr.example': contentType
    });
    return result;
  }
  private filterCommonHeader(headers = []) {
    const commonHeader = [
      'content-type',
      'accept',
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
