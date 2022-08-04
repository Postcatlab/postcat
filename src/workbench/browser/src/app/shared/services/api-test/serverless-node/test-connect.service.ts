import { Injectable, Inject, LOCALE_ID } from '@angular/core';

import { requestDataOpts, TestServer } from '../test-server.model';
import { DEFAULT_UNIT_TEST_RESULT, eoFormatRequestData, eoFormatResponseData } from '../api-test.utils';
@Injectable()
/**
 * Vercel serverless api
 */
export class TestServerServerlessService implements TestServer {
  receiveMessage: (message) => void;
  xhrByTabID = {};
  constructor(@Inject(LOCALE_ID) private locale: string) {}
  init(receiveMessage: (message) => void) {
    this.receiveMessage = receiveMessage;
  }
  send(module, message) {
    switch (message.action) {
      case 'ajax': {
        this.xhrByTabID[message.id] = this.ajax(message);
        break;
      }
      default: {
        this.xhrByTabID[message.id].abort();
      }
    }
    if (message.action !== 'ajax') {return;}
  }
  ajax(message) {
    const xhr = new XMLHttpRequest();
    const url = '/api/unit';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          this.receiveMessage(this.formatResponseData(JSON.parse(xhr.responseText).data));
        } else {
          this.receiveMessage(Object.assign({id:message.id},DEFAULT_UNIT_TEST_RESULT));
        }
      }
    };
    xhr.send(JSON.stringify(message));
    return xhr;
  }
  close() {}
  /**
   * Format UI Request Data To Server Request Data
   *
   * @param input
   */
  formatRequestData(data, opts: requestDataOpts) {
    return eoFormatRequestData(data, opts, this.locale);
  }
  /**
   * Format TestResult to TestData
   *
   * @param report test result after test finish
   * @param history storage test history
   */
  formatResponseData(data) {
    return eoFormatResponseData(data);
  }
}
