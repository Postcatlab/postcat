import { BrowserView } from 'electron';
import * as path from 'path';

export class subMenu {
  constructor() {}
  create() {
    var view = new BrowserView({
      webPreferences: {
        defaultEncoding: 'utf-8',
        preload: path.join(__dirname, 'app', 'views', 'submenu', 'preload.js'),
      },
    });
    view.webContents.on('console-message', (e, level, message) => {
      console.log('Shell-Menus window says:', message)
    })
    view.webContents.loadURL('eoapi://submenu');
    return view;
  }
  relocated() {}
  show() {}
  hide() {}
}
