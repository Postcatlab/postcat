import { BrowserView, screen, BrowserWindow, session, ipcMain } from 'electron';
import * as path from 'path';
import { subView } from '../../main';
export class coreViews {
  moduleID: string;
  constructor(private win: BrowserWindow) {
    this.triggleEvent = this.triggleEvent.bind(this)
  }
  /**
   * create core module browserview with sidebar/navbar/toolbar
   */
  create() {
    const size = screen.getPrimaryDisplay().workAreaSize;
    const ses = session.fromPartition('<core-module>');
    ses.setPreloads([path.join(__dirname, 'preload.js')]);
    let view = new BrowserView({
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
        session: ses,
      },
    });
    view.webContents.loadURL('http://localhost:4201').finally();
    // view.webContents.loadURL(`file://${path.join(__dirname, 'browser', 'dist', 'index.html')}`).finally();
    view.webContents.openDevTools();
    this.win.addBrowserView(view);
    view.setBounds({
      x: 0,
      y: 0,
      width: size.width * 0.8,
      height: size.height * 0.8,
    });
    this.watch();
    return view;
  }
  watch() {
    ipcMain.on('message', this.triggleEvent);
  }
  triggleEvent(event, arg) {
    console.log(`core view ${event.frameId}: recieve render msg=>`, arg, arg.action);
    if (event.frameId !== 1) return;
    switch (arg.action) {
      case 'connect-dropdown': {
        this.win.setTopBrowserView(arg.data.action === 'show' ? subView.mainView : subView.appView);
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
  remove(view: BrowserView) {
    if (view) {
      this.win.removeBrowserView(view);
      ipcMain.removeListener('message', this.triggleEvent);
      view = undefined;
    }
  }
}
