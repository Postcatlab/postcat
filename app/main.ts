import { app, BrowserView, BrowserWindow, ipcMain, screen, session, shell } from 'electron';
import { EoUpdater } from './updater';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as url from 'url';
import { UnitWorker } from './unitWorker';
import ModuleManager from './core/module/lib/manager';
import { ModuleInfo, ModuleManagerInterface, ModuleType } from './core/module/types';
import { getViewBounds, SlidePosition, ViewBounds, ViewZone } from './core/common/util';

let win: BrowserWindow = null;
let slidePosition: SlidePosition = SlidePosition.left;
let currentAppModuleID: string;
let lastAppModuleID: string;
const browserViews: Map<ViewZone, BrowserView> = new Map();
const moduleManager: ModuleManagerInterface = ModuleManager();
const args = process.argv.slice(1),
  eoUpdater = new EoUpdater(),
  workerLoop = {},
  env = args.some((val) => val === '--serve')?'serve':args.some((val) => val === '--development')?'development':'production';

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
      allowRunningInsecureContent: env==='serve' ? true : false,
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
  if (env==='serve') {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron')),
    });
    win.loadURL('http://localhost:4200');
  } else {
    let loadPage = () => {
      const file: string = `file://${path.join(__dirname, 'views', 'default', 'index.html')}`;
      win.loadURL(file).finally();
    };
    win.webContents.on('did-fail-load', () => {
      loadPage();
    });
    win.webContents.on('did-finish-load', () => {
      createApp('default');
      createNormalView(ViewZone.bottom, win);
      createNormalView(ViewZone.top, win);
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

/**
 * 创建标准视图，静态区域
 * @param zone
 * @param window
 */
const createNormalView = (zone: ViewZone, window: BrowserWindow): BrowserView => {
  const file: string = `file://${path.join(__dirname, 'views', zone, 'index.html')}`;
  const ses = session.fromPartition('normal_view');
  ses.setPreloads([path.join(__dirname, 'views', 'preload.js')]);
  const _view: BrowserView = new BrowserView({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      session: ses,
    },
  });
  window.addBrowserView(_view);
  const bounds = window.getContentBounds();
  const _bounds: ViewBounds = getViewBounds(zone, bounds.width, bounds.height, slidePosition);
  _view.webContents.loadURL(file).finally();
  _view.webContents.once('did-finish-load', () => {
    _view.setBackgroundColor('#FFF');
  });
  _view.webContents.once('dom-ready', () => {
    _view.setBounds(_bounds);
    if (browserViews.has(zone)) {
      removeView(browserViews.get(zone), window);
      browserViews.delete(zone);
    }
    browserViews.set(zone, _view);
    /*
    if (zone === ViewZone.top) {
      _view.webContents.openDevTools();
    }
    */
  });
  return _view;
};

/**
 * 创建主视图，主要从模块载入文件
 * @param module
 * @param window
 */
const createMainView = (module: ModuleInfo, window: BrowserWindow, refresh: boolean): BrowserView => {
  const file: string = `file://${module.main}`;
  const ses = session.fromPartition("<" + module.moduleID + ">");
  ses.setPreloads([path.join(__dirname, 'views', 'preload.js')]);
  const _view: BrowserView = new BrowserView({
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
  window.addBrowserView(_view);
  if (refresh) {
    createNormalView(ViewZone.slide, window);
  }
  const bounds = window.getContentBounds();
  const _bounds: ViewBounds = getViewBounds(ViewZone.main, bounds.width, bounds.height, slidePosition);
  _view.webContents.loadURL(file).finally();
  _view.webContents.once('did-finish-load', () => {
    _view.setBackgroundColor('#FFF');
  });
  _view.webContents.once('dom-ready', () => {
    _view.setBounds(_bounds);
    if (browserViews.has(ViewZone.main)) {
      removeView(browserViews.get(ViewZone.main), window);
      browserViews.delete(ViewZone.main);
    }
    browserViews.set(ViewZone.main, _view);
    _view.webContents.openDevTools();
    //view.setAutoResize({ width: true });
    //window.webContents.executeJavaScript(`window.getModules1()`);
  });
  return _view;
};

/**
 * 删除视图
 * @param view
 * @param window
 */
const removeView = (view: BrowserView, window: BrowserWindow) => {
  if (view) {
    window.removeBrowserView(view);
    // window.webContents.executeJavaScript(`window.init()`);
    view = undefined;
  }
};

/**
 * 根据模块ID启动app模块的加载
 * @param moduleID
 * @param load
 */
const createApp = (moduleID: string) => {
  // 如果要打开是同一app，忽略
  if (lastAppModuleID === moduleID) {
    return;
  }
  const module: ModuleInfo = moduleManager.getModule(moduleID, true);
  if (module && module.type === ModuleType.app) {
    let refresh: boolean = false;
    if (module.isApp && currentAppModuleID !== module.moduleID) {
      currentAppModuleID = module.moduleID;
      slidePosition = module.slidePosition;
      refresh = true;
    }
    lastAppModuleID = moduleID;
    createMainView(module, win, refresh);
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
      returnValue = moduleManager.getSlideModuleList(currentAppModuleID);
    } else if (arg.type === 'getSlidePosition') {
      returnValue = slidePosition;
    } else if (arg.type === 'hook') {
      returnValue = 'hook返回';
    } else if (arg.type === 'openApp') {
      if (arg.moduleID) {
        createApp(arg.moduleID);
      }
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
