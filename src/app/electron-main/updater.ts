import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

const appVersion = require('../../../package.json').version;

export class EoUpdater {
  constructor() {
    this.watchLog();
    // autoUpdater.setFeedURL({
    //   provider: 'generic',
    //   url: 'https://packages.postcat.com',
    // });
    // 是否自动更新
    // autoUpdater.autoDownload = window.pc.getExtensionSettings('common.app.autoUpdate') !== false;
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
