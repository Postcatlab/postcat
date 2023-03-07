// import { dialog } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { COMMON_APP_CONFIG } from '../../environment';

const appVersion = require('../../../package.json').version;

export class EoUpdater {
  constructor() {
    this.watchLog();
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: COMMON_APP_CONFIG.BASE_DOWNLOAD_URL
    });
    // 是否自动更新
    // autoUpdater.autoDownload = window.pc.getExtensionSettings('common.app.autoUpdate') !== false;
    if (appVersion.includes('beta')) autoUpdater.channel = 'beta';
    console.log('appVersion', appVersion, autoUpdater.channel);

    // autoUpdater.on('update-downloaded', info => {
    //   log.info('Update downloaded.');

    //   // The update will automatically be installed the next time the
    //   // app launches. If you want to, you can force the installation
    //   // now:
    //   const dialogOpts = {
    //     type: 'info',
    //     buttons: ['重启', '稍后'],
    //     title: '版本升级',
    //     message: '有新版本可用了',
    //     detail: `新版本 (${info.version}) 已经下载，重启并更新.`
    //   };

    //   dialog.showMessageBox(dialogOpts).then(returnValue => {
    //     if (returnValue.response === 0) autoUpdater.quitAndInstall(false, true);
    //   });
    // });
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
