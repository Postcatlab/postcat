import { app, BrowserWindow, screen, ipcMain, shell, BrowserView, session } from 'electron';
import { EoUpdater } from './updater';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as url from 'url';
import { UnitWorker } from './unitWorker';
import ModuleManager from './core/module/lib/manager';
import { ModuleInfo, ModuleManagerInterface } from './core/module/types';

let win: BrowserWindow = null;
let view: BrowserView = null;
let width: number;
let height: number;
const moduleManager: ModuleManagerInterface = ModuleManager();
const args = process.argv.slice(1),
  eoUpdater = new EoUpdater(),
  workerLoop = {},
  serve = args.some((val) => val === '--serve');
function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  width = size.width * 0.8;
  height = size.height * 0.8;
  // Create the browser window.
  win = new BrowserWindow({
    width: width,
    height: height,
    frame: os.type() === 'Darwin' ? true : false, //mac use default frame
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  //open link through default browser not electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: 'deny' };
  });
  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron')),
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';
    ['dist', 'app'].some((pathName) => {
      let htmlPath = `../${pathName}/index.html`;
      if (fs.existsSync(path.join(__dirname, htmlPath))) {
        // Path when running electron in local folder
        pathIndex = htmlPath;
      }
    });
    let loadPage = () => {
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, pathIndex),
          protocol: 'file:',
          slashes: true,
        })
      );
    };
    win.webContents.on('did-fail-load', () => {
      loadPage();
    });
    loadPage();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}



const createView = (module: ModuleInfo, window: BrowserWindow) => {
  const main = `file://${module.main}`;
  const ses = session.fromPartition("<" + module.moduleID + ">");
  ses.setPreloads([module.preload]);

  view = new BrowserView({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      webviewTag: true,
      preload: module.preload,
      session: ses,
    },
  });
  view.setBackgroundColor('#F5F5F5');
  window.setBrowserView(view);
  view.webContents.loadURL(main);
  view.webContents.once('dom-ready', () => {
    view.setBounds({ x: 0, y: 50, width: width, height: (height - 80) });
    view.setAutoResize({ width: true });
    //window.webContents.executeJavaScript(`window.pluginLoaded()`);
  });
};

const removeView = (window: BrowserWindow) => {
  if (view) {
    window.removeBrowserView(view);
    // window.webContents.executeJavaScript(`window.initRubick()`);
    view = undefined;
  }
};

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(createWindow, 400);
    eoUpdater.check();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
  ipcMain.on('message', function (event, arg) {
    console.log('recieve render msg=>', arg, arg.action);
    switch (arg.action) {
      case 'minimize': {
        win.minimize();
        break;
      }
      case 'restore': {
        win.restore();
        break;
      }
      case 'maximize': {
        win.maximize();
        break;
      }
      case 'close': {
        win.close();
        break;
      }
    }
  });
  ipcMain.on('unitTest', function (event, message) {
    let id = message.id;
    switch (message.action) {
      case 'ajax': {
        workerLoop[id] = new UnitWorker(win);
        workerLoop[id].start(message);
        break;
      }
      case 'abort': {
        workerLoop[id].kill();
        break;
      }
    }
  });
  ipcMain.on('eo', (event, args) => {
    const params = {message: 'ipcMain eo', data: moduleManager.getModules()};
    event.sender.send('eo', params);
  });

  ipcMain.on('eo-sync', (event, arg) => {
    let returnValue: any;
    if (arg.type === 'getModules') {
      returnValue = moduleManager.getModules();
    } else if (arg.type === 'openApp') {
      removeView(win);
      createView(moduleManager.getModule(arg.moduleID), win);
      returnValue = 'view id';
    } else {
      returnValue = 'Invalid data';
    }
    event.returnValue = returnValue;
  })
} catch (e) {
  // Catch Error
  // throw e;
}
