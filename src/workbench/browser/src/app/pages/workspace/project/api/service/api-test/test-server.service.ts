import { Injectable } from '@angular/core';
import {
  TestServerRes,
  requestDataOpts,
  TestServer
} from 'eo/workbench/browser/src/app/pages/workspace/project/api/service/api-test/test-server.model';
@Injectable()
export class TestServerService implements TestServer {
  init: (receiveMessage: (message: any) => void) => void;
  send: (action: string, message: any) => void;
  formatRequestData: (apiData, opts: requestDataOpts) => any;
  formatResponseData: (res) => TestServerRes;
  close: () => void;
}
