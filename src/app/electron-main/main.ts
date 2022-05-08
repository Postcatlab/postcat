import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { EoUpdater } from './updater';
import * as path from 'path';
import * as os from 'os';
import ModuleManager from '../../platform/node/extension-manager/lib/manager';
import { ModuleInfo, ModuleManagerInterface } from '../../platform/node/extension-manager';
import { StorageHandleStatus, StorageProcessType } from '../../platform/browser/IndexedDB';
import { AppViews } from './appView';
import { CoreViews } from './coreView';
import { processEnv } from '../../platform/node/constant';
import { proxyOpenExternal } from '../../shared/common/browserView';
import { deleteFile, readJson } from '../../shared/node/file';
import { STORAGE_TEMP as storageTemp } from '../../shared/common/constant';
import { UnitWorkerModule } from '../../workbench/node/unitWorker';
let win: BrowserWindow = null;
export const subView = {
  appView: null,
  mainView: null,
};
const eoUpdater = new EoUpdater();
const moduleManager: ModuleManagerInterface = ModuleManager();
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
    width: Math.round(size.width * 0.8),
    height: Math.round(size.height * 0.8),
    useContentSize: true, // 这个要设置，不然计算显示区域尺寸不准
    frame: os.type() === 'Darwin' ? true : false, //mac use default frame
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, '../../', 'platform', 'electron-browser', 'preload.js'),
      nodeIntegration: true,
      allowRunningInsecureContent: processEnv === 'serve' ? true : false,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  if (['serve'].includes(processEnv)) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '../node_modules/electron')),
    });
  }
  proxyOpenExternal(win);
  let loadPage = () => {
    const file: string =
      processEnv === 'development'
        ? 'http://localhost:4200'
        : `file://${path.join(__dirname, '../../workbench/browser/dist/index.html')}`;
    win.loadURL(file);
    win.webContents.openDevTools({
      mode: 'undocked',
    });
    UnitWorkerModule.setup({
      view: win,
    });
  };
  win.webContents.on('did-fail-load', () => {
    loadPage();
  });
  win.webContents.on('did-finish-load', () => {
    mainRemote.enable(win.webContents);
    //remove origin view
    for (var i in subView) {
      if (!subView[i]) {
        continue;
      }
      subView[i].remove();
    }
  });
  loadPage();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // resize 监听，改变bounds
  win.on('resize', () => resize());

  return win;
}

/**
 * 重置View的Bounds
 */
function resize(sideWidth?: number) {
  for (var i in subView) {
    if (!subView[i]) {
      continue;
    }
    subView[i].rebuildBounds(sideWidth);
  }
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
  // setupUnit(subView.appView);

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
    if (args.type === StorageProcessType.default || args.type === StorageProcessType.remote) {
      win.webContents.send('eo-storage', args);
      returnValue = null;
    } else if (args.type === StorageProcessType.sync) {
      deleteFile(storageTemp);
      win.webContents.send('eo-storage', args);
      let data = readJson(storageTemp);
      let count: number = 0;
      while (data === null) {
        if (count > 1500) {
          data = {
            status: StorageHandleStatus.error,
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
    } else if (arg.action === 'getSidePosition') {
      returnValue = subView.appView?.sidePosition;
    } else if (arg.action === 'hook') {
      returnValue = 'hook返回';
    } else if (arg.action === 'openApp') {
      if (arg.data.moduleID && !arg.data.moduleID.includes('@eo-core')) {
        // 如果要打开是同一app，忽略
        if (subView.appView?.mainModuleID === arg.data.moduleID) {
          return;
        }
        const module: ModuleInfo = moduleManager.getModule(arg.data.moduleID);
        if (module) {
          if (!subView.appView) subView.appView = new AppViews(win);
          subView.appView.create(module);
        }
      } else {
        if (subView.appView) {
          subView.appView.remove();
        }
      }
      returnValue = 'view id';
    } else if (arg.action === 'autoResize') {
      resize(arg.data.sideWidth);
    } else if (arg.action === 'openModal') {
      const background = arg.data.background || '#00000073';
      subView.mainView.view.webContents.executeJavaScript(`
        var mask = document.querySelector('#mask');
        if (mask) {
          mask.style.background = '${background}';
          mask.style.display = 'block';
        }
      `);
    } else if (arg.action === 'closeModal') {
      subView.mainView.view.webContents.executeJavaScript(`
        var mask = document.querySelector('#mask');
        if (mask) {
          mask.style.display = 'none';
        }
      `);
    } else {
      returnValue = 'Invalid data';
    }
    event.returnValue = returnValue;
  });
} catch (e) {
  // Catch Error
  // throw e;
}
