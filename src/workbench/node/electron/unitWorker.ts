import { BrowserView } from 'electron';
import _LibsFlowCommon from '../request/unit';
import _LibsCommon from '../request/libs/common';
export class UnitWorker {
  view: BrowserView;
  constructor(view: BrowserView) {
    this.view = view;
  }
  async start(message: any) {
    message.data.env = _LibsCommon.parseEnv(message.data.env);
    await new _LibsFlowCommon.core().main(message.data).then(({ report, history }) => {
      ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
        if (typeof history[keyName] === 'string') history[keyName] = JSON.parse(history[keyName]);
      });
      this.finish({
        id: message.id,
        report: report,
        history: history,
      });
    });
  }
  finish(message: any) {
    this.view.webContents.send('unitTest', message);
  }
}
