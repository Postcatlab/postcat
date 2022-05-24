import { Environment, ApiTestHistoryFrame } from 'eo/platform/browser/IndexedDB';
export interface TestServer {
  init: (receiveMessage: (message: any) => void) => void;
  send: (action: string, message: any) => void;
  formatRequestData: (apiData, opts: { env: Environment }) => any;
  formatResponseData: (res) => { report: any; history: ApiTestHistoryFrame };
  close: () => void;
}
