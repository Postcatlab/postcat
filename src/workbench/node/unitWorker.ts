import * as child_process from 'child_process';
import { BrowserView, ipcMain } from 'electron';

class UnitWorker {
  instance: child_process.ChildProcess;
  view: BrowserView;
  constructor(view: BrowserView) {
    this.view = view;
  }
  start(message: any) {
    this.instance = child_process.fork(`${__dirname}/request/main.js`);
    this.watch();
    this.instance.send(message);
  }
  finish(message: any) {
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

export const UnitWorkerModule = {
  works: {},
  setup(eo: any) {
    ipcMain.removeAllListeners('unitTest');
    ipcMain.on('unitTest', function (event, message) {
      const id = message.id;
      switch (message.action) {
        case 'ajax': {
          UnitWorkerModule.works[id] = new UnitWorker(eo.view);
          UnitWorkerModule.works[id].start(message);
          break;
        }
        case 'abort': {
          UnitWorkerModule.works[id].kill();
          break;
        }
      }
    });
  }
};
