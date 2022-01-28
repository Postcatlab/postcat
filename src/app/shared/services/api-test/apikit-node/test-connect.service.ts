import { Injectable, Inject, LOCALE_ID } from '@angular/core';

import { ApiBodyType } from '../../api-data/api-data.model';
import { TestLocalNodeData } from '../local-node/api-server-data.model';

import { formatDate } from '@angular/common';
import { listToTreeHasLevel } from '../../../../utils/tree';
import { TestServer } from '../test-server.model';
import { ApiTestHistoryFrame } from '../../api-test-history/api-test-history.model';
@Injectable()
export class TestServerAPIKitService implements TestServer {
  socket: WebSocket;
  METHOD = ['POST', 'GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
  PROTOCOL = ['http', 'https'];
  REQUEST_BODY_TYPE = ['formData', 'raw', 'json', 'xml', 'binary'];
  constructor(@Inject(LOCALE_ID) private locale: string) {}
  init(receiveMessage: (message) => void) {
    this.socket = new WebSocket('ws://dev.test.eolinker.com:1204/nodeWebsocketServer/unit');
    this.socket.onopen = () => {
      this.socket.send(
        '{"status":"init","lang":"cn","globals":{},"spaceKey":"eolinker","projectHashKey":"ccsIhPl17503a6b2326f09fbc4e3a7c03874c7333002038","module":0,"apiID":"5622482","markFrontUrl":"apiManagementPro","from":"default"}	'
      );
    };
    this.socket.onmessage = (inputEvt) => {
      receiveMessage(this.formatResponseData(JSON.parse(inputEvt.data)));
    };
  }
  send(action, message) {
    this.socket.send(
      JSON.stringify({
        status: message.action,
        ...message.data,
      })
    );
  }
  /**
   * Format UI Request Data To Server Request Data
   *
   * @param input
   */
  formatRequestData(data, opts = { env: {} }) {
    const formatUri = (uri, rest) => {
      let result = uri;
      const restByName = rest.reduce((acc, val) => {
        if (!val.required || !val.name) {
          return acc;
        }
        return { ...acc, [val.name]: val.value };
      }, {});
      const restIndex = [];
      const aRest = [];
      //get rest param name index, only match {name}
      for (let i = 0; i < result.length - 1; i++) {
        switch (result[i]) {
          case '{': {
            if (i >= result.length - 3) {
              break;
            }
            if (aRest.length) {
              aRest.pop();
              break;
            }
            aRest.push(i + 1);
            break;
          }
          case '}': {
            if (aRest.length) {
              restIndex.push([aRest[0], i]);
              aRest.pop();
            }
            break;
          }
        }
      }
      restIndex.forEach((val) => {
        const restName = result.slice(val[0], val[1]);
        result = result.substring(0, val[0] - 1) + restByName[restName] + result.substring(val[1] + 1);
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
        case ApiBodyType.Raw: // case ApiBodyType.Binary:
        {
          result = inData.requestBody;
          break;
        }
      }
      return result;
    };
    const formatEnv = (env) => {
      let result = {
        paramList: (env.parameters||[]).map((val) => ({ paramKey: val.name, paramValue: val.value })),
        frontURI: env.hostUri,
      };
      return result;
    };
    const result: TestLocalNodeData = {
      URL: formatUri(data.uri, data.restParams),
      method: data.method,
      methodType: this.METHOD.indexOf(data.method).toString(),
      httpHeader: this.PROTOCOL.indexOf(data.protocol),
      headers: formatList(data.requestHeaders),
      requestType: this.REQUEST_BODY_TYPE.indexOf(data.requestBodyType).toString(),
      apiRequestParamJsonType: ['object', 'array'].indexOf(data.requestBodyJsonType).toString(),
      params: formatBody(data),
      auth: { status: '0' },
      advancedSetting: { requestRedirect: 1, checkSSL: 0, sendEoToken: 1, sendNocacheToken: 0 },
      env: formatEnv(opts.env),
      testTime: formatDate(new Date(), 'YYYY-MM-dd HH:mm:ss', this.locale),
    };
    return result;
  }
  /**
   * Format TestResult to TestData
   * @param  {object} report test result after test finish
   * @param  {object} history storage test history
   */
  formatResponseData({ report, history }) {
    ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
      history[keyName] = JSON.parse(history[keyName]);
    });
    let { httpCode, ...historyRes } = history.resultInfo;
    historyRes = {
      statusCode: httpCode,
      ...historyRes,
      body: historyRes.body || '',
      headers: historyRes.headers.map((val) => ({ name: val.key, value: val.value })),
    };
    let result: { report: any; history: ApiTestHistoryFrame } = {
      report: {
        general: report.general,
        request: {
          requestHeaders: report.request.headers.map((val) => ({ name: val.key, value: val.value })),
          requestBodyType: this.REQUEST_BODY_TYPE[report.request.requestType],
          requestBody: report.request.body,
        },
        reportList: report.reportList,
        response: historyRes,
      },
      history: {
        general: history.general,
        request: {
          uri: history.requestInfo.URL,
          method: history.requestInfo.method,
          protocol: this.PROTOCOL[history.requestInfo.apiProtocol],
          requestHeaders: history.requestInfo.headers,
          requestBodyJsonType: 'object',
          requestBodyType: this.REQUEST_BODY_TYPE[history.requestInfo.requestType],
          requestBody: history.requestInfo.params,
        },
        response: historyRes,
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
  }
  close() {
    if (!this.socket) return;
    this.socket.close();
  }
}
