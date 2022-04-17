import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { ElectronService } from '../../../../core/services';
import { TestServer } from '../test-server.model';
import { eoFormatRequestData, eoFormatResponseData } from '../api-test.utils';
@Injectable()
export class TestServerLocalNodeService implements TestServer {
  constructor(private electron: ElectronService, @Inject(LOCALE_ID) private locale: string) {}
  init(receiveMessage: (message) => void) {
    this.electron.ipcRenderer.on('unitTest', (event, args) => {
      receiveMessage(this.formatResponseData(args));
    });
  }
  send(module, message) {
    this.electron.ipcRenderer.send(module, message);
  }
  close() {
    this.electron.ipcRenderer.removeAllListeners('unitTest');
  }
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
