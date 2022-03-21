import * as child_process from 'child_process';
import { BrowserView, ipcMain } from 'electron';
export class UnitWorker {
  instance: child_process.ChildProcess;
  view: BrowserView;
  constructor(view) {
    this.view = view;
  }
  start(message) {
    this.instance = child_process.fork(`${__dirname}/request/main.js`);
    this.watch();
    this.instance.send(message);
  }
  finish(message) {
    this.view.webContents.send('unitTest', message);
    this.kill();
  }
  kill() {
    this.instance.kill();
  }
  private watch() {
    this.instance.on('message', (message: any) => {
      switch (message.action) {
        case 'finish': {
          this.finish(message.data);
          break;
        }
      }
    });
  }
}

