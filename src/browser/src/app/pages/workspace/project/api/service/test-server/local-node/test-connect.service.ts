import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { toJS } from 'mobx';

import { ElectronService } from '../../../../../../../core/services';
import { ApiTestUtilService } from '../../api-test-util.service';
import { TestServerService } from '../test-server.service';
@Injectable()
export class TestServerLocalNodeService extends TestServerService {
  constructor(private electron: ElectronService, @Inject(LOCALE_ID) public locale: string, public apiTestUtil: ApiTestUtilService) {
    super(locale, apiTestUtil);
  }
  init(receiveMessage: (message) => void) {
    this.electron.ipcRenderer.on('unitTest', (event, args) => {
      // console.log('[localNode]receiveMessage', args);
      receiveMessage(this.formatResponseData(args));
    });
  }
  send(module, message) {
    console.log('[localNode]send message', message);
    this.electron.ipcRenderer.send(module, toJS(message));
  }
  close() {
    this.electron.ipcRenderer.removeAllListeners('unitTest');
  }
}
