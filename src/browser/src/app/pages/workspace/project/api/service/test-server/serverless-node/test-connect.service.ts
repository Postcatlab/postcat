import { Injectable } from '@angular/core';
import { DEFAULT_UNIT_TEST_RESULT } from 'pc/browser/src/app/pages/workspace/project/api/api.model';
import { JSONParse } from 'pc/browser/src/app/shared/utils/index.utils';

import { TestServerService } from '../test-server.service';
@Injectable()
/**
 * Vercel serverless api
 */
export class TestServerServerlessService extends TestServerService {
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
    const url = '/api/unit';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = e => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          this.receiveMessage(this.formatResponseData(JSONParse(xhr.responseText).data));
        } else {
          this.receiveMessage({ id: message.id, ...DEFAULT_UNIT_TEST_RESULT });
        }
      }
    };
    xhr.send(JSON.stringify(message));
    return xhr;
  }
  close() {}
}
