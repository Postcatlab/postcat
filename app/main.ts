import { app, BrowserView, BrowserWindow, ipcMain, screen, shell } from 'electron';
import { EoUpdater } from './updater';
import * as path from 'path';
import * as os from 'os';
import { setupUnit } from './unitWorker';
import ModuleManager from './core/module/lib/manager';
import { ModuleManagerInterface } from './core/module/types';
import { appViews } from './views/app/app';
let win: BrowserWindow = null;
const subView = {
  appView: null,
  mainView: null,
};
const moduleManager: ModuleManagerInterface = ModuleManager();
const args = process.argv.slice(1),
  eoUpdater = new EoUpdater(),
  env = args.some((val) => val === '--serve')
    ? 'serve'
    : args.some((val) => val === '--development')
    ? 'development'
    : 'production';

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  win = new BrowserWindow({
    width: size.width * 0.8,
    height: size.height * 0.8,
    useContentSize: true, // 这个要设置，不然计算显示区域尺寸不准
    frame: os.type() === 'Darwin' ? true : false, //mac use default frame
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: env === 'serve' ? true : false,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  proxyOpenExternel(win);
  if (env === 'serve') {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron')),
    });
    win.loadURL('http://localhost:4200');
  } else {
    let loadPage = () => {
      const file: string = `file://${path.join(__dirname, 'views', 'message', 'index.html')}`;
      // const file: string = `file://${path.join(__dirname, 'views', 'default', 'dist', 'index.html')}`;
      win.loadURL(file).finally();
      // win.webContents.openDevTools();
    };
    win.webContents.on('did-fail-load', () => {
      loadPage();
    });
    win.webContents.on('did-finish-load', () => {
      subView.mainView = new BrowserView({
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true,
          contextIsolation: false,
          devTools: true,
          webviewTag: true,
        },
      });
      subView.mainView.webContents.loadURL('http://localhost:4201').finally();
      // subView.mainView.webContents.loadURL(`file://${path.join(__dirname, 'views', 'default', 'dist', 'index.html')}`).finally();
      subView.mainView.webContents.openDevTools();
      win.addBrowserView(subView.mainView);
      subView.appView = new appViews(win).create('default');
      subView.mainView.setBounds({
        x: 0,
        y: 0,
        width: size.width * 0.8,
        height: size.height * 0.8,
      });
      for (var i in subView) {
        if (!subView[i]) return;
        proxyOpenExternel(subView[i]);
      }
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
//open link through default browser not electron
function proxyOpenExternel(view) {
  view.webContents.setWindowOpenHandler(({ url }) => {
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: 'deny' };
  });
}
try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(createWindow, 400);
    eoUpdater.check();
  });
  //!TODO only api manage app need this
  setupUnit(subView.appView);
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // resize 监听，改变browserview bounds

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
      case 'connect-dropdown': {
        setTimeout(() => {
          win.setTopBrowserView(arg.data.action === 'show' ? subView.mainView : subView.appView);
        }, 0);
        break;
      }
    }
  });
  // 这里可以封装成类+方法匹配调用，不用多个if else
  ipcMain.on('eo-sync', (event, arg) => {
    let returnValue: any;
    if (arg.type === 'getApiAccessRules') {
      // 后期加入权限生成，根据moduleID，上层moduleID，应用范围等
      // 或者是像Android, 跳出权限列表让用户自己选择确认放开的权限。
      const output: string[] = ['getModules', 'getAppModuleList', 'getSlideModuleList', 'hook'];
      returnValue = output;
    } else if (arg.type === 'getModules') {
      returnValue = moduleManager.getModules(true);
    } else if (arg.type === 'getAppModuleList') {
      returnValue = moduleManager.getAppModuleList();
    } else if (arg.type === 'getSlideModuleList') {
      returnValue = moduleManager.getSlideModuleList(subView.appView.moduleID);
    } else if (arg.type === 'getSlidePosition') {
      returnValue = subView.appView.slidePosition;
    } else if (arg.type === 'hook') {
      returnValue = 'hook返回';
    } else if (arg.type === 'openApp') {
      if (arg.moduleID) {
        // 如果要打开是同一app，忽略
        if (subView.appView.moduleID === arg.moduleID) {
          return;
        }
        subView.appView = new appViews(win).create(arg.moduleID);
      }
      returnValue = 'view id';
    } else {
      returnValue = 'Invalid data';
    }
    event.returnValue = returnValue;
  });
} catch (e) {
  // Catch Error
  // throw e;
}
