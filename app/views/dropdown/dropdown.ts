import { BrowserView, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

export class Dropdown {
  view:BrowserView;
  constructor(private win:BrowserWindow) {}
  create() {
    this.view = new BrowserView({
      webPreferences: {
        defaultEncoding: 'utf-8',
        preload: path.join(__dirname, 'app', 'views', 'submenu', 'preload.js'),
      },
    });
    ipcMain.on('message', (event, arg) => {
      if (arg.action !== 'connect-dropdown') return;
      this.show()
    });
    // view.webContents.loadURL('eoapi://submenu/');
    return this.view;
  }
  relocated() {
    this.view.setBounds({
      x: 300,
      y: 300,
      width: 300,
      height: 300,
    });
    console.log('setBounds')
  }
  show() {
    this.win.addBrowserView(this.view);
    this.view.webContents.loadURL(path.join(__dirname, 'help', 'index.html')).finally();
    this.relocated()
  }
  hide() {}
}
