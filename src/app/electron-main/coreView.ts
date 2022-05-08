import { BrowserView, screen, BrowserWindow, session, ipcMain } from 'electron';
import { BrowserViewInstance } from '../../platform/electron-main/browserView/browserView';
import * as path from 'path';
import { subView } from './main';
import { processEnv } from '../../platform/node/constant';
export class CoreViews {
  moduleID: string;
  view: BrowserView;
  constructor(private win: BrowserWindow) {
    this.triggleEvent = this.triggleEvent.bind(this);
  }

  rebuildBounds() {
    if (!this.view) {
      return;
    }
    const _bounds = this.win.getContentBounds();
    _bounds.x = 0;
    _bounds.y = 0;
    this.view.setBounds(_bounds);
  }

  /**
   * create core module browserview with sidebar/navbar/toolbar
   */
  create() {
    const _bounds = this.win.getContentBounds();
    _bounds.x = 0;
    _bounds.y = 0;
    this.view = new BrowserViewInstance({
      bounds: _bounds,
      partition: '<core-module>',
      preloadPath: path.join(__dirname, '../../', 'platform', 'electron-browser', 'preload.js'),
      viewPath:
        processEnv === 'development'
          ? 'http://localhost:4201'
          : `file://${path.join(__dirname, '../../', 'workbench', 'browser', 'dist', 'index.html')}`,
    }).init(this.win);
    this.view.webContents.openDevTools();
    this.view.webContents.once('dom-ready', () => {
      require('@electron/remote/main').enable(this.view.webContents);
    });
    this.watch();
  }
  watch() {
    ipcMain.on('message', this.triggleEvent);
  }
  triggleEvent(event, arg) {
    console.log(`core view ${event.frameId}: recieve render msg=>`, arg, arg.action);
    if (event.frameId !== 1) return;
    switch (arg.action) {
      case 'connect-dropdown': {
        this.win.setTopBrowserView((arg.data.action === 'show' ? subView.mainView : subView.appView).view);
        break;
      }
      case 'setBounds': {
        //sidebar shrink or expand
        break;
      }
    }
  }
  /**
   * 删除视图
   * @param view
   * @param window
   */
  remove() {
    if (!this.view) return;
    this.win.removeBrowserView(this.view);
    this.view.webContents.closeDevTools();
    ipcMain.removeListener('message', this.triggleEvent);
    this.view = undefined;
  }
}
