require('@bqy/node-module-alias/register');
import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import { LanguageService } from 'pc/app/electron-main/language.service';
import { MockServer } from 'pc/platform/node/mock-server';
import portfinder from 'portfinder';

import { UnitWorkerModule } from '../../node/test-server/electron/main';
import socket from '../../node/test-server/server/socketio';
import { processEnv } from '../../platform/node/constant';
import { ModuleManager } from '../../platform/node/extension-manager/manager';
import { proxyOpenExternal } from '../../shared/common/browserView';
import { EoUpdater } from './updater';

import * as os from 'os';
import * as path from 'path';

export const subView = {
  appView: null,
  mainView: null
};
const windowConfig = {
  width: 1280,
  height: 700
};
const store = new Store();

// 获取单实例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // 如果获取失败，说明已经有实例在运行了，直接退出
  app.quit();
}
const PROTOCOL = 'eoapi';
// app.setAsDefaultProtocolClient(PROTOCOL); // 注册协议
if (app.isPackaged) {
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, ['--']);
} else {
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1]), '--']);
}

const eoUpdater = new EoUpdater();
const mockServer = new MockServer();
let websocketPort = 13928;
(async () => {
  portfinder.basePort = websocketPort;
  // Use portfinder for port detection. If the port is found to be occupied, the port will be incremented by 1.
  websocketPort = await portfinder.getPortPromise();
  // * start SocketIO
  socket(websocketPort);
})();
const moduleManager = new ModuleManager();
global.shareObject = {
  storageResult: null
};
let eoBrowserWindow: EoBrowserWindow = null;
class EoBrowserWindow {
  // Start mock server when app inital
  win: BrowserWindow;
  constructor() {
    this.create();
  }
  private startMock() {
    mockServer.start(this.win as any);
  }
  // Start unit test function
  private startUnitTest() {
    UnitWorkerModule.setup({
      view: this.win
    });
  }
  //Watch win event
  private watch() {
    // Reload page when load page url error
    this.win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      //* Extension url error
      if (!isMainFrame) return;
      this.loadURL();
    });
    this.win.on('resize', () => {
      Object.assign(
        windowConfig,
        {
          isMaximized: this.win.isMaximized()
        },
        this.win.getNormalBounds()
      );
      store.set('winConf', windowConfig);
    });
    this.win.on('closed', $event => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.win = null;
    });
  }
  public async loadURL() {
    const file: string =
      processEnv === 'development'
        ? 'http://localhost:4200'
        : `file://${path.join(__dirname, `../../../src/browser/dist/${await LanguageService.getPath()}/index.html`)}`;
    this.win.loadURL(file);
    if (['development'].includes(processEnv)) {
      this.win.webContents.openDevTools({
        mode: 'undocked'
      });
    }
  }

  public create(): BrowserWindow {
    // Create the browser window.
    const opts = {
      useContentSize: true, // 这个要设置，不然计算显示区域尺寸不准
      frame: os.type() === 'Darwin' ? true : false, //mac use default frame
      minWidth: 400,
      minHeight: 300,
      webPreferences: {
        webSecurity: false,
        preload: path.join(__dirname, '../../', 'platform', 'electron-browser', 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
        allowRunningInsecureContent: processEnv === 'development' ? true : false
      }
    };
    Object.assign(opts, windowConfig, store.get('winConf'));
    this.win = new BrowserWindow(opts);

    proxyOpenExternal(this.win);
    this.loadURL();
    this.startMock();
    this.startUnitTest();
    this.watch();
    return this.win;
  }
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', async () => {
    setTimeout(() => {
      eoBrowserWindow = new EoBrowserWindow();
    }, 400);
    eoUpdater.check();
  });
  //!TODO only api manage app need this
  // setupUnit(subView.appView);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
    mockServer.stop();
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (eoBrowserWindow.win === null) {
      eoBrowserWindow.create();
    }
  });
  ipcMain.on('message', function (event, arg) {
    console.log('recieve render msg=>', arg, arg.action);
    //only action from mainView can be executed
    // if (event.frameId !== 1) return;
    switch (arg.action) {
      case 'minimize': {
        eoBrowserWindow.win.minimize();
        break;
      }
      case 'restore': {
        eoBrowserWindow.win.restore();
        break;
      }
      case 'maximize': {
        eoBrowserWindow.win.maximize();
        break;
      }
      case 'close': {
        eoBrowserWindow.win.close();
        break;
      }
      case 'changeLanguage': {
        LanguageService.set(arg.data);
        eoBrowserWindow.loadURL();
        moduleManager.refreshAll();
        break;
      }
    }
  });
  let loginWindow = null;
  // 这里可以封装成类+方法匹配调用，不用多个if else
  ['on', 'handle'].forEach(eventName =>
    ipcMain[eventName]('eo-sync', async (event, arg) => {
      let returnValue: any;
      if (arg.action === 'getModules') {
        returnValue = moduleManager.getModules();
      } else if (arg.action === 'getModule') {
        returnValue = moduleManager.getModule(arg.data.id);
      } else if (arg.action === 'installModule') {
        const data = await moduleManager.installExt(arg.data);
        returnValue = Object.assign(data, { modules: moduleManager.getModules() });
      } else if (arg.action === 'uninstallModule') {
        const data = await moduleManager.uninstall(arg.data);
        returnValue = Object.assign(data, { modules: moduleManager.getModules() });
      } else if (arg.action === 'getExtensionPackage') {
        returnValue = await moduleManager.getExtensionPackage(arg.data.feature, arg.data.params);
      } else if (arg.action === 'getFeature') {
        returnValue = moduleManager.getFeature(arg.data.featureKey);
      } else if (arg.action === 'getMockUrl') {
        // 获取mock服务地址
        returnValue = mockServer.getMockUrl();
      } else if (arg.action === 'getWebsocketPort') {
        // 获取websocket服务端口
        returnValue = websocketPort;
      } else if (arg.action === 'getExtTabs') {
        returnValue = moduleManager.getExtTabs(arg.data.extName);
      } else if (arg.action === 'loginWith') {
        // * It is eletron, open a new window for login
        if (loginWindow) {
          loginWindow.destroy();
          loginWindow = null;
        }
        loginWindow = new BrowserWindow({
          width: 990,
          height: 655,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: path.join(__dirname, '../../platform/electron-browser/preload.js')
          }
        });
        loginWindow.loadURL(arg.data.url);

        //* Watch the login result
        loginWindow.webContents.on('did-navigate', ($event, url = '') => {
          const isError = url.includes('request-errors');
          const isSuccess = url.includes('code=');
          if (isError || isSuccess) {
            loginWindow?.destroy();
            loginWindow = null;
            const querys = new URLSearchParams(url.split('?')?.[1]);
            eoBrowserWindow.win.webContents.send('thirdLoginCallback', {
              isSuccess: isSuccess,
              code: querys?.get('code')
            });
          }
        });

        returnValue = '';
      } else if (arg.action === 'getSidebarView') {
        returnValue = moduleManager.getSidebarView(arg.data.extName);
      } else if (arg.action === 'getSidebarViews') {
        returnValue = moduleManager.getSidebarViews();
      } else {
        returnValue = 'Invalid data';
      }
      event.returnValue = returnValue;
      return returnValue;
    })
  );
  ipcMain.on('get-system-info', event => {
    const systemInfo = {
      homeDir: path.dirname(app.getPath('exe')),
      ...process.versions,
      os: `${os.type()} ${os.arch()} ${os.release()}`
    };
    event.returnValue = systemInfo;
  });
} catch (e) {
  // Catch Error
  // throw e;
}
