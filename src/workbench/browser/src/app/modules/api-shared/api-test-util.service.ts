import { Injectable } from '@angular/core';
import { transferUrlAndQuery } from 'eo/workbench/browser/src/app/utils/api';
import { whatType } from 'eo/workbench/browser/src/app/utils/index.utils';
import omitDeep from 'omit-deep-lodash';

import { ApiTestData, ContentType } from '../../pages/workspace/project/api/http/test/api-test.model';
import { ApiData, ApiTestHistory } from '../../shared/services/storage/index.model';
import { table2json, text2table, json2xml } from '../../utils/data-transfer/data-transfer.utils';
import { eoDeepCopy } from '../../utils/index.utils';
import { filterTableData } from '../../utils/tree/tree.utils';
import { ApiBodyType } from './api.model';

@Injectable()
export class ApiTestUtilService {
  constructor() {}
  getHTTPStatus(statusCode) {
    const HTTP_CODE_STATUS = [
      {
        status: 'info',
        cap: 199,
        class: 'code_blue',
        fontClass: 'cb'
      },
      {
        status: 'success',
        cap: 299,
        class: 'code_green',
        fontClass: 'cg'
      },
      {
        status: 'redirect',
        cap: 399,
        class: 'code_yellow',
        fontClass: 'cy'
      },
      {
        status: 'clientError',
        cap: 499,
        class: 'code_red',
        fontClass: 'cr'
      },
      {
        status: 'serverError',
        cap: 599,
        class: 'code_red',
        fontClass: 'cr'
      }
    ];
    return HTTP_CODE_STATUS.find(val => statusCode <= val.cap);
  }
  getTestDataFromHistory(inData: ApiTestHistory) {
    //handle query and url
    const tmpResult = transferUrlAndQuery(inData.request.uri, [], {
      base: 'url',
      replaceType: 'merge'
    });
    const result = {
      testData: {
        uuid: inData.apiDataID,
        restParams: [],
        uri: tmpResult.url,
        queryParams: tmpResult.query,
        requestBody: [ApiBodyType.Raw, ApiBodyType.Binary].includes(inData.request.requestBodyType as ApiBodyType)
          ? inData.request.requestBody
          : inData.request?.requestBody?.map(val => (val.required = true)),
        requestHeaders: inData.response?.headers,
        ...inData.request
      },
      response: eoDeepCopy(inData)
    };
    (result.testData.requestHeaders || []).map(val => (val.required = true));
    return result;
  }
  /**
   * Handle api data for judge page has edit
   * Unlike the saved data, the api data being edited is not as strict
   *
   * @param formData
   * @returns apiData
   */
  formatEditingApiData(formData): ApiTestData {
    const result = eoDeepCopy(formData) as ApiTestData;
    ['requestBody', 'queryParams', 'restParams', 'requestHeaders'].forEach(tableName => {
      if (whatType(result[tableName]) !== 'array') {
        return;
      }
      result[tableName] = filterTableData(result[tableName], {
        filterFn: val => val.name || val.value
      });
    });
    return result;
  }

  /**
   * Transfer Test requstBody[type==='raw'] to API edit table data
   */
  private text2EditBody(keyName, text: string = '') {
    const result = {};
    const bodyInfo = text2table(text);
    if (bodyInfo.textType !== 'raw') {
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
  formatSavingApiData(inData): ApiData {
    // console.log('formatSavingApiData', eoDeepCopy(inData));
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

  getTestDataFromApi(inData): ApiTestData {
    inData ||= {};
    const editToTestParams = arr => {
      arr = arr || [];
      arr.forEach(val => {
        val.value = val.example;
        delete val.example;
      });
    };
    ['queryParams', 'restParams', 'requestHeaders'].forEach(keyName => {
      editToTestParams(inData?.[keyName]);
    });
    //handle query and url
    const tmpResult = transferUrlAndQuery(inData.uri, inData.queryParams, {
      base: 'url',
      replaceType: 'merge'
    });
    inData.uri = tmpResult.url;
    inData.queryParams = tmpResult.query;
    //parse body
    switch (inData.requestBodyType) {
      case ApiBodyType.JSON: {
        inData.requestBody = JSON.stringify(
          table2json(inData.requestBody, {
            rootType: inData.requestBodyJsonType
          })
        );
        break;
      }
      case ApiBodyType.XML: {
        inData.requestBody = json2xml(
          table2json(inData.requestBody, {
            rootType: inData.requestBodyJsonType
          })
        );
        break;
      }
      case ApiBodyType['Form-data']: {
        inData.requestBody.forEach(val => {
          val.value = val.example;
          val.type = val.type === 'file' ? 'file' : 'string';
          delete val.example;
        });
        break;
      }
      case ApiBodyType.Binary: {
        inData.requestBody = '';
        break;
      }
    }
    if (['json', 'xml'].includes(inData.requestBodyType)) {
      //Add/Replace Content-type
      const contentType: ContentType = inData.requestBodyType === 'xml' ? 'application/xml' : 'application/json';
      inData.requestHeaders = this.addOrReplaceContentType(contentType, inData.requestHeaders);
      //Xml、Json change content-type to raw in test page
      inData.requestBodyType = 'raw';
    }
    return inData;
  }
  getContentType(headers) {
    const existHeader = headers.find(val => val.name.toLowerCase() === 'content-type');
    if (!existHeader) {
      return;
    }
    return existHeader.value;
  }
  /**
   * @param type content-type be added/replaced
   * @param headers
   */
  addOrReplaceContentType(contentType: ContentType, headers: any[] = []) {
    const result = headers;
    const existHeader = headers.find(val => val.name.toLowerCase() === 'content-type');
    if (existHeader) {
      existHeader.value = contentType;
      return result;
    }
    headers.unshift({
      required: true,
      name: 'content-type',
      value: contentType
      // editable:false
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
      delete item.value;
      result.push(item);
    });
    return result;
  }
}
