import { Injectable, Inject, LOCALE_ID } from '@angular/core';

import { TestServer } from '../test-server.model';
import { eoFormatRequestData, eoFormatResponseData } from '../api-test.utils';
@Injectable()
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
    if (message.action !== 'ajax') return;
  }
  ajax(message) {
    const xhr = new XMLHttpRequest();
    const url = '/api/unit';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        this.receiveMessage(this.formatResponseData(JSON.parse(xhr.responseText).data));
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
  formatRequestData(data, opts = { env: {} }) {
    return eoFormatRequestData(data, opts, this.locale);
  }
  /**
   * Format TestResult to TestData
   * @param  {object} report test result after test finish
   * @param  {object} history storage test history
   */
  formatResponseData(data) {
    return eoFormatResponseData(data);
  }
}
