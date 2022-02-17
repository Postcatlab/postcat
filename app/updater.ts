import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
export class EoUpdater {
  constructor() {
    this.watchLog();
  }
  check() {
    autoUpdater.checkForUpdatesAndNotify();
  }
  private watchLog() {
    //autoUpdater log
    autoUpdater.logger = log;
    autoUpdater.logger['transports'].file.level = 'debug';
  }
}
