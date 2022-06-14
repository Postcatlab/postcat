require('@bqy/node-module-alias/register');
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { EoUpdater } from './updater';
import * as path from 'path';
import * as os from 'os';
import ModuleManager from '../../platform/node/extension-manager/lib/manager';
import { ModuleManagerInterface } from '../../platform/node/extension-manager';
// TODO 引入问题
// import {
//   StorageResStatus,
//   StorageProcessType,
// } from '../../workbench/browser/src/app/shared/services/storage/index.model';
import { processEnv } from '../../platform/node/constant';
import { proxyOpenExternal } from '../../shared/common/browserView';
import { deleteFile, readJson } from '../../shared/node/file';
import { STORAGE_TEMP as storageTemp } from '../../shared/common/constant';
import { UnitWorkerModule } from '../../workbench/node/unitWorker';
import Configuration from '../../platform/node/configuration/lib';
import { ConfigurationInterface } from 'src/platform/node/configuration';
// import { MockServer } from 'eo/platform/node/mock-server';

let win: BrowserWindow = null;
export const subView = {
  appView: null,
  mainView: null,
};
const eoUpdater = new EoUpdater();
// const mockServer = new MockServer();
const moduleManager: ModuleManagerInterface = ModuleManager();
const configuration: ConfigurationInterface = Configuration();
// Remote
const mainRemote = require('@electron/remote/main');
mainRemote.initialize();
global.shareObject = {
  storageResult: null,
};

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  win = new BrowserWindow({
    width: Math.round(size.width * 0.85),
    height: Math.round(size.height * 0.85),
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
  proxyOpenExternal(win);
  let loadPage = async () => {
    const file: string =
      processEnv === 'development'
        ? 'http://localhost:4200'
        : `file://${path.join(__dirname, '../../../src/workbench/browser/dist/index.html')}`;
    win.loadURL(file);
    if (['development'].includes(processEnv)) {
      win.webContents.openDevTools({
        mode: 'undocked',
      });
    }
    UnitWorkerModule.setup({
      view: win,
    });
    // 启动mock服务
    // await mockServer.start(win as any);
  };
  win.webContents.on('did-fail-load', (event, errorCode) => {
    console.error('did-fail-load', errorCode);
    loadPage();
  });
  win.webContents.on('did-finish-load', () => {
    mainRemote.enable(win.webContents);
  });
  loadPage();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', async () => {
    setTimeout(createWindow, 400);
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
    // mockServer.stop();
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
    //only action from mainView can be executed
    if (event.frameId !== 1) return;
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

  ipcMain.on('eo-storage', (event, args) => {
    let returnValue: any;
    if (args.type === 'default' || args.type === 'remote') {
      win.webContents.send('eo-storage', args);
      returnValue = null;
    } else if (args.type === 'sync') {
      deleteFile(storageTemp);
      win.webContents.send('eo-storage', args);
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
      let view = subView.appView ? subView.appView?.view.webContents : win.webContents;
      view.send('storageCallback', args.result);
    }
  });
  // 这里可以封装成类+方法匹配调用，不用多个if else
  ipcMain.on('eo-sync', async (event, arg) => {
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
      const data = await moduleManager.install(arg.data);
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
      // returnValue = mockServer.getMockUrl();
      // 重置并初始化mock路由
    } else if (arg.action === 'hook') {
      returnValue = 'hook返回';
    } else {
      returnValue = 'Invalid data';
    }
    event.returnValue = returnValue;
  });
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
