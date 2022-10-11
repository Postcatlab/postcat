require('@bqy/node-module-alias/register');
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { EoUpdater } from './updater';
import * as path from 'path';
import * as os from 'os';
import { ModuleManager } from '../../platform/node/extension-manager/lib/manager';
import { ModuleManagerInterface } from '../../platform/node/extension-manager';
import { processEnv } from '../../platform/node/constant';
import { proxyOpenExternal } from '../../shared/common/browserView';
import { deleteFile, readJson } from '../../shared/node/file';
import { STORAGE_TEMP as storageTemp } from '../../shared/electron-main/constant';
import { UnitWorkerModule } from '../../workbench/node/electron/main';
import Configuration from '../../platform/node/configuration/lib';
import { ConfigurationInterface } from 'src/platform/node/configuration';
import { MockServer } from 'eo/platform/node/mock-server';
import socket from '../../workbench/node/server/socketio';
import { LanguageService } from 'eo/app/electron-main/language.service';
import portfinder from 'portfinder';

export const subView = {
  appView: null,
  mainView: null,
};

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
const moduleManager: ModuleManagerInterface = new ModuleManager();
const configuration: ConfigurationInterface = Configuration();
global.shareObject = {
  storageResult: null,
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
      view: this.win,
    });
  }
  //Watch win event
  private watch() {
    // Reload page when load page url error
    this.win.webContents.on('did-fail-load', (event, errorCode) => {
      console.error('did-fail-load', errorCode);
      this.loadURL();
    });
    this.win.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.win = null;
    });
  }
  public loadURL() {
    console.log('loadURL');
    const file: string =
      processEnv === 'development'
        ? 'http://localhost:4200'
        : `file://${path.join(
            __dirname,
            `../../../src/workbench/browser/dist/${LanguageService.getPath()}/index.html`
          )}`;
    this.win.loadURL(file);
    if (['development'].includes(processEnv)) {
      this.win.webContents.openDevTools({
        mode: 'undocked',
      });
    }
  }
  public create(): BrowserWindow {
    const size = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.floor(size.width * 0.85);
    const height = Math.floor(size.height * 0.85);
    // Create the browser window.
    this.win = new BrowserWindow({
      width,
      height,
      minWidth: Math.floor(size.width * 0.5),
      minHeight: Math.floor(size.height * 0.5),
      useContentSize: true, // 这个要设置，不然计算显示区域尺寸不准
      frame: os.type() === 'Darwin' ? true : false, //mac use default frame
      webPreferences: {
        webSecurity: false,
        preload: path.join(__dirname, '../../', 'platform', 'electron-browser', 'preload.js'),
        nodeIntegration: true,
        allowRunningInsecureContent: processEnv === 'development' ? true : false,
        contextIsolation: false, // false if you want to run e2e test with Spectron
      },
    });

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
  ipcMain.on('eo-storage', (event, args) => {
    let returnValue: any;
    if (args.type === 'default' || args.type === 'remote') {
      eoBrowserWindow.win.webContents.send('eo-storage', args);
      returnValue = null;
    } else if (args.type === 'sync') {
      deleteFile(storageTemp);
      eoBrowserWindow.win.webContents.send('eo-storage', args);
      let data = readJson(storageTemp);
      let count: number = 0;
      while (data === null) {
        if (count > 1500) {
          data = {
            // status: StorageResStatus.error,
            status: 500,
            data: 'storage sync load error',
          };
          break;
        }
        data = readJson(storageTemp);
        ++count;
      }
      deleteFile(storageTemp);
      returnValue = data;
    } else if (args.type === 'result') {
      let view = subView.appView ? subView.appView?.view.webContents : eoBrowserWindow.win.webContents;
      view.send('storageCallback', args.result);
    }
  });
  // 这里可以封装成类+方法匹配调用，不用多个if else
  ['on', 'handle'].forEach((eventName) =>
    ipcMain[eventName]('eo-sync', async (event, arg) => {
      let returnValue: any;
      if (arg.action === 'getApiAccessRules') {
        // 后期加入权限生成，根据moduleID，上层moduleID，应用范围等
        // 或者是像Android, 跳出权限列表让用户自己选择确认放开的权限。
        const output: string[] = ['getModules', 'getAppModuleList', 'getSlideModuleList', 'hook'];
        returnValue = output;
      } else if (arg.action === 'getModules') {
        returnValue = moduleManager.getModules(true);
      } else if (arg.action === 'getModule') {
        returnValue = moduleManager.getModule(arg.data.moduleID);
      } else if (arg.action === 'getAppModuleList') {
        returnValue = moduleManager.getAppModuleList();
      } else if (arg.action === 'installModule') {
        const data = await moduleManager.installExt(arg.data);
        if (data.code === 0) {
          //subView.mainView.view.webContents.send('moduleUpdate');
        }
        returnValue = Object.assign(data, { modules: moduleManager.getModules() });
      } else if (arg.action === 'uninstallModule') {
        const data = await moduleManager.uninstall(arg.data);
        if (data.code === 0) {
          // subView.mainView.view.webContents.send('moduleUpdate');
        }
        returnValue = Object.assign(data, { modules: moduleManager.getModules() });
      } else if (arg.action === 'getSideModuleList') {
        returnValue = moduleManager.getSideModuleList(subView.appView?.mainModuleID || 'default');
      } else if (arg.action === 'getFeatures') {
        returnValue = moduleManager.getFeatures();
      } else if (arg.action === 'getFeature') {
        returnValue = moduleManager.getFeature(arg.data.featureKey);
      } else if (arg.action === 'saveSettings') {
        returnValue = configuration.saveSettings(arg.data);
      } else if (arg.action === 'saveModuleSettings') {
        returnValue = configuration.saveModuleSettings(arg.data.moduleID, arg.data.settings);
      } else if (arg.action === 'deleteModuleSettings') {
        returnValue = configuration.deleteModuleSettings(arg.data.moduleID);
      } else if (arg.action === 'getSettings') {
        returnValue = configuration.getSettings();
      } else if (arg.action === 'getModuleSettings') {
        returnValue = configuration.getModuleSettings(arg.data.moduleID);
      } else if (arg.action === 'getSidePosition') {
        returnValue = subView.appView?.sidePosition;
        // 获取mock服务地址
      } else if (arg.action === 'getMockUrl') {
        returnValue = mockServer.getMockUrl();
        // 获取websocket服务端口
      } else if (arg.action === 'getWebsocketPort') {
        returnValue = websocketPort;
        // 重置并初始化mock路由
      } else if (arg.action === 'hook') {
        returnValue = 'hook返回';
      } else {
        returnValue = 'Invalid data';
      }
      event.returnValue = returnValue;
      return returnValue;
    })
  );
  ipcMain.on('get-system-info', (event) => {
    const systemInfo = {
      homeDir: path.dirname(app.getPath('exe')),
      ...process.versions,
      os: `${os.type()} ${os.arch()} ${os.release()}`,
    };
    event.returnValue = systemInfo;
  });
} catch (e) {
  // Catch Error
  // throw e;
}
