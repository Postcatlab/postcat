import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
const appVersion = require('../../../package.json').version;

export class EoUpdater {
  constructor() {
    this.watchLog();
    // autoUpdater.setFeedURL({
    //   provider: 'generic',
    //   url: 'https://packages.eoapi.io',
    // });
    // 是否自动更新
    // autoUpdater.autoDownload = window.eo.getModuleSettings('common.app.autoUpdate') !== false;
    if (appVersion.includes('beta')) autoUpdater.channel = 'beta';
    console.log('appVersion', appVersion, autoUpdater.channel);
  }
  check() {
    autoUpdater.checkForUpdatesAndNotify();
  }
  private watchLog() {
    //autoUpdater log
    autoUpdater.logger = log;
    autoUpdater.logger['transports'].file.level = 'info';
  }
}
