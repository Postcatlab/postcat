import { Injectable } from '@angular/core';
import { ApiBodyType, ApiParamsType, JsonRootType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import omitDeep from 'omit-deep-lodash';

import { ApiEditUtilService } from '../../pages/workspace/project/api/http/edit/api-edit-util.service';
import { ContentType } from '../../pages/workspace/project/api/http/test/api-test.model';
import { ApiData, ApiTestHistory } from '../../shared/services/storage/db/models';
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
  getTestDataFromHistory(inData: ApiTestHistory) {
    //handle query and url
    // const tmpResult = transferUrlAndQuery(inData.request.uri, [], {
    //   base: 'url',
    //   replaceType: 'merge'
    // });
    // const result = {
    //   testData: {
    //     uuid: inData.apiUuid,
    //     restParams: [],
    //     uri: tmpResult.url,
    //     queryParams: tmpResult.query,
    //     requestBody: [ApiBodyType.Raw, ApiBodyType.Binary].includes(inData.request.apiAttrInfo.requestBodyType as unknown as ApiBodyType)
    //       ? inData.request.requestBody
    //       : inData.request?.requestBody?.map(val => (val.required = true)),
    //     requestHeaders: inData.response?.headers,
    //     ...inData.request
    //   },
    //   response: eoDeepCopy(inData)
    // };
    // (result.testData.requestHeaders || []).map(val => (val.required = true));
    return inData;
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
   * Transfer Test requstBody[type==='raw'] to API edit table data
   */
  private text2EditBody(keyName, text: string = '') {
    const result = {};
    const bodyInfo = text2table(text);
    if (bodyInfo.textType !== ApiBodyType.Raw) {
      result[`${keyName}`] = bodyInfo.data.map(val => omitDeep(val, ['value']));
    } else {
      result[`${keyName}`] = bodyInfo.data;
    }
    result[`${keyName}Type`] = bodyInfo.textType;
    result[`${keyName}JsonType`] = bodyInfo.rootType;
    return result;
  }
  /**
   * Transfer test/history data to  api ui data
   * Test Page: Save as API
   *
   * @param inData.history
   * @param inData.testData - test request info
   * @returns
   */
  formatUIApiDataToStorage(inData): ApiData {
    // console.log('formatUIApiDataToStorage', eoDeepCopy(inData));
    const result = {
      ...inData.testData,
      responseHeaders: this.filterCommonHeader(inData.history.response.headers) || [],
      responseBodyType: 'json',
      responseBodyJsonType: 'object',
      responseBody: []
    };
    delete result.uuid;
    if (result.requestBodyType === ApiBodyType.Raw) {
      Object.assign(result, this.text2EditBody('requestBody', result.requestBody));
    }
    ['requestHeaders', 'requestBody', 'responseHeaders', 'restParams', 'queryParams'].forEach(keyName => {
      if (!result[keyName] || typeof result[keyName] !== 'object') {
        return;
      }
      result[keyName] = this.testTable2body(result[keyName]);
    });
    if (inData.history.response.responseType === 'text') {
      Object.assign(result, this.text2EditBody('responseBody', inData.history.response.body));
    }
    return result;
  }

  getTestDataFromApi(inData: ApiData): ApiData {
    inData = this.apiEditUtil.formatStorageApiDataToUI(inData);
    //handle query and url
    const tmpResult = transferUrlAndQuery(inData.uri, inData.requestParams.queryParams, {
      base: 'url',
      replaceType: 'merge'
    });
    inData.uri = tmpResult.url;
    inData.requestParams.queryParams = tmpResult.query;

    //parse body
    const requestBodyType = inData.apiAttrInfo.contentType;
    let binaryRawData = '';
    switch (requestBodyType) {
      case ApiBodyType.JSONArray:
      case ApiBodyType.JSON: {
        binaryRawData = JSON.stringify(
          table2json(inData.requestParams.bodyParams, {
            rootType: requestBodyType === ApiBodyType.JSON ? JsonRootType.Object : JsonRootType.Array
          })
        );
        break;
      }
      case ApiBodyType.XML: {
        binaryRawData = json2xml(table2json(inData.requestParams.bodyParams));
        break;
      }
      case ApiBodyType['FormData']: {
        inData.requestParams.bodyParams.forEach(val => {
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
      inData.requestParams.bodyParams = [
        {
          binaryRawData: binaryRawData
        }
      ];
    }
    if ([ApiBodyType.JSON, ApiBodyType.JSONArray, ApiBodyType.XML].includes(requestBodyType)) {
      //Add/Replace Content-type
      const contentType: ContentType = requestBodyType === ApiBodyType.XML ? 'application/xml' : 'application/json';
      inData.requestParams.headerParams = this.addOrReplaceContentType(contentType, inData.requestParams.headerParams);
      //Xml、Json change content-type to raw in test page
      inData.apiAttrInfo.contentType = ApiBodyType.Raw;
    }
    return inData;
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
  addOrReplaceContentType(contentType: ContentType, headers: HeaderParam[] = []) {
    const result = headers;
    const existHeader = headers.find(val => val.name.toLowerCase() === 'content-type');
    if (existHeader) {
      existHeader.paramAttr.example = contentType;
      return result;
    }
    headers.unshift({
      isRequired: 1,
      name: 'content-type',
      paramAttr: {
        example: contentType
      }
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
  private testTable2body(arr): ApiData[] {
    const result = [];
    arr.forEach(val => {
      if (!val.name) {
        return;
      }
      const item = { ...val, required: val.hasOwnProperty('required') ? val.required : true, example: val.value };
      result.push(item);
    });
    return result;
  }
}
