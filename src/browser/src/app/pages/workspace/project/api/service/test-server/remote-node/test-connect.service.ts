import { Injectable } from '@angular/core';
import { DEFAULT_UNIT_TEST_RESULT } from 'pc/browser/src/app/pages/workspace/project/api/constants/api.model';
import { APP_CONFIG } from 'pc/browser/src/environments/environment';

import { TestServerService } from '../test-server.service';

@Injectable()
export class TestServerRemoteService extends TestServerService {
  receiveMessage: (message) => void;
  xhrByTabID = {};
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
        this.xhrByTabID[message.id]?.abort();
      }
    }
    if (message.action !== 'ajax') {
      return;
    }
  }
  ajax(message) {
    const xhr = new XMLHttpRequest();
    const url = `${window.location.protocol}//${window.location.hostname}:${APP_CONFIG.NODE_SERVER_PORT || window.location.port}/api/unit`;
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = e => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.status);
        switch (xhr.status) {
          case 200: {
            this.receiveMessage(this.formatResponseData(JSON.parse(xhr.responseText).data));
            break;
          }
          case 413: {
            const resInfo = {
              id: message.id,
              ...DEFAULT_UNIT_TEST_RESULT
            };
            resInfo.response.body = $localize`The test service connection failed, Request Body Too Large`;
            this.receiveMessage(resInfo);
          }
          default: {
            this.receiveMessage({ id: message.id, ...DEFAULT_UNIT_TEST_RESULT });
            break;
          }
        }
      }
    };
    xhr.send(JSON.stringify(message));
    return xhr;
  }
  close() {}
}
